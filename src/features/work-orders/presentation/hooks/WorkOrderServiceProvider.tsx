import { createContext, useContext, type PropsWithChildren } from 'react';
import type { WorkOrderService } from '../../application/workOrderService';

export type WorkOrderAccess = {
  service: WorkOrderService | null;
  source: 'api' | 'mock';
  cacheScope: readonly string[];
};

const WorkOrderContext = createContext<WorkOrderAccess | null>(null);

/** Recebe um contrato já selecionado; não constrói API, mocks ou controlos de debug. */
export function WorkOrderServiceProvider({ value, children }: PropsWithChildren<{ value: WorkOrderAccess }>) {
  return <WorkOrderContext.Provider value={value}>{children}</WorkOrderContext.Provider>;
}

export function useWorkOrderAccess(): WorkOrderAccess {
  const access = useContext(WorkOrderContext);
  if (!access) throw new Error('A consulta de ordens requer WorkOrderServiceProvider.');
  return access;
}
