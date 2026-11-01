import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Button } from '../Button';
import { DatePicker } from '../DatePicker';
import type { OverlayInsets } from '../DrawerSheet';
import { parseDate } from '../PickerControl/dateTime';
import { useTheme } from '../theme';

export interface DateRange { start: string | null; end: string | null }
export interface DateRangePickerProps {
  value: DateRange; onChange: (value: DateRange) => void; title: string; startLabel?: string; endLabel?: string;
  minDate?: string; maxDate?: string; disabledDates?: readonly string[]; error?: string; disabled?: boolean;
  safeAreaInsets?: Partial<OverlayInsets>; style?: StyleProp<ViewStyle>; testID?: string;
}
export function DateRangePicker({ value, onChange, title, startLabel = 'Data inicial', endLabel = 'Data final',
  minDate, maxDate, disabledDates, error, disabled = false, safeAreaInsets, style, testID }: DateRangePickerProps) {
  const { form: t } = useTheme();
  if (!title.trim() || (value.start && !parseDate(value.start)) || (value.end && !parseDate(value.end)))
    throw new Error('DateRangePicker requer título e datas válidas YYYY-MM-DD.');
  const startMax = value.end && (!maxDate || value.end < maxDate) && (!minDate || value.end >= minDate) ? value.end : maxDate;
  const endMin = value.start && (!minDate || value.start > minDate) && (!maxDate || value.start <= maxDate) ? value.start : minDate;
  const message = error || (value.start && value.end && value.start > value.end ? 'A data final deve ser igual ou posterior à data inicial.' : undefined);
  return <View testID={testID} style={[styles.container, { backgroundColor: t.background, borderColor: message ? t.danger : t.border,
    borderRadius: t.radius, gap: 14, padding: 16 }, style]}>
    <View style={styles.heading}><Text accessibilityRole="header" allowFontScaling style={[styles.title, { color: t.primary, fontFamily: t.semiboldFont }]}>{title}</Text>
      <Text allowFontScaling style={{ color: message ? t.danger : t.secondary, fontFamily: t.regularFont, fontSize: 12 }}>{message ? 'Rever datas' : value.start || value.end ? 'Período selecionado' : 'Sem período'}</Text></View>
    <DatePicker label={startLabel} value={value.start} minDate={minDate} maxDate={startMax} disabledDates={disabledDates}
      disabled={disabled} safeAreaInsets={safeAreaInsets} testID={testID ? `${testID}-start` : undefined}
      onChange={start => onChange({ ...value, start })} />
    <DatePicker label={endLabel} value={value.end} minDate={endMin} maxDate={maxDate} disabledDates={disabledDates}
      disabled={disabled} safeAreaInsets={safeAreaInsets} testID={testID ? `${testID}-end` : undefined}
      onChange={end => onChange({ ...value, end })} />
    <Text allowFontScaling accessibilityLiveRegion="polite" style={{ color: message ? t.danger : t.secondary, fontFamily: t.regularFont, fontSize: 12 }}>
      {message || 'Escolha a data de início e de fim.'}</Text>
    {(value.start || value.end) && !disabled ? <Button size="small" variant="outline" label="Limpar período" onPress={() => onChange({ start: null, end: null })} /> : null}
  </View>;
}
const styles = StyleSheet.create({ container: { alignSelf: 'stretch', maxWidth: '100%', borderWidth: 1 },
  heading: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  title: { fontSize: 15, flexShrink: 1 } });
