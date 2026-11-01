import { useState, type ReactNode } from 'react';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';

export type NavItemIcon = ReactNode | ((props: { color: string; size: number }) => ReactNode);
export interface NavItemProps {
  label: string; selected: boolean; onPress: () => void; disabled?: boolean; icon?: NavItemIcon;
  badge?: string; accessibilityLabel?: string; accessibilityHint?: string; style?: StyleProp<ViewStyle>; testID?: string;
}
/** Destino visual controlado pela composição, sem dependência de biblioteca de navegação. */
export function NavItem({ label, selected, onPress, disabled = false, icon, badge, accessibilityLabel, accessibilityHint, style, testID }: NavItemProps) {
  const { navigation: t } = useTheme(); const [focused, setFocused] = useState(false);
  if (!label.trim() || (badge !== undefined && !badge.trim()) || (accessibilityLabel !== undefined && !accessibilityLabel.trim()))
    throw new Error('NavItem requer etiqueta e textos fornecidos não vazios.');
  const color = disabled ? t.secondary : selected ? t.brandText : t.secondary;
  const indicatorColor = disabled ? t.indicator : selected ? t.activeIndicator : t.indicator;
  const indicator = disabled ? require('./assets/nav-disabled.svg') : selected ? require('./assets/nav-active.svg') : require('./assets/nav-default.svg');
  const renderedIcon = typeof icon === 'function' ? icon({ color, size: 20 }) : icon;
  return <Pressable testID={testID} accessibilityRole="tab" accessibilityLabel={accessibilityLabel ?? [label, badge].filter(Boolean).join(', ')}
    accessibilityHint={accessibilityHint} accessibilityState={{ selected, disabled }} disabled={disabled}
    onPress={onPress} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => [styles.item, { backgroundColor: selected && !disabled ? t.subtle : t.surface,
      borderColor: focused && !disabled ? t.focus : 'transparent', opacity: pressed && !disabled ? 0.8 : 1 }, style]}>
    <View pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.icon}>
      {typeof renderedIcon === 'string' || typeof renderedIcon === 'number'
        ? <Text style={{ color, fontSize: 20 }}>{renderedIcon}</Text>
        : renderedIcon ?? <Image source={indicator} tintColor={indicatorColor} style={styles.indicator} accessible={false} />}
    </View>
    <Text allowFontScaling style={{ color, fontFamily: selected && !disabled ? t.semiboldFont : t.mediumFont, fontSize: 11, textAlign: 'center' }}>{label}</Text>
    {badge ? <Text accessible={false} allowFontScaling style={{ color, fontFamily: t.mediumFont, fontSize: 11 }}>{badge}</Text> : null}
  </Pressable>;
}
const styles = StyleSheet.create({ item: { minHeight: 58, minWidth: 44, maxWidth: '100%', paddingHorizontal: 5, paddingVertical: 6,
  borderWidth: 2, borderRadius: 10, gap: 5, alignItems: 'center', justifyContent: 'center', flexShrink: 1 },
  icon: { alignItems: 'center', justifyContent: 'center' }, indicator: { width: 7, height: 7 } });
