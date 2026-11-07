import type { WorkOrder } from '../domain/workOrder';

/** Contrato local de consulta; não define o formato HTTP nem permissões de acesso. */
export interface WorkOrderService {
  list(): Promise<WorkOrder[]>;
  getById(id: string): Promise<WorkOrder | null>;
}

/** Indisponibilidade da integração, distinta de uma ordem não encontrada. */
export class WorkOrderServiceUnavailableError extends Error {
  constructor() { super('Serviço de ordens indisponível.'); }
}
