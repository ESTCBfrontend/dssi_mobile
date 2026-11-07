import { WorkOrdersScreen } from './src/features/work-orders/presentation/WorkOrdersScreen';
import { ThemeProvider } from './src/shared/ui/theme';

export default function App() {
  return <ThemeProvider><WorkOrdersScreen /></ThemeProvider>;
}
