import { WorkOrderServiceUnavailableError, type WorkOrderService } from '../../application/workOrderService';

/** A integração HTTP ainda não foi acordada nem implementada. */
export class UnavailableWorkOrderService implements WorkOrderService {
  async list(): ReturnType<WorkOrderService['list']> { throw new WorkOrderServiceUnavailableError(); }
  async getById(_id: string): ReturnType<WorkOrderService['getById']> { throw new WorkOrderServiceUnavailableError(); }
}
