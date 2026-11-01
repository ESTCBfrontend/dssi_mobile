import { useEffect, useState } from 'react';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Platform, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Button } from '../Button';
import { DrawerSheet, type OverlayInsets } from '../DrawerSheet';
import { FormField } from '../FormField';
import { PickerControl } from '../PickerControl/PickerControl';
import { formatTime, isTime, timeDate } from '../PickerControl/dateTime';
import { useTheme } from '../theme';

export interface TimePickerProps {
  label: string; value: string | null; onChange: (value: string | null) => void;
  minTime?: string; maxTime?: string; availableSlots?: readonly string[]; disabled?: boolean;
  required?: boolean; helperText?: string; error?: string; placeholder?: string; clearable?: boolean;
  safeAreaInsets?: Partial<OverlayInsets>; style?: StyleProp<ViewStyle>; testID?: string;
}
export function TimePicker({ label, value, onChange, minTime, maxTime, availableSlots, disabled = false, required,
  helperText, error, placeholder = 'HH:MM', clearable = false, safeAreaInsets, style, testID }: TimePickerProps) {
  const { textField: t, colors } = useTheme();
  const [open, setOpen] = useState(false); const [draft, setDraft] = useState(timeDate(value)); const [selectionError, setSelectionError] = useState<string>();
  useEffect(() => { if (disabled) setOpen(false); }, [disabled]);
  if ((value !== null && !isTime(value)) || (minTime !== undefined && !isTime(minTime)) ||
      (maxTime !== undefined && !isTime(maxTime)) || availableSlots?.some(slot => !isTime(slot)) ||
      (minTime && maxTime && minTime > maxTime)) throw new Error('TimePicker requer horas válidas HH:mm e limites ordenados.');
  const choose = (time: string) => {
    if ((minTime && time < minTime) || (maxTime && time > maxTime) || (availableSlots && !availableSlots.includes(time))) {
      setSelectionError('Esta hora não está disponível.'); return false;
    }
    setSelectionError(undefined); onChange(time); return true;
  };
  const show = () => { setDraft(timeDate(value)); setSelectionError(undefined); setOpen(true); };
  const onNativeChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') { setOpen(false); if (event.type === 'set' && date && !disabled) choose(formatTime(date)); }
    else if (event.type === 'set' && date) setDraft(date);
  };
  const showSheet = Platform.OS === 'ios' || availableSlots !== undefined;
  const slots = availableSlots?.filter(slot => (!minTime || slot >= minTime) && (!maxTime || slot <= maxTime));
  return <View style={style}>
    <FormField label={label} required={required} helperText={helperText} error={error || selectionError} disabled={disabled}>
      {control => <PickerControl label={control.accessibilityLabel} accessibilityHint={control.accessibilityHint}
        value={value ?? placeholder} placeholder={!value} icon="time" disabled={disabled} error={control.error}
        expanded={open} testID={testID} onPress={show} />}
    </FormField>
    {clearable && value && !disabled ? <Button size="small" variant="outline" label="Limpar hora"
      onPress={() => { setSelectionError(undefined); onChange(null); }} /> : null}
    {Platform.OS === 'android' && open && !disabled && !showSheet
      ? <DateTimePicker testID={testID ? `${testID}-native` : undefined} mode="time" is24Hour value={draft} onChange={onNativeChange} /> : null}
    {showSheet ? <DrawerSheet open={open && !disabled} title={label} safeAreaInsets={safeAreaInsets}
      onCloseRequest={() => setOpen(false)} actions={availableSlots === undefined
        ? <Button label="Confirmar" onPress={() => { if (choose(formatTime(draft))) setOpen(false); }} /> : undefined}>
      {slots ? slots.length ? <View style={styles.slots} accessibilityRole="radiogroup">{slots.map(slot =>
        <Pressable key={slot} accessibilityRole="radio" accessibilityState={{ checked: value === slot }} onPress={() => { if (choose(slot)) setOpen(false); }}
          style={[styles.slot, { backgroundColor: value === slot ? colors.actionPrimary : t.states.disabled.background }]}>
          <Text allowFontScaling style={{ color: value === slot ? colors.textOnPrimary : t.states.default.text, fontFamily: t.fontFamily }}>{slot}</Text>
        </Pressable>)}</View> : <Text style={{ color: t.states.default.placeholder }}>Sem horários disponíveis.</Text>
        : <DateTimePicker testID={testID ? `${testID}-native` : undefined} mode="time" is24Hour locale="pt-PT" value={draft} display="spinner" onChange={onNativeChange} />}
      {selectionError ? <Text accessibilityLiveRegion="polite" style={{ color: colors.actionDanger }}>{selectionError}</Text> : null}
    </DrawerSheet> : null}
  </View>;
}
const styles = StyleSheet.create({ slots: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slot: { minHeight: 44, minWidth: 70, flexGrow: 1, padding: 10, borderRadius: 9, alignItems: 'center', justifyContent: 'center' } });
