import { expect, jest, test } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { PropsWithChildren } from 'react';
import type { WorkOrderService } from '../../application/workOrderService';
import type { WorkOrder } from '../../domain/workOrder';
import { WorkOrderServiceProvider } from './WorkOrderServiceProvider';
import { useWorkOrder, useWorkOrders } from './useWorkOrders';

const order: WorkOrder = { id: 'os-teste', code: 'OS-TESTE', client: { id: 'cliente-teste', name: 'Cliente fictício' },
  site: { id: 'local-teste', name: 'Local fictício' }, serviceType: 'Assistência', description: 'Consulta de teste',
  status: 'NOVA', priority: 'NORMAL', scheduledDate: null, assignedTechnician: null, instructions: null };

function setup(service: WorkOrderService) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return ({ children }: PropsWithChildren) => <QueryClientProvider client={client}>
    <WorkOrderServiceProvider value={{ service, source: 'api', cacheScope: ['api'] }}>{children}</WorkOrderServiceProvider>
  </QueryClientProvider>;
}

test('mantém os dados disponíveis durante uma atualização em segundo plano', async () => {
  let complete!: (orders: WorkOrder[]) => void;
  const pending = new Promise<WorkOrder[]>(resolve => { complete = resolve; });
  const list = jest.fn<WorkOrderService['list']>().mockResolvedValueOnce([order]).mockImplementationOnce(() => pending);
  const wrapper = setup({ list, getById: async () => null });
  const { result } = await renderHook(() => useWorkOrders(), { wrapper });
  await waitFor(() => expect(result.current.orders).toHaveLength(1));
  await act(() => { result.current.reload(); });
  await waitFor(() => expect(result.current.refreshing).toBe(true));
  expect(result.current.loading).toBe(false);
  expect(result.current.orders[0].id).toBe(order.id);
  await act(async () => { complete([]); await pending; });
  await waitFor(() => expect(result.current.refreshing).toBe(false));
  expect(result.current.orders).toEqual([]);
});

test('ao mudar de identificador não apresenta o detalhe da ordem anterior', async () => {
  const getById = jest.fn<WorkOrderService['getById']>().mockImplementation(async id => id === order.id ? order : null);
  const wrapper = setup({ list: async () => [], getById });
  const { result, rerender } = await renderHook(({ id }: { id: string }) => useWorkOrder(id),
    { wrapper, initialProps: { id: order.id } });
  await waitFor(() => expect(result.current.order?.id).toBe(order.id));
  await rerender({ id: 'inexistente' });
  expect(result.current.order).toBeNull();
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.order).toBeNull();
  expect(result.current.error).toBeNull();
  expect(getById).toHaveBeenCalledWith('inexistente');
});
