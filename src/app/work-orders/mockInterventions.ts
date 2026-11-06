import { MockInterventions } from '../../features/interventions/infrastructure/mock/MockInterventions';
import { mockWorkOrders } from './mockWorkOrders';

export const mockInterventions = new MockInterventions(id => mockWorkOrders.hasWorkOrder(id));
mockWorkOrders.subscribeReset(() => mockInterventions.clear());
