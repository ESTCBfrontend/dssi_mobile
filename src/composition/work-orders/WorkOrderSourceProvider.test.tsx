import { expect, jest, test } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { PropsWithChildren } from 'react';
import { createConfiguredDataSource } from '../data-source/configuredDataSource';
import { MockWorkOrders } from '../../features/work-orders/infrastructure/mock/MockWorkOrders';
import { useWorkOrder, useWorkOrders } from '../../features/work-orders/presentation/hooks/useWorkOrders';
import { createWorkOrderServices } from './workOrderServices';
import { WorkOrderSourceProvider } from './WorkOrderSourceProvider';

function setup() {
  const selection = createConfiguredDataSource({ development: true, debugLayerEnabled: true });
  const mock = new MockWorkOrders();
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  const services = createWorkOrderServices(mock);
  const wrapper = ({ children }: PropsWithChildren) => <QueryClientProvider client={client}>
    <WorkOrderSourceProvider selection={selection} services={services}>{children}</WorkOrderSourceProvider>
  </QueryClientProvider>;
  return { selection, mock, services, wrapper };
}

test('a API indisponível não consulta nem mostra as ordens fictícias', async () => {
  const { mock, wrapper } = setup();
  const list = jest.spyOn(mock, 'list');
  const { result } = await renderHook(() => useWorkOrders(), { wrapper });
  await waitFor(() => expect(result.current.error).toMatch(/API.*não está disponível/));
  expect(result.current.orders).toHaveLength(0);
  expect(list).not.toHaveBeenCalled();
});

test('separa consultas de técnicos e não aplica o contexto fictício à API', async () => {
  const { selection, mock, services, wrapper } = setup();
  const example = mock.listExamples()[1];
  const apiList = jest.fn<() => Promise<typeof example[]>>().mockResolvedValue([example]);
  services.api = { list: apiList, getById: async () => example };
  selection.select('mock');
  const { result } = await renderHook(() => ({ list: useWorkOrders(), detail: useWorkOrder(example.id) }), { wrapper });
  await waitFor(() => expect(result.current.list.orders).toHaveLength(7));
  await act(() => { mock.selectTechnician('mock-tech-1'); });
  await waitFor(() => expect(result.current.list.orders.map(order => order.id)).toEqual(['mock-os-2', 'mock-os-5']));
  await waitFor(() => expect(result.current.detail.order?.id).toBe(example.id));
  await act(() => { mock.selectTechnician('TEC-1002'); });
  expect(result.current.detail.order).toBeNull();
  await waitFor(() => expect(result.current.list.orders.map(order => order.id)).toEqual(['mock-os-4', 'mock-os-6']));
  expect(result.current.detail.mockContextLabel).toBe('Técnico fictício: Mariana Ferreira');
  await act(() => { selection.select('api'); });
  await waitFor(() => expect(result.current.list.orders.map(order => order.id)).toEqual([example.id]));
  await waitFor(() => expect(result.current.detail.order?.id).toBe(example.id));
  expect(result.current.list.mockContextLabel).toBeNull();
  const calls = apiList.mock.calls.length;
  await act(() => { mock.selectTechnician('mock-tech-1'); });
  expect(apiList).toHaveBeenCalledTimes(calls);
  await act(() => { selection.select('mock'); });
  await waitFor(() => expect(result.current.detail.order?.id).toBe(example.id));
  expect(result.current.list.orders.map(order => order.id)).toEqual(['mock-os-2', 'mock-os-5']);
});

test('atualiza a listagem quando os dados mock mudam e deixa de os mostrar ao selecionar API', async () => {
  const { selection, mock, wrapper } = setup();
  selection.select('mock');
  const { result } = await renderHook(() => useWorkOrders(), { wrapper });
  await waitFor(() => expect(result.current.orders).toHaveLength(7));
  await act(() => { mock.clear(); });
  await waitFor(() => expect(result.current.loading).toBe(false));
  await waitFor(() => expect(result.current.orders).toHaveLength(0));
  await act(() => { mock.addExample('mock-os-1'); });
  await waitFor(() => expect(result.current.orders).toHaveLength(1));
  await act(() => { selection.select('api'); });
  expect(result.current.orders).toHaveLength(0);
  await waitFor(() => expect(result.current.error).toMatch(/API.*não está disponível/));
});

test('apresenta erro simulado e recupera ao mudar de cenário', async () => {
  const { selection, mock, wrapper } = setup();
  selection.select('mock');
  mock.selectScenario('error');
  const { result } = await renderHook(() => useWorkOrders(), { wrapper });
  await waitFor(() => expect(result.current.error).toMatch(/Não foi possível/));
  await act(() => { mock.selectScenario('normal'); });
  await waitFor(() => expect(result.current.orders).toHaveLength(7));
  expect(result.current.error).toBeNull();
});

test('consulta o detalhe pela implementação selecionada e acompanha remoções', async () => {
  const { selection, mock, wrapper } = setup();
  selection.select('mock');
  const getById = jest.spyOn(mock, 'getById');
  const { result } = await renderHook(() => useWorkOrder('mock-os-1'), { wrapper });
  await waitFor(() => expect(result.current.order?.id).toBe('mock-os-1'));
  expect(getById).toHaveBeenCalledWith('mock-os-1');
  await act(() => { mock.clear(); });
  await waitFor(() => expect(result.current.order).toBeNull());
  await act(() => { selection.select('api'); });
  await waitFor(() => expect(result.current.error).toMatch(/API.*não está disponível/));
});

test('permite trocar o serviço API pelo mesmo contrato sem alterar a consulta', async () => {
  const { mock, services, wrapper } = setup();
  const example = mock.listExamples()[0];
  const list = jest.fn<() => Promise<typeof example[]>>().mockResolvedValue([example]);
  const getById = jest.fn<(id: string) => Promise<typeof example | null>>().mockResolvedValue(example);
  services.api = { list, getById };
  const { result } = await renderHook(() => useWorkOrders(), { wrapper });
  await waitFor(() => expect(result.current.orders[0]?.id).toBe(example.id));
  expect(list).toHaveBeenCalled();
  const detail = await renderHook(() => useWorkOrder(example.id), { wrapper });
  await waitFor(() => expect(detail.result.current.order?.id).toBe(example.id));
  expect(getById).toHaveBeenCalledWith(example.id);
});
