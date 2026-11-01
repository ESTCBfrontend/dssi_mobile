import { AssignmentSelector, type AssignmentOption, type AssignmentSelectorProps } from '../AssignmentSelectors/AssignmentSelector';

export interface TeamOption extends AssignmentOption {}
export interface TeamSelectorProps extends Omit<AssignmentSelectorProps, 'options' | 'label' | 'placeholder' | 'searchLabel'> {
  teams: readonly TeamOption[]; label?: string; placeholder?: string; searchLabel?: string;
}
export function TeamSelector({ teams, label = 'Equipa', placeholder = 'Selecionar equipa', searchLabel = 'Pesquisar equipa', ...props }: TeamSelectorProps) {
  return <AssignmentSelector {...props} label={label} placeholder={placeholder} searchLabel={searchLabel} options={teams} />;
}
