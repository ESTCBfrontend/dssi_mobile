import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Button } from '../Button';
import { StatusBadge, type StatusBadgeTone } from '../StatusBadge';
import { useTheme } from '../theme';

export interface TableRowData {
  id: string; reference: string; title: string; detail?: string;
  status?: { label: string; tone: StatusBadgeTone }; selected?: boolean;
}
export interface TableRowProps {
  row: TableRowData; onOpen?: (row: TableRowData) => void; actionLabel?: string; selectedLabel?: string;
  style?: StyleProp<ViewStyle>; testID?: string;
}
export function TableRow({ row, onOpen, actionLabel = 'Abrir', selectedLabel = 'Selecionado', style, testID }: TableRowProps) {
  const { dataList: t } = useTheme();
  if (!row.id.trim() || !row.reference.trim() || !row.title.trim() || (row.selected && !selectedLabel.trim())) {
    throw new Error('TableRow requer identificador, referência, título e indicação de seleção válidos.');
  }
  return <View testID={testID} style={[styles.container, { backgroundColor: row.selected ? t.selectedBackground : t.background,
    borderColor: row.selected ? t.focus : t.border, borderRadius: t.radius, padding: t.padding }, style]}>
    <View style={styles.heading}><Text allowFontScaling accessibilityLabel={row.selected ? `${row.reference}, ${selectedLabel}` : row.reference}
      style={[styles.reference, { color: t.primary, fontFamily: t.semiboldFont }]}>{row.reference}</Text>
      {row.status ? <StatusBadge label={row.status.label} tone={row.status.tone} size="small" showDot /> : null}</View>
    <Text allowFontScaling style={{ color: t.primary, fontFamily: t.semiboldFont, fontSize: 15 }}>{row.title}</Text>
    {row.detail || onOpen ? <View style={styles.details}>
      {row.detail ? <Text allowFontScaling style={[styles.detail, { color: t.secondary, fontFamily: t.regularFont }]}>{row.detail}</Text> : <View style={styles.detail} />}
      {onOpen ? <Button variant="outline" label={actionLabel} accessibilityLabel={`${actionLabel}: ${row.reference}`} onPress={() => onOpen(row)} /> : null}
    </View> : null}
  </View>;
}
const styles = StyleSheet.create({
  container: { alignSelf: 'stretch', maxWidth: '100%', borderWidth: 1, gap: 12 },
  heading: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  reference: { fontSize: 14, flexGrow: 1, flexShrink: 1, minWidth: 0 },
  details: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  detail: { fontSize: 12, flexGrow: 1, flexShrink: 1, minWidth: 0 },
});
