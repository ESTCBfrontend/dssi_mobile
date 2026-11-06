import type { Intervention } from '../../domain/intervention';
import { logger } from '../../../../shared/infrastructure/logging/logger';
import { loadMockInterventions } from './loadMockInterventions';

type AddResult = 'added' | 'existing' | 'missing-order';

function copy(item: Intervention): Intervention {
  return { ...item, technician: { ...item.technician }, materials: [...item.materials] };
}

/** Dados provisórios em memória; a ordem associada é verificada na composição. */
export class MockInterventions {
  private readonly examples = loadMockInterventions();
  private readonly items = new Map<string, Intervention>();
  private readonly listeners = new Set<() => void>();

  constructor(private readonly hasWorkOrder: (id: string) => boolean) {}

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };
  private notify(): void { for (const listener of this.listeners) listener(); }
  listExamples(): Intervention[] { return this.examples.map(copy); }

  addExample(id: string): AddResult {
    const example = this.examples.find(item => item.id === id);
    if (!example) throw new Error('Exemplo de intervenção fictícia não encontrado.');
    let result: AddResult;
    if (this.items.has(id)) result = 'existing';
    else if (!this.hasWorkOrder(example.workOrderId)) result = 'missing-order';
    else { this.items.set(id, copy(example)); logger.mockExample('intervencoes', example); this.notify(); result = 'added'; }
    logger.log(result === 'missing-order' ? 'warn' : 'info', { area: 'intervencoes-mock', operation: 'adicionar', result, count: this.items.size });
    return result;
  }

  addAll(): { added: number; existing: number; missingOrder: number } {
    const result = { added: 0, existing: 0, missingOrder: 0 };
    for (const item of this.examples) {
      const state = this.addExample(item.id);
      if (state === 'missing-order') result.missingOrder++;
      else result[state]++;
    }
    return result;
  }

  clear(): number {
    const count = this.items.size;
    this.items.clear();
    if (count) this.notify();
    logger.log('info', { area: 'intervencoes-mock', operation: 'limpar', result: 'success', count });
    return count;
  }

  async listByWorkOrder(workOrderId: string): Promise<Intervention[]> {
    const result = Array.from(this.items.values()).filter(item => item.workOrderId === workOrderId).map(copy);
    logger.log('info', { area: 'intervencoes-mock', operation: 'listar', result: 'success', count: result.length });
    return result;
  }
}
