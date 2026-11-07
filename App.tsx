import { appDataSource } from './src/composition/data-source/appDataSource';
import { ENABLE_DEBUG_LAYER } from './src/composition/debug/debugConfig';
import { WorkOrdersScreen } from './src/features/work-orders/presentation/WorkOrdersScreen';
import { ThemeProvider } from './src/shared/ui/theme';

const mockWorkOrders = __DEV__ && ENABLE_DEBUG_LAYER
  ? (require('./src/composition/work-orders/mockWorkOrders') as typeof import('./src/composition/work-orders/mockWorkOrders')).mockWorkOrders
  : null;

export default function App() {
  return <ThemeProvider><WorkOrdersScreen selection={appDataSource} mock={mockWorkOrders} /></ThemeProvider>;
}
