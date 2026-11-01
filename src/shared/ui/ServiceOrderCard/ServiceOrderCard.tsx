import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { SummaryCardLayout, type SummaryDetail, type SummaryStatus } from '../BusinessCard/SummaryCardLayout';

export type ServiceOrderCardState = 'planned' | 'active';
export interface ServiceOrderCardData {
  id: string; reference: string; subtitle?: string; clientName?: string; location?: string;
  scheduledAt?: string; team?: string; responsible?: string;
}
export interface ServiceOrderCardLabels { planned: string; active: string; clientName: string; location: string; scheduledAt: string; team: string; responsible: string; open: string; follow: string }
export interface ServiceOrderCardProps {
  order: ServiceOrderCardData; state: ServiceOrderCardState; onOpen?: (order: ServiceOrderCardData) => void;
  status?: SummaryStatus; labels?: Partial<ServiceOrderCardLabels>; extraFields?: readonly SummaryDetail[]; actions?: ReactNode;
  style?: StyleProp<ViewStyle>; testID?: string;
}
const defaults: ServiceOrderCardLabels = { planned: 'Planeada', active: 'Em execução', clientName: 'Cliente', location: 'Local',
  scheduledAt: 'Agendamento', team: 'Equipa', responsible: 'Responsável', open: 'Ver intervenção', follow: 'Acompanhar' };
export function ServiceOrderCard({ order, state, onOpen, status, labels, extraFields = [], actions, style, testID }: ServiceOrderCardProps) {
  if (!order.id.trim() || !order.reference.trim()) throw new Error('ServiceOrderCard requer id e referência válidos.');
  const t = { ...defaults, ...labels };
  const details = [{ label: t.clientName, value: order.clientName }, { label: t.location, value: order.location },
    { label: t.scheduledAt, value: order.scheduledAt }, { label: t.team, value: order.team },
    { label: t.responsible, value: order.responsible }, ...extraFields];
  return <SummaryCardLayout title={order.reference} subtitle={order.subtitle}
    status={status ?? { label: t[state], tone: state === 'planned' ? 'info' : 'warning' }} details={details}
    actionLabel={state === 'planned' ? t.open : t.follow} onOpen={onOpen ? () => onOpen(order) : undefined}
    actions={actions} style={style} testID={testID} />;
}
