import { useState, type ComponentRef, type Ref } from 'react';
import { Pressable, StyleSheet, Text, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';

export type TabSize = 'compact' | 'comfortable';
export interface TabProps extends Pick<PressableProps,
  'accessibilityLabel' | 'accessibilityHint' | 'testID' | 'nativeID' | 'onLayout' | 'onFocus' | 'onBlur'
> {
  id: string;
  label: string;
  selected: boolean;
  onSelect: (id: string) => void;
  disabled?: boolean;
  count?: number;
  size?: TabSize;
  style?: StyleProp<ViewStyle>;
  ref?: Ref<ComponentRef<typeof Pressable>>;
}

export function Tab({ id, label, selected, onSelect, disabled = false, count, size = 'comfortable',
  accessibilityLabel, style, onFocus, onBlur, ref, ...nativeProps }: TabProps) {
  const { tab: tokens } = useTheme();
  const [focused, setFocused] = useState(false);
  if (!id.trim() || !label.trim()) throw new Error('Tab requer um id e uma label não vazios.');
  if (accessibilityLabel !== undefined && !accessibilityLabel.trim()) throw new Error('Tab requer um nome acessível não vazio.');
  if (count !== undefined && (!Number.isSafeInteger(count) || count < 0)) throw new Error('Tab requer um contador inteiro seguro não negativo.');
  const state = disabled ? 'disabled' : selected ? 'selected' : focused ? 'focused' : 'default';
  const palette = tokens.states[state];
  const metrics = tokens.sizes[size];
  const accessibleName = accessibilityLabel?.trim() || [label.trim(), count === undefined ? undefined : String(count)].filter(Boolean).join(', ');

  return <Pressable {...nativeProps} ref={ref} accessible accessibilityRole="tab" accessibilityLabel={accessibleName}
    accessibilityState={{ selected, disabled }} disabled={disabled} focusable={!disabled}
    onPress={() => onSelect(id)} onFocus={event => { setFocused(true); onFocus?.(event); }}
    onBlur={event => { setFocused(false); onBlur?.(event); }}
    style={({ pressed }) => [styles.tab, { minHeight: metrics.minHeight, minWidth: tokens.minTouchSize,
      opacity: pressed && !disabled ? 0.9 : 1 }, style]}>
    <View pointerEvents="none" style={[styles.target, { minHeight: metrics.minHeight - tokens.indicatorHeight,
      borderRadius: tokens.focusRadius, borderColor: focused && !disabled ? tokens.focus : 'transparent',
      backgroundColor: focused && !disabled ? tokens.focusBackground : 'transparent', paddingHorizontal: tokens.paddingHorizontal,
      paddingVertical: tokens.paddingVertical, gap: tokens.gap }]}>
      <Text allowFontScaling style={[styles.label, { color: palette.text, fontFamily: selected && !disabled ? tokens.activeFamily : tokens.labelFamily,
        fontSize: metrics.fontSize }]}>{label}</Text>
      {count !== undefined ? <View style={[styles.counter, { backgroundColor: palette.counterBackground, borderRadius: tokens.counterRadius,
        minWidth: tokens.counterWidth, minHeight: tokens.counterHeight }]}>
        <Text allowFontScaling style={{ color: palette.counterText, fontFamily: tokens.activeFamily, fontSize: tokens.counterFontSize }}>{count}</Text>
      </View> : null}
    </View>
    <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" pointerEvents="none"
      style={{ height: tokens.indicatorHeight, borderRadius: tokens.indicatorHeight / 2,
        backgroundColor: selected ? tokens.indicator : 'transparent', alignSelf: 'stretch' }} />
  </Pressable>;
}

const styles = StyleSheet.create({
  tab: { alignSelf: 'flex-start', maxWidth: '100%' },
  target: { alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  label: { flexShrink: 1, minWidth: 0, textAlign: 'center' },
  counter: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, paddingVertical: 1, flexShrink: 0 },
});
