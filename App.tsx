import { router } from 'expo-router';
import { WorkOrdersScreen } from './src/features/work-orders/presentation/WorkOrdersScreen';

export default function App() {
  return <WorkOrdersScreen onOpenOrder={id => router.push({ pathname: '/services/[id]', params: { id } })} />;
}
