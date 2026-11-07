import { expect, jest, test } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createConfiguredDataSource } from '../../../composition/data-source/configuredDataSource';
import { createWorkOrderServices } from '../../../composition/work-orders/workOrderServices';
import { WorkOrderSourceProvider } from '../../../composition/work-orders/WorkOrderSourceProvider';
import { ThemeProvider } from '../../../shared/ui/theme';
import { MockWorkOrders } from '../infrastructure/mock/MockWorkOrders';
import type { WorkOrderService } from '../application/workOrderService';
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
      <WorkOrderSourceProvider selection={selection} services={createWorkOrderServices(mock)}>
        <WorkOrderDetailScreen id={order.id} onBack={onBack} />
      </WorkOrderSourceProvider>
    </ThemeProvider></QueryClientProvider></SafeAreaProvider>);
  await waitFor(() => expect(screen.getByText(order.description)).toBeTruthy());
  expect(screen.getByText('Dados fictícios de teste')).toBeTruthy();
  expect(screen.getByText('PRIORIDADE')).toBeTruthy();
  expect(screen.getByText('Normal')).toBeTruthy();
  expect(screen.getByText(order.site.address!)).toBeTruthy();
  expect(screen.getByText(order.instructions!)).toBeTruthy();
  expect(screen.getByText('Por agendar')).toBeTruthy();
  expect(screen.getByText('Não atribuído')).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Voltar aos serviços' }));
  expect(onBack).toHaveBeenCalledTimes(1);
  await act(() => { mock.clear(); });
  await waitFor(() => expect(screen.getByText('Serviço não encontrado')).toBeTruthy());
  await act(() => { selection.select('api'); });
  await waitFor(() => expect(screen.getByText('A ligação à API de ordens de serviço ainda não está disponível.')).toBeTruthy());
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
      <WorkOrderSourceProvider selection={selection} services={createWorkOrderServices(mock)}>
        <WorkOrderDetailScreen id="mock-os-1" onBack={() => {}} />
      </WorkOrderSourceProvider>
    </ThemeProvider></QueryClientProvider></SafeAreaProvider>);
  await waitFor(() => expect(screen.getByText('Não foi possível carregar o serviço')).toBeTruthy());
});

test('recupera com nova tentativa e omite morada e instruções ausentes', async () => {
  const selection = createConfiguredDataSource({ development: true, debugLayerEnabled: true });
  selection.select('mock');
  const example = new MockWorkOrders().listExamples()[1];
  const order = { ...example, site: { id: example.site.id, name: example.site.name }, instructions: null };
  const getById = jest.fn<WorkOrderService['getById']>()
    .mockRejectedValueOnce(new Error('Falha temporária'))
    .mockResolvedValue(order);
  const services = createWorkOrderServices(null);
  services.mock = { list: async () => [order], getById };
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  await render(<SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 390, height: 844 },
    insets: { top: 0, right: 0, bottom: 0, left: 0 } }}><QueryClientProvider client={client}><ThemeProvider>
      <WorkOrderSourceProvider selection={selection} services={services}>
        <WorkOrderDetailScreen id={order.id} onBack={() => {}} />
      </WorkOrderSourceProvider>
    </ThemeProvider></QueryClientProvider></SafeAreaProvider>);
  await waitFor(() => expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeTruthy());
  expect(screen.queryByText(order.description)).toBeNull();
  await fireEvent.press(screen.getByRole('button', { name: 'Tentar novamente' }));
  await waitFor(() => expect(screen.getByText(order.description)).toBeTruthy());
  expect(screen.getByText('06/11/2026')).toBeTruthy();
  expect(screen.getByText('João Almeida')).toBeTruthy();
  expect(screen.queryByText('MORADA DA INTERVENÇÃO')).toBeNull();
  expect(screen.queryByText('INSTRUÇÕES')).toBeNull();
  expect(screen.queryByText('Não foi possível carregar o serviço')).toBeNull();
  expect(getById).toHaveBeenCalledTimes(2);
  expect(getById).toHaveBeenLastCalledWith(order.id);
});
