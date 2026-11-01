import { AssignmentSelector, type AssignmentOption, type AssignmentSelectorProps } from '../AssignmentSelectors/AssignmentSelector';

export interface UserOption extends AssignmentOption { teamIds?: readonly string[] }
export interface UserSelectorProps extends Omit<AssignmentSelectorProps, 'options' | 'label' | 'placeholder' | 'searchLabel'> {
  users: readonly UserOption[]; teamId?: string | null; label?: string; placeholder?: string; searchLabel?: string;
}
export function UserSelector({ users, teamId, label = 'Técnico', placeholder = 'Selecionar técnico',
  searchLabel = 'Pesquisar profissional', selectedLabel, value, ...props }: UserSelectorProps) {
  const filtered = teamId == null ? users : users.filter(user => user.teamIds?.includes(teamId));
  const currentLabel = selectedLabel ?? users.find(user => user.id === value)?.name;
  return <AssignmentSelector {...props} value={value} label={label} placeholder={placeholder} searchLabel={searchLabel}
    selectedLabel={currentLabel} options={filtered} />;
}
