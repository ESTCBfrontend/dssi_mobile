import { useState } from 'react';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';

export type SortDirection = 'none' | 'ascending' | 'descending';
export interface SortableHeaderLabels { none: string; ascending: string; descending: string; name: (label: string) => string; next: (direction: SortDirection) => string }
export interface SortableHeaderProps {
  label: string; direction: SortDirection; onSort: (direction: SortDirection) => void; disabled?: boolean;
  labels?: Partial<SortableHeaderLabels>; style?: StyleProp<ViewStyle>; testID?: string;
}
const defaults: SortableHeaderLabels = { none: 'Sem ordenação', ascending: 'Ordem ascendente', descending: 'Ordem descendente', name: label => `Ordenar por ${label}`,
  next: direction => direction === 'none' ? 'Remover ordenação' : direction === 'ascending' ? 'Ordenar por ordem ascendente' : 'Ordenar por ordem descendente' };
export function SortableHeader({ label, direction, onSort, disabled = false, labels, style, testID }: SortableHeaderProps) {
  const { dataList: t } = useTheme(); const [focused, setFocused] = useState(false);
  if (!label.trim() || !['none', 'ascending', 'descending'].includes(direction)) throw new Error('SortableHeader requer rótulo e direção válidos.');
  const text = { ...defaults, ...labels };
  const next: SortDirection = direction === 'none' ? 'ascending' : direction === 'ascending' ? 'descending' : 'none';
  const active = direction !== 'none'; const color = active && !disabled ? t.brand : t.secondary;
  return <Pressable testID={testID} accessibilityRole="button" accessibilityLabel={text.name(label)}
    accessibilityValue={{ text: text[direction] }} accessibilityHint={text.next(next)} accessibilityState={{ disabled }} disabled={disabled}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onPress={() => onSort(next)}
    style={({ pressed }) => [styles.container, { borderRadius: t.sortRadius, backgroundColor: active || focused ? t.selectedBackground : 'transparent',
      outlineStyle: 'solid', outlineColor: t.focus, outlineWidth: focused && !disabled ? 2 : 0, opacity: pressed && !disabled ? 0.8 : 1 }, style]}>
    <Text allowFontScaling style={[styles.label, { color, fontFamily: active ? t.semiboldFont : t.mediumFont }]}>{label}</Text>
    <Text accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" allowFontScaling={false}
      style={{ color, fontFamily: t.semiboldFont, fontSize: 16, width: 18, textAlign: 'center' }}>{direction === 'ascending' ? '↑' : direction === 'descending' ? '↓' : '↕'}</Text>
  </Pressable>;
}
const styles = StyleSheet.create({
  container: { minHeight: 44, maxWidth: '100%', flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 10 },
  label: { fontSize: 12, flexGrow: 1, flexShrink: 1, minWidth: 0 },
});
