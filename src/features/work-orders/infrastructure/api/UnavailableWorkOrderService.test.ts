import { expect, test } from '@jest/globals';
import { UnavailableWorkOrderService } from './UnavailableWorkOrderService';
import { WorkOrderServiceUnavailableError } from '../../application/workOrderService';

test('a origem API indica indisponibilidade na lista e no detalhe', async () => {
  const service = new UnavailableWorkOrderService();
  await expect(service.list()).rejects.toBeInstanceOf(WorkOrderServiceUnavailableError);
  await expect(service.getById('qualquer')).rejects.toBeInstanceOf(WorkOrderServiceUnavailableError);
});
