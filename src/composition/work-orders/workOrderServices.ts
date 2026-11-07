import type { WorkOrderService } from '../../features/work-orders/application/workOrderService';
import { UnavailableWorkOrderService } from '../../features/work-orders/infrastructure/api/UnavailableWorkOrderService';

/** O serviço do contexto fica ligado ao técnico selecionado nesse instante. */
export type MockWorkOrderSnapshot = { scenario: string; technicianId: string | null;
  technicianLabel: string | null; service: WorkOrderService | null };

/** O contexto e as notificações são específicos dos controlos de desenvolvimento. */
export type MockWorkOrderChanges = {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => MockWorkOrderSnapshot;
};
export type WorkOrderServices = {
  api: WorkOrderService;
  mock: WorkOrderService | null;
  mockChanges: MockWorkOrderChanges | null;
};

export function createWorkOrderServices(mock: (WorkOrderService & MockWorkOrderChanges) | null): WorkOrderServices {
  return { api: new UnavailableWorkOrderService(), mock, mockChanges: mock };
}
