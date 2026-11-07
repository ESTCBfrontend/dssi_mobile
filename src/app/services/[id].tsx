import { router, useLocalSearchParams } from 'expo-router';
import { WorkOrderDetailScreen } from '../../features/work-orders/presentation/WorkOrderDetailScreen';
import { ThemeProvider } from '../../shared/ui/theme';

export default function WorkOrderDetailRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return <ThemeProvider><WorkOrderDetailScreen id={typeof id === 'string' ? id : ''}
    onBack={() => { if (router.canGoBack()) router.back(); else router.replace('/'); }} /></ThemeProvider>;
}
