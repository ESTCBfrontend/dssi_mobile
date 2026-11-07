import { useQuery } from '@tanstack/react-query';
import { WorkOrderServiceUnavailableError } from '../../application/workOrderService';
import { useWorkOrderAccess } from './WorkOrderServiceProvider';
import { workOrderQueryKeys } from './workOrderQueryKeys';

function errorMessage(error: Error | null, source: 'api' | 'mock', available: boolean): string | null {
  if (!available) return 'Os dados fictícios de ordens de serviço não estão disponíveis.';
  if (!error) return null;
  return error instanceof WorkOrderServiceUnavailableError && source === 'api'
    ? 'A ligação à API de ordens de serviço ainda não está disponível.'
    : 'Não foi possível carregar as ordens de serviço.';
}

export function useWorkOrders() {
  const { service, source, cacheScope, mockContextLabel } = useWorkOrderAccess();
  const query = useQuery({
    queryKey: workOrderQueryKeys.list(cacheScope),
    queryFn: () => {
      if (!service) throw new WorkOrderServiceUnavailableError();
      return service.list();
    },
    enabled: service !== null,
    retry: false,
    networkMode: 'always',
  });
  return {
    source,
    mockContextLabel,
    orders: query.isError ? [] : query.data ?? [],
    loading: query.isPending && query.isFetching,
    refreshing: query.isRefetching,
    error: errorMessage(query.error, source, service !== null),
    reload: () => { if (service) void query.refetch(); },
  };
}

export function useWorkOrder(id: string) {
  const { service, source, cacheScope, mockContextLabel } = useWorkOrderAccess();
  const query = useQuery({
    queryKey: workOrderQueryKeys.detail(cacheScope, id),
    queryFn: () => {
      if (!service) throw new WorkOrderServiceUnavailableError();
      return service.getById(id);
    },
    enabled: service !== null,
    retry: false,
    networkMode: 'always',
  });
  return {
    source,
    mockContextLabel,
    order: query.isError ? null : query.data ?? null,
    loading: query.isPending && query.isFetching,
    refreshing: query.isRefetching,
    error: errorMessage(query.error, source, service !== null),
    reload: () => { if (service) void query.refetch(); },
  };
}
