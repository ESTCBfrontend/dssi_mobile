import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { SummaryCardLayout, type SummaryDetail, type SummaryStatus } from '../BusinessCard/SummaryCardLayout';

export type ClientSummaryState = 'active' | 'review';
export interface ClientSummaryData {
  id: string; name: string; subtitle?: string; contact?: string; responsible?: string;
  sites?: string; activeOrders?: string; pending?: string;
}
export interface ClientSummaryLabels { active: string; review: string; contact: string; responsible: string; sites: string; activeOrders: string; pending: string; open: string; reviewAction: string }
export interface ClientSummaryProps {
  client: ClientSummaryData; state: ClientSummaryState; onOpen?: (client: ClientSummaryData) => void;
  status?: SummaryStatus; labels?: Partial<ClientSummaryLabels>; extraFields?: readonly SummaryDetail[]; actions?: ReactNode;
  style?: StyleProp<ViewStyle>; testID?: string;
}
const defaults: ClientSummaryLabels = { active: 'Ativo', review: 'Por validar', contact: 'Contacto', responsible: 'Responsável',
  sites: 'Locais associados', activeOrders: 'Ordens em curso', pending: 'Pendência', open: 'Ver cliente', reviewAction: 'Rever dados' };
export function ClientSummary({ client, state, onOpen, status, labels, extraFields = [], actions, style, testID }: ClientSummaryProps) {
  if (!client.id.trim() || !client.name.trim()) throw new Error('ClientSummary requer id e nome válidos.');
  const t = { ...defaults, ...labels };
  const details = [{ label: t.contact, value: client.contact }, { label: t.responsible, value: client.responsible },
    { label: t.sites, value: client.sites }, { label: t.activeOrders, value: client.activeOrders }, { label: t.pending, value: client.pending }, ...extraFields];
  return <SummaryCardLayout title={client.name} subtitle={client.subtitle} status={status ?? { label: t[state], tone: state === 'active' ? 'success' : 'warning' }}
    details={details} actionLabel={state === 'active' ? t.open : t.reviewAction} onOpen={onOpen ? () => onOpen(client) : undefined}
    actions={actions} style={style} testID={testID} />;
}
