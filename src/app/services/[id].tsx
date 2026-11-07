import { router, useLocalSearchParams } from 'expo-router';
import { appDataSource } from '../../composition/data-source/appDataSource';
import { ENABLE_DEBUG_LAYER } from '../../composition/debug/debugConfig';
import { WorkOrderDetailScreen } from '../../features/work-orders/presentation/WorkOrderDetailScreen';
import { ThemeProvider } from '../../shared/ui/theme';

const mockWorkOrders = __DEV__ && ENABLE_DEBUG_LAYER
  ? (require('../../composition/work-orders/mockWorkOrders') as typeof import('../../composition/work-orders/mockWorkOrders')).mockWorkOrders
  : null;

export default function WorkOrderDetailRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return <ThemeProvider><WorkOrderDetailScreen id={typeof id === 'string' ? id : ''} selection={appDataSource} mock={mockWorkOrders}
    onBack={() => { if (router.canGoBack()) router.back(); else router.replace('/'); }} /></ThemeProvider>;
}
