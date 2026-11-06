import type { WorkOrder } from '../../domain/workOrder';
import { logger } from '../../../../shared/infrastructure/logging/logger';
import { loadMockWorkOrders } from './loadMockWorkOrders';

export type MockScenario = 'normal' | 'empty' | 'error' | 'slow';
type Snapshot = { scenario: MockScenario; count: number };
let nextListCorrelation = 0;

function copy(order: WorkOrder): WorkOrder {
  return { ...order, client: { ...order.client }, site: { ...order.site },
    assignedTechnician: order.assignedTechnician ? { ...order.assignedTechnician } : null };
}

/** Dados fictícios em memória; não efetua pedidos de rede. */
export class MockWorkOrders {
  private readonly examples = loadMockWorkOrders();
  private orders = this.examples.map(copy);
  private snapshot: Snapshot = { scenario: 'normal', count: this.orders.length };
  private readonly listeners = new Set<() => void>();
  private readonly resetListeners = new Set<() => void>();

  getSnapshot = (): Snapshot => this.snapshot;
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };
  subscribeReset = (listener: () => void): (() => void) => {
    this.resetListeners.add(listener);
    return () => { this.resetListeners.delete(listener); };
  };
  hasWorkOrder(id: string): boolean { return this.orders.some(order => order.id === id); }
  listExamples(): WorkOrder[] { return this.examples.map(copy); }
  private notifyReset(): void { for (const listener of this.resetListeners) listener(); }

  private notify(operation: 'cenario' | 'adicionar' | 'limpar' | 'repor', counts?: { added: number; skipped: number }): void {
    this.snapshot = { scenario: this.snapshot.scenario, count: this.orders.length };
    logger.log('info', { area: 'ordens-mock', operation, result: 'sucesso', count: this.orders.length,
      ...(operation === 'cenario' ? { scenario: this.snapshot.scenario } : {}), ...counts });
    for (const listener of this.listeners) listener();
  }

  selectScenario(scenario: MockScenario): void {
    if (!['normal', 'empty', 'error', 'slow'].includes(scenario)) throw new Error('Cenário mock inválido.');
    this.snapshot = { ...this.snapshot, scenario };
    this.orders = scenario === 'normal' || scenario === 'slow' ? this.examples.map(copy) : [];
    this.notifyReset();
    this.notify('cenario');
  }

  addAll(): { added: number; skipped: number } {
    const ids = new Set(this.orders.map(order => order.id));
    const missing = this.examples.filter(order => !ids.has(order.id));
    this.orders.push(...missing.map(copy));
    for (const example of missing) logger.mockExample('ordens', example);
    this.notify('adicionar', { added: missing.length, skipped: this.examples.length - missing.length });
    return { added: missing.length, skipped: this.examples.length - missing.length };
  }

  addExample(id: string): 'added' | 'existing' {
    const example = this.examples.find(order => order.id === id);
    if (!example) throw new Error('Exemplo de ordem fictícia não encontrado.');
    if (this.hasWorkOrder(id)) {
      logger.log('info', { area: 'ordens-mock', operation: 'adicionar', result: 'existente', count: this.orders.length });
      return 'existing';
    }
    this.orders.push(copy(example));
    logger.mockExample('ordens', example);
    this.notify('adicionar');
    return 'added';
  }

  clear(): void { this.orders = []; this.notifyReset(); this.notify('limpar'); }
  reset(): void {
    this.orders = this.snapshot.scenario === 'normal' || this.snapshot.scenario === 'slow' ? this.examples.map(copy) : [];
    this.notifyReset();
    this.notify('repor');
  }

  async list(): Promise<WorkOrder[]> {
    const scenario = this.snapshot.scenario;
    const correlation = ++nextListCorrelation;
    const startedAt = Date.now();
    logger.log('info', { area: 'ordens-mock', operation: 'listar', result: 'iniciada', correlation, scenario });
    if (scenario === 'slow') await new Promise<void>(resolve => setTimeout(resolve, 1200));
    const durationMs = Math.max(0, Date.now() - startedAt);
    if (scenario === 'error') {
      logger.log('error', { area: 'ordens-mock', operation: 'listar', result: 'erro', correlation, durationMs, scenario });
      throw new Error('Erro simulado no serviço de ordens de serviço.');
    }
    logger.log('info', { area: 'ordens-mock', operation: 'listar', result: 'sucesso', count: this.orders.length, correlation, durationMs, scenario });
    return this.orders.map(copy);
  }
}
