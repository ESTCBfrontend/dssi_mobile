import { useState, type ComponentRef, type Ref } from 'react';
import { Pressable, StyleSheet, Text, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';

export type PageButtonSize = 'compact' | 'comfortable';
export interface PageButtonProps extends Pick<PressableProps,
  'accessibilityLabel' | 'accessibilityHint' | 'testID' | 'nativeID' | 'onLayout' | 'onFocus' | 'onBlur'
> {
  page: number;
  onSelect: (page: number) => void;
  current?: boolean;
  disabled?: boolean;
  size?: PageButtonSize;
  style?: StyleProp<ViewStyle>;
  ref?: Ref<ComponentRef<typeof Pressable>>;
}

export function PageButton({ page, onSelect, current = false, disabled = false, size = 'comfortable',
  accessibilityLabel, style, onFocus, onBlur, ref, ...nativeProps }: PageButtonProps) {
  const { pageButton: tokens } = useTheme();
  const [focused, setFocused] = useState(false);
  if (!Number.isSafeInteger(page) || page < 1) throw new Error('PageButton requer uma página inteira positiva e segura.');
  if (accessibilityLabel !== undefined && !accessibilityLabel.trim()) throw new Error('PageButton requer um nome acessível não vazio.');
  const state = disabled ? 'disabled' : current ? 'current' : 'default';
  const palette = tokens.states[state];
  const dimension = tokens.sizes[size];

  return <Pressable {...nativeProps} ref={ref} accessible accessibilityRole="button"
    accessibilityLabel={accessibilityLabel?.trim() || `Página ${page}`}
    accessibilityState={{ selected: current, disabled }} disabled={disabled} focusable={!disabled}
    onPress={() => onSelect(page)}
    onFocus={event => { setFocused(true); onFocus?.(event); }}
    onBlur={event => { setFocused(false); onBlur?.(event); }}
    style={({ pressed }) => [styles.target, { minWidth: tokens.minTouchSize, minHeight: tokens.minTouchSize,
      outlineColor: tokens.focus, outlineStyle: 'solid', outlineWidth: focused && !disabled ? 2 : 0,
      outlineOffset: 2, borderRadius: tokens.radius, opacity: pressed && !disabled ? 0.9 : 1 }, style]}>
    <View pointerEvents="none" style={[styles.visual, { minWidth: dimension, minHeight: dimension,
      backgroundColor: palette.background, borderColor: palette.border, borderRadius: tokens.radius,
      paddingHorizontal: tokens.paddingHorizontal, paddingVertical: tokens.paddingVertical }]}>
      <Text allowFontScaling style={{ color: palette.text, fontFamily: tokens.fontFamily, fontSize: tokens.fontSize }}>{page}</Text>
    </View>
  </Pressable>;
}

const styles = StyleSheet.create({
  target: { alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center', maxWidth: '100%' },
  visual: { alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
});
