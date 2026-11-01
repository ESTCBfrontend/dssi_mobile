import { useState, type ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Button } from '../Button';
import { RadioGroup } from '../RadioGroup';
import { StatusBadge, type StatusBadgeTone } from '../StatusBadge';
import { useTheme } from '../theme';

export type ChecklistResult = 'pending' | 'pass' | 'fail' | 'notTested';
export interface ChecklistEntry { id: string; title: string; description?: string; result: ChecklistResult; note?: string }
export interface ChecklistItemLabels {
  pending: string; pass: string; fail: string; notTested: string;
  register: string; edit: string; result: string; evidence: string; addEvidence: string;
}
export interface ChecklistItemProps {
  item: ChecklistEntry;
  step: string;
  onChange?: (result: ChecklistResult) => void;
  onAddEvidence?: () => void;
  evidence?: ReactNode;
  disabled?: boolean;
  labels?: Partial<ChecklistItemLabels>;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
const defaults: ChecklistItemLabels = { pending: 'Por verificar', pass: 'Conforme', fail: 'Não conforme', notTested: 'Não testado',
  register: 'Registar', edit: 'Editar', result: 'Resultado', evidence: 'Observação e evidências', addEvidence: 'Adicionar evidência' };
const tones: Record<ChecklistResult, StatusBadgeTone> = { pending: 'neutral', pass: 'success', fail: 'danger', notTested: 'warning' };
const results: ChecklistResult[] = ['pending', 'pass', 'fail', 'notTested'];

export function ChecklistItem({ item, step, onChange, onAddEvidence, evidence, disabled = false, labels, style, testID }: ChecklistItemProps) {
  const { checklist: t } = useTheme();
  const [editing, setEditing] = useState(false);
  if (!item.id.trim() || !item.title.trim() || !step.trim() || !results.includes(item.result)) throw new Error('ChecklistItem requer id, título, passo e resultado válidos.');
  const text = { ...defaults, ...labels };
  return <View testID={testID} style={[styles.container, { backgroundColor: t.background,
    borderColor: item.result === 'fail' ? t.error : t.border, borderRadius: t.radius }, style]}>
    <View style={styles.heading}><View style={[styles.index, { backgroundColor: t.subtle }]}>
      <Text allowFontScaling style={{ color: t.brand, fontFamily: t.semiboldFont, fontSize: 13 }}>{step}</Text></View>
      <View style={styles.copy}><Text allowFontScaling style={{ color: t.primary, fontFamily: t.semiboldFont, fontSize: 14 }}>{item.title}</Text>
        {item.description ? <Text allowFontScaling style={{ color: t.secondary, fontFamily: t.regularFont, fontSize: 12 }}>{item.description}</Text> : null}</View></View>
    <View style={styles.controls}><StatusBadge size="small" showDot tone={tones[item.result]} label={text[item.result]} />
      {onChange ? <Button variant="outline" label={item.result === 'pending' ? text.register : text.edit}
        accessibilityLabel={`${item.result === 'pending' ? text.register : text.edit}: ${item.title}`}
        disabled={disabled} onPress={() => setEditing(value => !value)} /> : null}</View>
    {editing && onChange ? <RadioGroup label={`${text.result}: ${item.title}`} options={results.map(value => ({ value, label: text[value] }))}
      value={item.result} disabled={disabled} onChange={value => { onChange(value as ChecklistResult); setEditing(false); }} /> : null}
    {item.note || evidence || onAddEvidence ? <View style={[styles.evidence, { backgroundColor: t.subtle }]}>
      <Text allowFontScaling style={{ color: t.primary, fontFamily: t.semiboldFont, fontSize: 12 }}>{text.evidence}</Text>
      {item.note ? <Text allowFontScaling style={{ color: t.secondary, fontFamily: t.regularFont, fontSize: 12 }}>{item.note}</Text> : null}
      {evidence}{onAddEvidence ? <Button label={text.addEvidence} variant="outline" disabled={disabled} onPress={onAddEvidence} /> : null}
    </View> : null}
  </View>;
}
const styles = StyleSheet.create({
  container: { alignSelf: 'stretch', maxWidth: '100%', borderWidth: 1, padding: 14, gap: 12 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  index: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, minWidth: 0, gap: 5 },
  controls: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  evidence: { borderRadius: 10, padding: 12, gap: 8 },
});
