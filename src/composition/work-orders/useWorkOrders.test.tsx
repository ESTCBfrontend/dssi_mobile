import { expect, jest, test } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { PropsWithChildren } from 'react';
import { createConfiguredDataSource } from '../data-source/configuredDataSource';
import { MockWorkOrders } from '../../features/work-orders/infrastructure/mock/MockWorkOrders';
import { useWorkOrders } from './useWorkOrders';

function setup() {
  const selection = createConfiguredDataSource({ development: true, debugLayerEnabled: true });
  const mock = new MockWorkOrders();
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  const wrapper = ({ children }: PropsWithChildren) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  return { selection, mock, wrapper };
}

test('a API indisponível não consulta nem mostra as ordens fictícias', async () => {
  const { selection, mock, wrapper } = setup();
  const list = jest.spyOn(mock, 'list');
  const { result } = await renderHook(() => useWorkOrders(selection, mock), { wrapper });
  expect(result.current.error).toMatch(/API.*não está disponível/);
  expect(result.current.orders).toHaveLength(0);
  expect(list).not.toHaveBeenCalled();
});

test('atualiza a listagem quando os dados mock mudam e deixa de os mostrar ao selecionar API', async () => {
  const { selection, mock, wrapper } = setup();
  selection.select('mock');
  const { result } = await renderHook(() => useWorkOrders(selection, mock), { wrapper });
  await waitFor(() => expect(result.current.orders).toHaveLength(7));
  await act(() => { mock.clear(); });
  await waitFor(() => expect(result.current.loading).toBe(false));
  await waitFor(() => expect(result.current.orders).toHaveLength(0));
  await act(() => { mock.addExample('mock-os-1'); });
  await waitFor(() => expect(result.current.orders).toHaveLength(1));
  await act(() => { selection.select('api'); });
  expect(result.current.orders).toHaveLength(0);
  expect(result.current.error).toMatch(/API.*não está disponível/);
});

test('apresenta erro simulado e recupera ao mudar de cenário', async () => {
  const { selection, mock, wrapper } = setup();
  selection.select('mock');
  mock.selectScenario('error');
  const { result } = await renderHook(() => useWorkOrders(selection, mock), { wrapper });
  await waitFor(() => expect(result.current.error).toMatch(/Não foi possível/));
  await act(() => { mock.selectScenario('normal'); });
  await waitFor(() => expect(result.current.orders).toHaveLength(7));
  expect(result.current.error).toBeNull();
});
