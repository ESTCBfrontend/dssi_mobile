import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Button } from '../Button';
import type { OverlayInsets } from '../DrawerSheet';
import { StatusBadge, type StatusBadgeTone } from '../StatusBadge';
import { TeamSelector, type TeamOption } from '../TeamSelector';
import { UserSelector, type UserOption } from '../UserSelector';
import { useTheme } from '../theme';

export interface AssignmentValue { teamId: string | null; userId: string | null }
export interface AssignmentPanelProps {
  title: string; subtitle?: string; value: AssignmentValue; onChange: (value: AssignmentValue) => void;
  teams: readonly TeamOption[]; users: readonly UserOption[]; onSubmit: (value: AssignmentValue) => void;
  /** Autorização controlada pela funcionalidade; não substitui validação no servidor. */
  canSubmit: boolean; state?: 'draft' | 'assigned'; statusLabel?: string; statusTone?: StatusBadgeTone;
  submitLabel?: string; pending?: boolean; disabled?: boolean; error?: string; teamError?: string; userError?: string;
  teamsLoading?: boolean; usersLoading?: boolean; teamsError?: string; usersError?: string;
  onRetryTeams?: () => void; onRetryUsers?: () => void; filterUsersByTeam?: boolean;
  note?: ReactNode; noteLabel?: string; safeAreaInsets?: Partial<OverlayInsets>; style?: StyleProp<ViewStyle>; testID?: string;
}
export function AssignmentPanel({ title, subtitle, value, onChange, teams, users, onSubmit, canSubmit,
  state = 'draft', statusLabel, statusTone, submitLabel, pending = false, disabled = false, error, teamError, userError,
  teamsLoading, usersLoading, teamsError, usersError, onRetryTeams, onRetryUsers, filterUsersByTeam = false,
  note, noteLabel = 'Nota para a equipa', safeAreaInsets, style, testID }: AssignmentPanelProps) {
  const { assignment: t, colors } = useTheme();
  if (!title.trim() || (subtitle !== undefined && !subtitle.trim()) || (error !== undefined && !error.trim()) ||
      (statusLabel !== undefined && !statusLabel.trim()) || (note != null && !noteLabel.trim()))
    throw new Error('AssignmentPanel requer título e textos fornecidos não vazios.');
  const locked = disabled || pending;
  return <View testID={testID} style={[styles.panel, { backgroundColor: t.background, borderColor: t.border,
    borderRadius: t.panelRadius, padding: t.panelPadding, gap: t.panelGap }, style]}>
    <View style={styles.header}>
      <View style={styles.heading}>
        <Text accessibilityRole="header" allowFontScaling style={{ color: t.primary, fontFamily: t.semiboldFont, fontSize: 16 }}>{title}</Text>
        {subtitle ? <Text allowFontScaling style={{ color: t.secondary, fontFamily: t.regularFont, fontSize: 12 }}>{subtitle}</Text> : null}
      </View>
      <StatusBadge label={statusLabel ?? (state === 'assigned' ? 'Atribuída' : 'Por atribuir')}
        tone={statusTone ?? (state === 'assigned' ? 'success' : 'warning')} size="small" />
    </View>
    <View style={styles.fields}>
      <TeamSelector teams={teams} value={value.teamId} onChange={teamId => onChange({ ...value, teamId })}
        disabled={locked} error={teamError} loading={teamsLoading} loadError={teamsError} onRetry={onRetryTeams}
        clearable safeAreaInsets={safeAreaInsets} testID={testID ? `${testID}-team` : undefined} />
      <UserSelector users={users} value={value.userId} onChange={userId => onChange({ ...value, userId })}
        teamId={filterUsersByTeam ? value.teamId : null} disabled={locked} error={userError}
        loading={usersLoading} loadError={usersError} onRetry={onRetryUsers} clearable safeAreaInsets={safeAreaInsets}
        testID={testID ? `${testID}-user` : undefined} />
    </View>
    {note != null ? <View style={[styles.note, { backgroundColor: t.subtle, borderRadius: t.noteRadius }]}>
      <Text allowFontScaling style={{ color: t.primary, fontFamily: t.semiboldFont, fontSize: 12 }}>{noteLabel}</Text>
      {typeof note === 'string' || typeof note === 'number'
        ? <Text allowFontScaling style={{ color: t.secondary, fontFamily: t.regularFont, fontSize: 12 }}>{note}</Text> : note}
    </View> : null}
    {error ? <Text accessibilityRole="alert" accessibilityLiveRegion="polite" allowFontScaling
      style={{ color: colors.actionDanger, fontFamily: t.regularFont }}>{error}</Text> : null}
    <Button label={submitLabel ?? (state === 'assigned' ? 'Alterar atribuição' : 'Confirmar atribuição')}
      variant={state === 'assigned' ? 'outline' : 'primary'} fullWidth disabled={disabled || !canSubmit}
      loading={pending} onPress={() => { if (!locked && canSubmit) onSubmit(value); }} />
  </View>;
}
const styles = StyleSheet.create({
  panel: { alignSelf: 'stretch', maxWidth: '100%', borderWidth: 1 },
  header: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  heading: { flexGrow: 1, flexShrink: 1, minWidth: 0, gap: 5 },
  fields: { gap: 12 }, note: { padding: 12, gap: 8 },
});
