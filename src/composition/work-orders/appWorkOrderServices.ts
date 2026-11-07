import { ENABLE_DEBUG_LAYER } from '../debug/debugConfig';
import { appDataSource } from '../data-source/appDataSource';
import { createWorkOrderServices } from './workOrderServices';

const mock = appDataSource.source === 'mock' || (__DEV__ && ENABLE_DEBUG_LAYER)
  ? (require('./mockWorkOrders') as typeof import('./mockWorkOrders')).mockWorkOrders
  : null;

export const appWorkOrderServices = createWorkOrderServices(mock);
