import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { SummaryCardLayout, type SummaryDetail, type SummaryStatus } from '../BusinessCard/SummaryCardLayout';

export type EquipmentCardState = 'operational' | 'needsService';
export interface EquipmentCardData {
  id: string; reference: string; identifier: string; subtitle?: string; location?: string;
  lastInspection?: string; nextService?: string; issue?: string;
}
export interface EquipmentCardLabels { operational: string; needsService: string; identifier: string; location: string; lastInspection: string; nextService: string; issue: string; open: string; issueAction: string }
export interface EquipmentCardProps {
  equipment: EquipmentCardData; state: EquipmentCardState; onOpen?: (equipment: EquipmentCardData) => void;
  status?: SummaryStatus; labels?: Partial<EquipmentCardLabels>; extraFields?: readonly SummaryDetail[]; actions?: ReactNode;
  style?: StyleProp<ViewStyle>; testID?: string;
}
const defaults: EquipmentCardLabels = { operational: 'Operacional', needsService: 'Requer revisão', identifier: 'Identificação', location: 'Localização',
  lastInspection: 'Última inspeção', nextService: 'Próxima revisão', issue: 'Ocorrência', open: 'Ver equipamento', issueAction: 'Ver ocorrência' };
export function EquipmentCard({ equipment, state, onOpen, status, labels, extraFields = [], actions, style, testID }: EquipmentCardProps) {
  if (!equipment.id.trim() || !equipment.reference.trim() || !equipment.identifier.trim()) throw new Error('EquipmentCard requer id, referência e identificação válidos.');
  const t = { ...defaults, ...labels };
  const details = [{ label: t.identifier, value: equipment.identifier }, { label: t.location, value: equipment.location },
    { label: t.lastInspection, value: equipment.lastInspection }, { label: t.nextService, value: equipment.nextService },
    { label: t.issue, value: equipment.issue }, ...extraFields];
  return <SummaryCardLayout title={equipment.reference} subtitle={equipment.subtitle}
    status={status ?? { label: t[state], tone: state === 'operational' ? 'success' : 'warning' }} details={details}
    actionLabel={state === 'operational' ? t.open : t.issueAction} onOpen={onOpen ? () => onOpen(equipment) : undefined}
    actions={actions} style={style} testID={testID} />;
}
