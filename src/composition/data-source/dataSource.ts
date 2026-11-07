import { logger } from '../../shared/infrastructure/logging/logger';

export type DataSource = 'api' | 'mock';

type DataSourceOptions = {
  configuredSource?: string;
  allowRuntimeSelection: boolean;
};

export class DataSourceSelection {
  private currentSource: DataSource;
  private readonly allowRuntimeSelection: boolean;
  private readonly listeners = new Set<() => void>();

  constructor({ configuredSource, allowRuntimeSelection }: DataSourceOptions) {
    if (configuredSource !== undefined && configuredSource !== 'api' && configuredSource !== 'mock') {
      throw new Error('Origem de dados inválida.');
    }
    this.currentSource = configuredSource ?? 'api';
    this.allowRuntimeSelection = allowRuntimeSelection;
  }

  get source(): DataSource { return this.currentSource; }
  get canSelect(): boolean { return this.allowRuntimeSelection; }
  getSnapshot = (): DataSource => this.currentSource;
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };

  select(source: DataSource): void {
    if (!this.allowRuntimeSelection) throw new Error('A alteração da origem de dados não está disponível nesta build.');
    if (source !== 'api' && source !== 'mock') throw new Error('Origem de dados inválida.');
    if (source === this.currentSource) return;
    const previousSource = this.currentSource;
    this.currentSource = source;
    logger.log('info', { area: 'origem-dados', operation: 'selecionar', result: 'sucesso', source, previousSource });
    for (const listener of this.listeners) listener();
  }
}
