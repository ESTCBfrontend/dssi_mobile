import { useState } from 'react';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';

export interface PickerControlProps {
  label: string; value: string; placeholder?: boolean; error?: string; disabled?: boolean;
  expanded?: boolean; size?: 'small' | 'medium' | 'large'; icon?: 'chevron' | 'date' | 'time';
  onPress: () => void; accessibilityHint?: string; testID?: string; style?: StyleProp<ViewStyle>;
}
/** Controlo interno comum aos seletores; o valor e a ação pertencem ao consumidor. */
export function PickerControl({ label, value, placeholder = false, error, disabled = false, expanded = false,
  size = 'medium', icon = 'chevron', onPress, accessibilityHint, testID, style }: PickerControlProps) {
  const { textField: t, colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const state = disabled ? 'disabled' : error ? 'error' : focused || expanded ? 'focused' : 'default';
  const palette = t.states[state];
  return <Pressable testID={testID} accessibilityRole="button" accessibilityLabel={label}
    accessibilityValue={{ text: value }} accessibilityHint={[error, accessibilityHint].filter(Boolean).join('. ') || undefined}
    accessibilityState={{ disabled, expanded }} disabled={disabled} onPress={onPress}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={[styles.control, { minHeight: icon === 'chevron' ? t.sizes[size].minHeight : 48,
      borderRadius: t.radius, borderColor: palette.border,
      borderWidth: state === 'focused' || state === 'error' ? t.activeBorderWidth : t.borderWidth,
      backgroundColor: palette.background, paddingHorizontal: t.paddingHorizontal, gap: t.gap }, style]}>
    <Text allowFontScaling style={[styles.value, { fontFamily: t.fontFamily, fontSize: t.sizes[size].fontSize,
      color: icon !== 'chevron' && error && !disabled ? colors.actionDanger : placeholder ? palette.placeholder : palette.text }]}>{value}</Text>
    {icon === 'chevron' ? <View style={styles.chevronSlot} accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Image source={require('./assets/chevron-down.svg')} style={styles.chevron}
        tintColor={disabled ? palette.text : colors.textPrimary} accessible={false} /></View>
      : <Text accessible={false} style={{ color: disabled ? palette.text : colors.textBrand,
        fontFamily: t.fontFamily, fontSize: icon === 'date' ? 21 : 22 }}>{icon === 'date' ? '▦' : '◷'}</Text>}
  </Pressable>;
}
const styles = StyleSheet.create({
  control: { alignSelf: 'stretch', maxWidth: '100%', flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  value: { flex: 1, minWidth: 0 }, chevronSlot: { width: 20, height: 20 }, chevron: { width: 24, height: 24 },
});
