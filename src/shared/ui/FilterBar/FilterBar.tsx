import { useEffect, useState, type ReactNode } from 'react';
import { Image } from 'expo-image';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Button } from '../Button';
import { DrawerSheet, type OverlayInsets } from '../DrawerSheet';
import { Select, type SelectOption } from '../Select';
import { TextField } from '../TextField';
import { useTheme } from '../theme';

export interface FilterCriterion {
  id: string; label: string; value: string | null; options: readonly SelectOption[];
  onChange: (value: string | null) => void; disabled?: boolean; loading?: boolean;
  loadError?: string; onRetry?: () => void; selectedLabel?: string;
}
export interface FilterBarProps {
  title?: string; search?: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; disabled?: boolean };
  filters?: readonly FilterCriterion[]; onReset?: () => void; resetLabel?: string; extraFilters?: ReactNode;
  extraFiltersTitle?: string; activeExtraCount?: number; actions?: ReactNode; disabled?: boolean;
  safeAreaInsets?: Partial<OverlayInsets>; style?: StyleProp<ViewStyle>; testID?: string;
}
export function FilterBar({ title, search, filters = [], onReset, resetLabel = 'Limpar', extraFilters,
  extraFiltersTitle = 'Mais filtros', activeExtraCount = 0, actions, disabled = false, safeAreaInsets, style, testID }: FilterBarProps) {
  const { media: t } = useTheme(); const [open, setOpen] = useState(false);
  useEffect(() => { if (disabled) setOpen(false); }, [disabled]);
  if ((title !== undefined && !title.trim()) || !resetLabel.trim() || !extraFiltersTitle.trim() ||
      !Number.isSafeInteger(activeExtraCount) || activeExtraCount < 0 ||
      filters.some(item => !item.id.trim() || !item.label.trim()) || new Set(filters.map(item => item.id)).size !== filters.length)
    throw new Error('FilterBar requer etiquetas válidas, identificadores únicos e contagem não negativa.');
  return <View testID={testID} style={[styles.container, { backgroundColor: t.subtle, borderColor: t.border, borderRadius: t.radius }, style]}>
    {title ? <Text accessibilityRole="header" allowFontScaling style={{ color: t.primary, fontFamily: t.semiboldFont, fontSize: 13 }}>{title}</Text> : null}
    {search ? <TextField accessibilityLabel={search.label} value={search.value} onChange={search.onChange}
      placeholder={search.placeholder} disabled={disabled || search.disabled}
      iconStart={({ color }) => <Image source={require('./assets/search.svg')} tintColor={color} style={styles.searchIcon} accessible={false} />} /> : null}
    {filters.map(item => <Select key={item.id} accessibilityLabel={item.label} placeholder={item.label}
      options={item.options} value={item.value} onChange={item.onChange} disabled={disabled || item.disabled}
      loading={item.loading} loadError={item.loadError} onRetry={item.onRetry} selectedLabel={item.selectedLabel}
      safeAreaInsets={safeAreaInsets} />)}
    {extraFilters != null ? <Button variant="outline" fullWidth label={activeExtraCount ? `${extraFiltersTitle} (${activeExtraCount})` : extraFiltersTitle}
      disabled={disabled} onPress={() => setOpen(true)} /> : null}
    {onReset ? <Button variant="outline" fullWidth label={resetLabel} disabled={disabled} onPress={onReset} /> : null}
    {actions ? <View style={styles.actions}>{actions}</View> : null}
    {extraFilters != null ? <DrawerSheet open={open && !disabled} title={extraFiltersTitle} safeAreaInsets={safeAreaInsets}
      onCloseRequest={() => setOpen(false)}>{extraFilters}</DrawerSheet> : null}
  </View>;
}
const styles = StyleSheet.create({ container: { alignSelf: 'stretch', maxWidth: '100%', borderWidth: 1, padding: 16, gap: 12 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, searchIcon: { width: 24, height: 24 } });
