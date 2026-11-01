import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { ProgressBar } from '../ProgressBar';
import { StatusBadge } from '../StatusBadge';
import { useTheme } from '../theme';

export interface TaskProgressLabels {
  inProgress: string;
  complete: string;
  empty: string;
  progress: string;
  count: (completed: number, total: number) => string;
  summary: (completed: number, total: number, percent: number) => string;
}
export interface TaskProgressProps {
  completed: number;
  total: number;
  title?: string;
  description?: string;
  labels?: Partial<TaskProgressLabels>;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
const defaultLabels: TaskProgressLabels = {
  inProgress: 'Em curso', complete: 'Concluída', empty: 'Sem verificações', progress: 'Verificações concluídas',
  count: (completed, total) => `${completed} de ${total}`,
  summary: (completed, total, percent) => total === 0 ? 'Sem verificações para apresentar' : completed === total ? 'Tudo verificado' : `Verificações realizadas · ${percent}% do total`,
};
export function TaskProgress({ completed, total, title = 'Progresso das verificações', description,
  labels, style, testID }: TaskProgressProps) {
  const { checklist: t } = useTheme();
  if (!Number.isSafeInteger(completed) || !Number.isSafeInteger(total) || completed < 0 || total < 0 || completed > total) {
    throw new Error('TaskProgress requer contagens inteiras não negativas e completed não superior a total.');
  }
  if (!title.trim()) throw new Error('TaskProgress requer um título não vazio.');
  const text = { ...defaultLabels, ...labels };
  const complete = total > 0 && completed === total;
  const percent = total === 0 ? 0 : complete ? 100 : Math.min(99, Math.round(completed * 100 / total));
  return <View testID={testID} style={[styles.container, { backgroundColor: t.background, borderColor: t.border,
    borderRadius: t.radius, padding: t.padding, gap: t.gap }, style]}>
    <View style={styles.heading}><View style={styles.headingText}>
      <Text accessibilityRole="header" allowFontScaling style={{ color: t.primary, fontFamily: t.semiboldFont, fontSize: 15 }}>{title}</Text>
      {description ? <Text allowFontScaling style={{ color: t.secondary, fontFamily: t.regularFont, fontSize: 12 }}>{description}</Text> : null}
    </View><StatusBadge size="small" showDot tone={total === 0 ? 'neutral' : complete ? 'success' : 'info'} label={total === 0 ? text.empty : complete ? text.complete : text.inProgress} /></View>
    <View style={{ gap: 12 }}><ProgressBar label={text.progress} size="compact" value={percent} status={complete ? 'complete' : 'active'}
      statusText={text.complete} showStatusText={false} />
      <View style={{ gap: 5 }}><Text allowFontScaling style={{ color: complete ? t.success : t.primary, fontFamily: t.semiboldFont, fontSize: 14 }}>{text.count(completed, total)}</Text>
        <Text allowFontScaling style={{ color: t.secondary, fontFamily: t.regularFont, fontSize: 12 }}>{text.summary(completed, total, percent)}</Text></View>
    </View>
  </View>;
}
const styles = StyleSheet.create({
  container: { alignSelf: 'stretch', maxWidth: '100%', borderWidth: 1 },
  heading: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  headingText: { flexGrow: 1, flexShrink: 1, minWidth: 0, gap: 6 },
});
