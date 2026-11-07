import { expect, jest, test } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import App from '../App';
import { WorkOrderSourceProvider } from '../src/composition/work-orders/WorkOrderSourceProvider';
import { appDataSource } from '../src/composition/data-source/appDataSource';
import { appWorkOrderServices } from '../src/composition/work-orders/appWorkOrderServices';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

test('apresenta a página inicial da aplicação', async () => {
  const client = new QueryClient({ defaultOptions: { queries: { gcTime: 0 } } });
  await render(<SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 390, height: 844 },
    insets: { top: 0, right: 0, bottom: 0, left: 0 } }}><QueryClientProvider client={client}>
      <WorkOrderSourceProvider selection={appDataSource} services={appWorkOrderServices}><App /></WorkOrderSourceProvider>
    </QueryClientProvider></SafeAreaProvider>);
  expect(screen.getByRole('header', { name: 'Os meus serviços' })).toBeTruthy();
});
