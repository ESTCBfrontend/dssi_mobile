import { useEffect, useMemo, useSyncExternalStore, type PropsWithChildren } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { WorkOrderServiceProvider } from '../../features/work-orders/presentation/hooks/WorkOrderServiceProvider';
import { workOrderQueryKeys } from '../../features/work-orders/presentation/hooks/workOrderQueryKeys';
import type { DataSourceSelection } from '../data-source/dataSource';
import type { MockWorkOrderSnapshot, WorkOrderServices } from './workOrderServices';

const noSubscription = () => () => {};
const defaultSnapshot: MockWorkOrderSnapshot = { scenario: 'normal', technicianId: null, technicianLabel: null, service: null };
const noSnapshot = () => defaultSnapshot;

/** Liga a seleção e as notificações mock ao contrato recebido pela apresentação. */
export function WorkOrderSourceProvider({ selection, services, children }:
  PropsWithChildren<{ selection: DataSourceSelection; services: WorkOrderServices }>) {
  const source = useSyncExternalStore(selection.subscribe, selection.getSnapshot, selection.getSnapshot);
  const changes = services.mockChanges;
  const snapshot = useSyncExternalStore(changes?.subscribe ?? noSubscription,
    changes?.getSnapshot ?? noSnapshot, changes?.getSnapshot ?? noSnapshot);
  const queryClient = useQueryClient();
  const service = source === 'mock' ? snapshot.service ?? services.mock : services.api;
  const scenario = snapshot.scenario;
  const technicianId = snapshot.technicianId;
  const technicianLabel = snapshot.technicianLabel;
  const value = useMemo(() => ({ service, source,
    mockContextLabel: source === 'mock' && technicianLabel ? `Técnico fictício: ${technicianLabel}` : null,
    cacheScope: source === 'mock' ? [source, scenario, ...(technicianId === null ? ['all'] : ['technician', technicianId])] : [source] }),
    [service, source, scenario, technicianId, technicianLabel]);

  useEffect(() => {
    if (!changes) return undefined;
    let active = true;
    const unsubscribe = changes.subscribe(() => {
      queueMicrotask(() => {
        if (active) void queryClient.invalidateQueries({ queryKey: workOrderQueryKeys.scope(['mock']) });
      });
    });
    return () => { active = false; unsubscribe(); };
  }, [changes, queryClient]);

  return <WorkOrderServiceProvider value={value}>{children}</WorkOrderServiceProvider>;
}
