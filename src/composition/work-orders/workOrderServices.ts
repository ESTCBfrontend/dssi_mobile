import type { WorkOrderService } from '../../features/work-orders/application/workOrderService';
import { UnavailableWorkOrderService } from '../../features/work-orders/infrastructure/api/UnavailableWorkOrderService';

/** A notificação de alterações é específica dos controlos de desenvolvimento. */
export type MockWorkOrderChanges = {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => { scenario: string };
};
export type WorkOrderServices = {
  api: WorkOrderService;
  mock: WorkOrderService | null;
  mockChanges: MockWorkOrderChanges | null;
};

export function createWorkOrderServices(mock: (WorkOrderService & MockWorkOrderChanges) | null): WorkOrderServices {
  return { api: new UnavailableWorkOrderService(), mock, mockChanges: mock };
}
