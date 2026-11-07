import { expect, jest, test } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createConfiguredDataSource } from '../../../composition/data-source/configuredDataSource';
import { createWorkOrderServices } from '../../../composition/work-orders/workOrderServices';
import { WorkOrderSourceProvider } from '../../../composition/work-orders/WorkOrderSourceProvider';
import { MockWorkOrders } from '../infrastructure/mock/MockWorkOrders';
import { ThemeProvider } from '../../../shared/ui/theme';
import { WorkOrdersScreen } from './WorkOrdersScreen';
import { router } from 'expo-router';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));
jest.mock('expo-router', () => ({ router: { push: jest.fn() } }));

test('seleciona Mock, mostra os serviços e acompanha alterações do Debug Menu', async () => {
  const selection = createConfiguredDataSource({ development: true, debugLayerEnabled: true });
  const mock = new MockWorkOrders();
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  await render(<SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 390, height: 844 },
    insets: { top: 0, right: 0, bottom: 0, left: 0 } }}><QueryClientProvider client={client}><ThemeProvider>
      <WorkOrderSourceProvider selection={selection} services={createWorkOrderServices(mock)}><WorkOrdersScreen /></WorkOrderSourceProvider>
    </ThemeProvider></QueryClientProvider></SafeAreaProvider>);
  await waitFor(() => expect(screen.getByText('A ligação à API de ordens de serviço ainda não está disponível.')).toBeTruthy());
  await act(() => { selection.select('mock'); });
  await waitFor(() => expect(screen.getByText('OS-EXEMPLO-001')).toBeTruthy());
  expect(screen.getByText('Dados fictícios de teste')).toBeTruthy();
  expect(screen.getAllByRole('text', { name: 'Prioridade: Normal' }).length).toBeGreaterThan(0);
  expect(screen.queryByRole('button', { name: /^(Ver intervenção|Acompanhar):/ })).toBeNull();
  for (const number of [1, 4, 7]) {
    await fireEvent.press(screen.getByRole('button', { name: `Ver serviço: OS-EXEMPLO-00${number}` }));
    expect(router.push).toHaveBeenLastCalledWith({ pathname: '/services/[id]', params: { id: `mock-os-${number}` } });
  }
  await fireEvent.press(screen.getByRole('button', { name: /Por agendar/ }));
  expect(screen.queryByText('OS-EXEMPLO-002')).toBeNull();
  await act(() => { mock.selectScenario('empty'); });
  await waitFor(() => expect(screen.getByText('Não há serviços para apresentar.')).toBeTruthy());
  await act(() => { mock.selectScenario('error'); });
  await waitFor(() => expect(screen.getByText('Não foi possível carregar as ordens')).toBeTruthy());
  await act(() => { mock.selectScenario('slow'); });
  expect(screen.getByRole('progressbar', { name: 'A carregar serviços…' })).toBeTruthy();
  await waitFor(() => expect(screen.getByText('OS-EXEMPLO-001')).toBeTruthy(), { timeout: 3000 });
});

test.each([
  ['ALTA', 'Alta'],
  ['BAIXA', 'Baixa'],
  ['PRIORIDADE_FUTURA', 'PRIORIDADE_FUTURA'],
])('apresenta os dados do contrato API com prioridade %s', async (priority, label) => {
  const selection = createConfiguredDataSource({ development: true, debugLayerEnabled: true });
  const example = { ...new MockWorkOrders().listExamples()[0], priority };
  const services = createWorkOrderServices(null);
  services.api = { list: async () => [example], getById: async () => example };
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  await render(<SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 390, height: 844 },
    insets: { top: 0, right: 0, bottom: 0, left: 0 } }}><QueryClientProvider client={client}><ThemeProvider>
      <WorkOrderSourceProvider selection={selection} services={services}><WorkOrdersScreen /></WorkOrderSourceProvider>
    </ThemeProvider></QueryClientProvider></SafeAreaProvider>);
  await waitFor(() => expect(screen.getByText(example.code)).toBeTruthy());
  expect(screen.getByRole('button', { name: /Todos \(1\)/ })).toBeTruthy();
  expect(screen.getByRole('text', { name: `Prioridade: ${label}` })).toBeTruthy();
  expect(screen.queryByText('Dados fictícios de teste')).toBeNull();
});
