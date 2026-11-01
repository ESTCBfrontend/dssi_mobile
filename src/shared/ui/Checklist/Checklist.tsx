import type { ReactNode } from 'react';
import { FlatList, StyleSheet, Text, View, type ListRenderItem, type StyleProp, type ViewStyle } from 'react-native';
import { Button } from '../Button';
import { ChecklistItem, type ChecklistEntry, type ChecklistItemLabels, type ChecklistResult } from '../ChecklistItem';
import { TaskProgress, type TaskProgressLabels } from '../TaskProgress';
import { useTheme } from '../theme';

export interface ChecklistLabels {
  items: string; empty: string; save: string; submit: string;
  count: (total: number) => string;
}
export interface ChecklistProps {
  title: string;
  description?: string;
  items: readonly ChecklistEntry[];
  /** Regra fornecida pela funcionalidade que usa a checklist. */
  isCompleted: (item: ChecklistEntry) => boolean;
  onItemChange?: (id: string, result: ChecklistResult) => void;
  onAddEvidence?: (item: ChecklistEntry) => void;
  renderEvidence?: (item: ChecklistEntry) => ReactNode;
  onSave?: () => void;
  onSubmit?: () => void;
  actions?: ReactNode;
  actionsDescription?: string;
  progressDescription?: string;
  disabled?: boolean;
  labels?: Partial<ChecklistLabels>;
  itemLabels?: Partial<ChecklistItemLabels>;
  progressLabels?: Partial<TaskProgressLabels>;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
const defaults: ChecklistLabels = { items: 'Pontos de verificação', empty: 'Sem pontos de verificação.',
  save: 'Guardar rascunho', submit: 'Submeter checklist', count: total => `${total} ${total === 1 ? 'ponto' : 'pontos'}` };

export function Checklist({ title, description, items, isCompleted, onItemChange, onAddEvidence, renderEvidence,
  onSave, onSubmit, actions, actionsDescription, progressDescription, disabled = false, labels, itemLabels,
  progressLabels, style, testID }: ChecklistProps) {
  const { checklist: t } = useTheme();
  if (!title.trim()) throw new Error('Checklist requer um título não vazio.');
  const ids = new Set<string>();
  for (const item of items) {
    if (!item.id.trim() || ids.has(item.id)) throw new Error('Checklist requer identificadores não vazios e únicos.');
    ids.add(item.id);
  }
  const completed = items.reduce((count, item) => count + (isCompleted(item) ? 1 : 0), 0);
  const text = { ...defaults, ...labels };
  const renderItem: ListRenderItem<ChecklistEntry> = ({ item, index }) => <ChecklistItem item={item}
    step={String(index + 1).padStart(2, '0')} disabled={disabled} labels={itemLabels} evidence={renderEvidence?.(item)}
    onChange={onItemChange ? result => onItemChange(item.id, result) : undefined}
    onAddEvidence={onAddEvidence ? () => onAddEvidence(item) : undefined} />;
  return <FlatList testID={testID} data={items} keyExtractor={item => item.id} renderItem={renderItem}
    style={[styles.container, { backgroundColor: t.background, borderColor: t.border }, style]}
    contentContainerStyle={{ padding: t.padding }} ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
    ListHeaderComponent={<View style={{ gap: 18, marginBottom: 10 }}>
      <View style={{ gap: 7 }}><Text accessibilityRole="header" allowFontScaling style={{ color: t.primary, fontFamily: t.semiboldFont, fontSize: 18 }}>{title}</Text>
        {description ? <Text allowFontScaling style={{ color: t.secondary, fontFamily: t.regularFont, fontSize: 12 }}>{description}</Text> : null}</View>
      <TaskProgress total={items.length} completed={completed} description={progressDescription} labels={progressLabels} />
      <View style={styles.listHeading}><Text accessibilityRole="header" allowFontScaling style={{ color: t.primary, fontFamily: t.semiboldFont, fontSize: 14 }}>{text.items}</Text>
        <Text allowFontScaling style={{ color: t.secondary, fontFamily: t.regularFont, fontSize: 12 }}>{text.count(items.length)}</Text></View>
    </View>}
    ListEmptyComponent={<Text allowFontScaling style={{ color: t.secondary, fontFamily: t.regularFont, fontSize: 12 }}>{text.empty}</Text>}
    ListFooterComponent={actions || onSave || onSubmit || actionsDescription ? <View style={{ gap: 10, marginTop: 18 }}>
      <View style={{ height: 1, backgroundColor: t.border }} />
      {actionsDescription ? <Text allowFontScaling style={{ color: t.secondary, fontFamily: t.regularFont, fontSize: 12 }}>{actionsDescription}</Text> : null}
      {actions}{onSave ? <Button label={text.save} variant="outline" fullWidth disabled={disabled} onPress={onSave} /> : null}
      {onSubmit ? <Button label={text.submit} fullWidth disabled={disabled} onPress={onSubmit} /> : null}
    </View> : undefined} />;
}
const styles = StyleSheet.create({
  container: { alignSelf: 'stretch', maxWidth: '100%', borderWidth: 1, borderRadius: 20 },
  listHeading: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
});
