import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { DataSourceSelection } from '../data-source/dataSource';
import type { MockWorkOrders } from '../../features/work-orders/infrastructure/mock/MockWorkOrders';

const unavailableSnapshot = { scenario: 'normal' as const, count: 0 };
const noSubscription = () => () => {};
const noSnapshot = () => unavailableSnapshot;

/** Faz a ponte entre a seleção temporária e o serviço em memória, sem aceder à API. */
export function useWorkOrders(selection: DataSourceSelection, mock: MockWorkOrders | null) {
  const source = useSyncExternalStore(selection.subscribe, selection.getSnapshot, selection.getSnapshot);
  const snapshot = useSyncExternalStore(mock?.subscribe ?? noSubscription, mock?.getSnapshot ?? noSnapshot, mock?.getSnapshot ?? noSnapshot);
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ['work-orders', 'list', source, ...(source === 'mock' ? [snapshot.scenario] : [])], [source, snapshot.scenario]);
  const available = source === 'mock' && mock !== null;
  const query = useQuery({
    queryKey,
    queryFn: () => {
      if (!mock || source !== 'mock') throw new Error('Origem de ordens indisponível.');
      return mock.list();
    },
    enabled: available,
    retry: false,
    networkMode: 'always',
  });

  useEffect(() => {
    if (!available || !mock) return undefined;
    let active = true;
    const unsubscribe = mock.subscribe(() => {
      queueMicrotask(() => {
        if (active) void queryClient.invalidateQueries({ queryKey, exact: true });
      });
    });
    return () => { active = false; unsubscribe(); };
  }, [available, mock, queryClient, queryKey]);

  return {
    source,
    orders: available && !query.isError && !query.isFetching ? query.data ?? [] : [],
    loading: available && query.isFetching,
    error: !available ? 'A ligação à API de ordens de serviço ainda não está disponível.'
      : query.isError && !query.isFetching ? 'Não foi possível carregar as ordens de serviço.' : null,
    reload: () => { if (available) void query.refetch(); },
  };
}
