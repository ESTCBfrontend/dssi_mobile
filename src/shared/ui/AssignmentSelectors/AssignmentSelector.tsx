import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { FormField } from '../FormField';
import { Select, type SelectOption } from '../Select';
import type { OverlayInsets } from '../DrawerSheet';
import { useTheme } from '../theme';

/** Dados de apresentação fornecidos pela funcionalidade; estado não determina permissões. */
export interface AssignmentOption {
  id: string; name: string; description?: string; statusLabel?: string; initials?: string; disabled?: boolean;
}
export interface AssignmentSelectorProps {
  label: string; options: readonly AssignmentOption[]; value: string | null; onChange: (value: string | null) => void;
  placeholder: string; searchLabel: string; selectedLabel?: string; required?: boolean; disabled?: boolean;
  error?: string; helperText?: string; loading?: boolean; loadError?: string; onRetry?: () => void;
  clearable?: boolean; safeAreaInsets?: Partial<OverlayInsets>; style?: StyleProp<ViewStyle>; testID?: string;
}
function initialsOf(option: AssignmentOption): string {
  return option.initials?.trim() || option.name.trim().split(/\s+/u).slice(0, 2).map(word => Array.from(word)[0] ?? '').join('').toLocaleUpperCase();
}
export function AssignmentSelector({ label, options, value, onChange, placeholder, searchLabel, selectedLabel,
  required, disabled = false, error, helperText, loading, loadError, onRetry, clearable, safeAreaInsets, style, testID }: AssignmentSelectorProps) {
  const { assignment: t } = useTheme();
  const mapped: SelectOption[] = options.map(option => ({
    value: option.id, label: option.name,
    description: [option.description, option.statusLabel].filter(Boolean).join(' · ') || undefined, disabled: option.disabled,
  }));
  return <FormField label={label} required={required} disabled={disabled} error={error} helperText={helperText} style={style}>
    {control => <Select {...control} options={mapped} value={value} onChange={onChange}
      placeholder={placeholder} selectedLabel={selectedLabel} searchable searchLabel={searchLabel}
      clearable={clearable} loading={loading} loadError={loadError} onRetry={onRetry} safeAreaInsets={safeAreaInsets}
      style={{ minHeight: 48 }} testID={testID} renderOption={(item, selected) => {
        const option = options.find(entry => entry.id === item.value)!;
        return <View style={[styles.row, { backgroundColor: selected ? t.selected : t.background }]}>
          <View accessible={false} style={[styles.avatar, { backgroundColor: option.disabled ? t.subtle : t.brand }]}>
            <Text allowFontScaling style={{ color: option.disabled ? t.disabled : t.onBrand, fontFamily: t.semiboldFont, fontSize: 11 }}>{initialsOf(option)}</Text>
          </View>
          <View style={styles.details}>
            <Text allowFontScaling style={{ color: option.disabled ? t.disabled : t.primary, fontFamily: t.semiboldFont, fontSize: 13 }}>{option.name}</Text>
            {item.description ? <Text allowFontScaling style={{ color: t.secondary, fontFamily: t.regularFont, fontSize: 11 }}>{item.description}</Text> : null}
          </View>
        </View>;
      }} />}
  </FormField>;
}
const styles = StyleSheet.create({
  row: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', padding: 9, gap: 10, borderRadius: 9 },
  avatar: { width: 38, minHeight: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center', padding: 3 },
  details: { flex: 1, minWidth: 0, gap: 4 },
});
