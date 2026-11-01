import { useEffect, useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Button } from '../Button';
import { DrawerSheet, type OverlayInsets } from '../DrawerSheet';
import { TextField, type TextFieldSize } from '../TextField';
import { PickerControl } from '../PickerControl/PickerControl';
import { useTheme } from '../theme';

export interface SelectOption { value: string; label: string; description?: string; disabled?: boolean }
export interface SelectProps {
  options: readonly SelectOption[]; value: string | null; onChange: (value: string | null) => void;
  accessibilityLabel: string; accessibilityHint?: string; placeholder?: string; selectedLabel?: string; size?: TextFieldSize;
  disabled?: boolean; error?: string; loading?: boolean; loadError?: string; onRetry?: () => void;
  searchable?: boolean; clearable?: boolean; searchLabel?: string; emptyLabel?: string; loadingLabel?: string;
  sheetTitle?: string; safeAreaInsets?: Partial<OverlayInsets>; style?: StyleProp<ViewStyle>; testID?: string;
  renderOption?: (option: SelectOption, selected: boolean) => ReactNode;
}
export function Select({ options, value, onChange, accessibilityLabel, accessibilityHint, placeholder = 'Selecione uma opção', selectedLabel,
  size = 'medium', disabled = false, error, loading = false, loadError, onRetry, searchable = false, clearable = false,
  searchLabel = 'Pesquisar opções', emptyLabel = 'Sem opções disponíveis', loadingLabel = 'A carregar opções',
  sheetTitle, safeAreaInsets, style, testID, renderOption }: SelectProps) {
  const { textField: t, colors } = useTheme(); const [open, setOpen] = useState(false); const [query, setQuery] = useState('');
  useEffect(() => { if (disabled) { setOpen(false); setQuery(''); } }, [disabled]);
  if (!accessibilityLabel.trim() || !placeholder.trim() || !emptyLabel.trim() || !loadingLabel.trim() ||
      (searchable && !searchLabel.trim()) || (error !== undefined && !error.trim()) || (loadError !== undefined && !loadError.trim()))
    throw new Error('Select requer etiquetas e mensagens fornecidas não vazias.');
  if (options.some(option => !option.value || !option.label.trim()) || new Set(options.map(option => option.value)).size !== options.length)
    throw new Error('Select requer opções com valores únicos e etiquetas não vazias.');
  const selected = options.find(option => option.value === value);
  const display = value === null ? placeholder : selected?.label ?? selectedLabel ?? value;
  const search = query.trim().toLocaleLowerCase();
  const visible = search ? options.filter(option => (option.label + ' ' + (option.description ?? '')).toLocaleLowerCase().includes(search)) : options;
  const close = () => { setOpen(false); setQuery(''); };
  return <>
    <PickerControl label={accessibilityLabel} accessibilityHint={accessibilityHint} value={display} placeholder={value === null} disabled={disabled}
      error={error} expanded={open} size={size} style={style} testID={testID} onPress={() => setOpen(true)} />
    <DrawerSheet open={open && !disabled} title={sheetTitle || accessibilityLabel} onCloseRequest={close} safeAreaInsets={safeAreaInsets}>
      {clearable && value !== null ? <Button size="small" variant="outline" label="Limpar seleção"
        onPress={() => { onChange(null); close(); }} /> : null}
      {searchable ? <TextField value={query} onChange={setQuery} accessibilityLabel={searchLabel} placeholder={searchLabel} /> : null}
      {loading ? <View style={styles.message}><ActivityIndicator color={colors.textBrand} /><Text accessibilityLiveRegion="polite" style={{ color: t.states.default.text }}>{loadingLabel}</Text></View>
        : loadError ? <View style={styles.message}><Text accessibilityLiveRegion="polite" style={{ color: colors.actionDanger }}>{loadError}</Text>
          {onRetry ? <Pressable accessibilityRole="button" onPress={onRetry} style={styles.option}><Text style={{ color: colors.textBrand }}>Tentar novamente</Text></Pressable> : null}</View>
        : visible.length === 0 ? <Text accessibilityLiveRegion="polite" style={{ color: t.states.default.placeholder, fontFamily: t.fontFamily }}>{emptyLabel}</Text>
        : <View accessibilityRole="radiogroup">{visible.map(option => {
          const isSelected = option.value === value;
          return <Pressable key={option.value} accessibilityRole="radio" accessibilityLabel={option.label}
            accessibilityHint={option.description} accessibilityState={{ checked: isSelected, disabled: !!option.disabled }}
            disabled={option.disabled} onPress={() => { if (!disabled && !option.disabled) { onChange(option.value); close(); } }}
            style={[styles.option, { borderBottomColor: t.states.default.border, opacity: option.disabled ? 0.55 : 1 }]}>
            {renderOption ? renderOption(option, isSelected) : <View style={styles.optionBody}>
              <Text allowFontScaling style={{ color: isSelected ? colors.textBrand : t.states.default.text, fontFamily: t.fontFamily, fontSize: 16 }}>{option.label}</Text>
              {option.description ? <Text allowFontScaling style={{ color: t.states.default.placeholder, fontFamily: t.fontFamily }}>{option.description}</Text> : null}
            </View>}
            {isSelected ? <Text accessible={false} style={{ color: colors.textBrand }}>✓</Text> : null}
          </Pressable>;
        })}</View>}
    </DrawerSheet>
  </>;
}
const styles = StyleSheet.create({
  message: { gap: 10, alignItems: 'flex-start' }, option: { minHeight: 48, paddingVertical: 12, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  optionBody: { flex: 1, minWidth: 0, gap: 3 },
});
