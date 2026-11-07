import { expect, jest, test } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createConfiguredDataSource } from '../../../composition/data-source/configuredDataSource';
import { ThemeProvider } from '../../../shared/ui/theme';
import { MockWorkOrders } from '../infrastructure/mock/MockWorkOrders';
import { WorkOrderDetailScreen } from './WorkOrderDetailScreen';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

test('consulta o detalhe mock, regressa e reage à remoção e à mudança de origem', async () => {
  const selection = createConfiguredDataSource({ development: true, debugLayerEnabled: true });
  selection.select('mock');
  const mock = new MockWorkOrders();
  const order = mock.listExamples()[0];
  const onBack = jest.fn();
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  await render(<SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 390, height: 844 },
    insets: { top: 0, right: 0, bottom: 0, left: 0 } }}><QueryClientProvider client={client}><ThemeProvider>
      <WorkOrderDetailScreen id={order.id} selection={selection} mock={mock} onBack={onBack} />
    </ThemeProvider></QueryClientProvider></SafeAreaProvider>);
  await waitFor(() => expect(screen.getByText(order.description)).toBeTruthy());
  expect(screen.getByText('Dados fictícios de teste')).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Voltar aos serviços' }));
  expect(onBack).toHaveBeenCalledTimes(1);
  await act(() => { mock.clear(); });
  await waitFor(() => expect(screen.getByText('Serviço não encontrado')).toBeTruthy());
  await act(() => { selection.select('api'); });
  expect(screen.getByText('A ligação à API de ordens de serviço ainda não está disponível.')).toBeTruthy();
  expect(screen.queryByText(order.description)).toBeNull();
});

test('mostra o erro simulado em vez de apresentar detalhes antigos', async () => {
  const selection = createConfiguredDataSource({ development: true, debugLayerEnabled: true });
  selection.select('mock');
  const mock = new MockWorkOrders();
  mock.selectScenario('error');
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  await render(<SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 390, height: 844 },
    insets: { top: 0, right: 0, bottom: 0, left: 0 } }}><QueryClientProvider client={client}><ThemeProvider>
      <WorkOrderDetailScreen id="mock-os-1" selection={selection} mock={mock} onBack={() => {}} />
    </ThemeProvider></QueryClientProvider></SafeAreaProvider>);
  await waitFor(() => expect(screen.getByText('Não foi possível carregar o serviço')).toBeTruthy());
});
