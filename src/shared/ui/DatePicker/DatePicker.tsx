import { useEffect, useState } from 'react';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Platform, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Button } from '../Button';
import { DrawerSheet, type OverlayInsets } from '../DrawerSheet';
import { FormField } from '../FormField';
import { PickerControl } from '../PickerControl/PickerControl';
import { displayDate, formatDate, parseDate } from '../PickerControl/dateTime';
import { useTheme } from '../theme';

export interface DatePickerProps {
  label: string; value: string | null; onChange: (value: string | null) => void;
  minDate?: string; maxDate?: string; disabledDates?: readonly string[]; disabled?: boolean;
  required?: boolean; helperText?: string; error?: string; placeholder?: string; clearable?: boolean;
  safeAreaInsets?: Partial<OverlayInsets>; style?: StyleProp<ViewStyle>; testID?: string;
}
export function DatePicker({ label, value, onChange, minDate, maxDate, disabledDates = [], disabled = false,
  required, helperText, error, placeholder = 'DD/MM/AAAA', clearable = false, safeAreaInsets, style, testID }: DatePickerProps) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false); const [draft, setDraft] = useState(new Date()); const [selectionError, setSelectionError] = useState<string>();
  useEffect(() => { if (disabled) setOpen(false); }, [disabled]);
  if ((value !== null && !parseDate(value)) || (minDate !== undefined && !parseDate(minDate)) ||
      (maxDate !== undefined && !parseDate(maxDate)) || disabledDates.some(date => !parseDate(date)) ||
      (minDate && maxDate && minDate > maxDate)) throw new Error('DatePicker requer datas válidas YYYY-MM-DD e limites ordenados.');
  const choose = (date: Date) => {
    const result = formatDate(date);
    if ((minDate && result < minDate) || (maxDate && result > maxDate) || disabledDates.includes(result)) {
      setSelectionError('Esta data não está disponível.'); return false;
    }
    setSelectionError(undefined); onChange(result); return true;
  };
  const show = () => {
    let initial = value ? parseDate(value)! : new Date();
    if (minDate && formatDate(initial) < minDate) initial = parseDate(minDate)!;
    if (maxDate && formatDate(initial) > maxDate) initial = parseDate(maxDate)!;
    setDraft(initial); setSelectionError(undefined); setOpen(true);
  };
  const onNativeChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setOpen(false);
      if (event.type === 'set' && date && !disabled) choose(date);
    } else if (event.type === 'set' && date) setDraft(date);
  };
  const picker = <DateTimePicker testID={testID ? `${testID}-native` : undefined} mode="date" value={draft}
    minimumDate={minDate ? parseDate(minDate)! : undefined} maximumDate={maxDate ? parseDate(maxDate)! : undefined}
    onChange={onNativeChange} locale="pt-PT" display={Platform.OS === 'ios' ? 'spinner' : 'default'} />;
  return <View style={style}>
    <FormField label={label} required={required} helperText={helperText} error={error || selectionError} disabled={disabled}>
      {control => <PickerControl label={control.accessibilityLabel} accessibilityHint={control.accessibilityHint}
        value={value ? displayDate(value) : placeholder} placeholder={!value} icon="date" disabled={disabled}
        error={control.error} expanded={open} testID={testID} onPress={show} />}
    </FormField>
    {clearable && value && !disabled ? <Button size="small" variant="outline" label="Limpar data"
      onPress={() => { setSelectionError(undefined); onChange(null); }} /> : null}
    {Platform.OS === 'android' && open && !disabled ? picker : null}
    {Platform.OS === 'ios' ? <DrawerSheet open={open && !disabled} title={label} safeAreaInsets={safeAreaInsets}
      onCloseRequest={() => setOpen(false)} actions={<Button label="Confirmar" onPress={() => { if (choose(draft)) setOpen(false); }} />}>
      {picker}
      {selectionError ? <Text accessibilityLiveRegion="polite" style={{ color: colors.actionDanger }}>{selectionError}</Text> : null}
    </DrawerSheet> : null}
  </View>;
}
