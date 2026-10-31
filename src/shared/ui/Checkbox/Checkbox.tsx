import { useState, type ComponentRef, type Ref } from 'react';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';

export type CheckboxSize = 'compact' | 'comfortable';
type NativeCheckboxProps = Pick<PressableProps, 'accessibilityHint' | 'accessibilityLabel' | 'testID' | 'nativeID' | 'onLayout' | 'onFocus' | 'onBlur'>;

export interface CheckboxProps extends NativeCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Estado intermédio controlado; ao ativar, pede seleção de todos. */
  indeterminate?: boolean;
  description?: string;
  disabled?: boolean;
  size?: CheckboxSize;
  style?: StyleProp<ViewStyle>;
  ref?: Ref<ComponentRef<typeof Pressable>>;
}

const checkImage = require('./assets/check.svg');
const disabledCheckImage = require('./assets/check-disabled.svg');

export function Checkbox({ label, checked, onChange, indeterminate = false, description, disabled = false,
  size = 'comfortable', style, accessibilityLabel, accessibilityHint, onFocus, onBlur, ref, ...nativeProps }: CheckboxProps) {
  const { checkbox: tokens } = useTheme();
  const [focused, setFocused] = useState(false);
  if (!label.trim()) throw new Error('Checkbox requer uma label não vazia.');
  const selected = indeterminate || checked;
  const markColor = disabled ? tokens.disabledMark : tokens.mark;
  const hint = [description?.trim(), accessibilityHint?.trim()].filter(Boolean).join('. ') || undefined;
  const metrics = tokens.sizes[size];

  return <Pressable {...nativeProps} ref={ref} accessible accessibilityRole="checkbox"
    accessibilityLabel={accessibilityLabel?.trim() || label.trim()}
    accessibilityHint={hint} accessibilityState={{ checked: indeterminate ? 'mixed' : checked, disabled }}
    disabled={disabled} onPress={() => onChange(indeterminate ? true : !checked)}
    onFocus={event => { setFocused(true); onFocus?.(event); }}
    onBlur={event => { setFocused(false); onBlur?.(event); }}
    style={({ pressed }) => [styles.root, { minHeight: tokens.minTouchSize, gap: tokens.gap,
      opacity: pressed && !disabled ? tokens.pressedOpacity : 1 }, style]}>
    <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
      pointerEvents="none" style={[styles.halo, { borderRadius: tokens.haloRadius,
        borderColor: focused && !disabled ? tokens.focusBorder : 'transparent' }]}>
      <View style={[styles.square, { width: metrics.boxSize, height: metrics.boxSize, borderRadius: metrics.radius,
        backgroundColor: disabled ? tokens.disabledBackground : selected ? tokens.selectedBackground : tokens.background,
        borderColor: disabled ? tokens.disabledBorder : selected ? tokens.selectedBackground : tokens.border,
        borderWidth: selected ? 1 : 1.5 }]}>
        {indeterminate ? <View style={{ width: 10, height: 2, borderRadius: 1, backgroundColor: markColor }} /> :
          checked ? <Image source={disabled ? disabledCheckImage : checkImage} tintColor={markColor}
            contentFit="contain" style={styles.check} accessibilityElementsHidden accessible={false} /> : null}
      </View>
    </View>
    <View style={styles.text}>
      <Text accessible={false} allowFontScaling style={{ color: disabled ? tokens.disabledText : tokens.label,
        fontFamily: tokens.labelFamily, fontSize: tokens.labelSize, lineHeight: tokens.labelLineHeight }}>{label}</Text>
      {description ? <Text accessible={false} allowFontScaling style={{ color: disabled ? tokens.disabledText : tokens.description,
        fontFamily: tokens.descriptionFamily, fontSize: tokens.descriptionSize, lineHeight: tokens.descriptionLineHeight }}>{description}</Text> : null}
    </View>
  </Pressable>;
}

const styles = StyleSheet.create({
  root: { flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch', maxWidth: '100%', paddingVertical: 4 },
  halo: { width: 28, height: 28, borderWidth: 2, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  square: { alignItems: 'center', justifyContent: 'center' },
  check: { width: 14, height: 14 },
  text: { flex: 1, minWidth: 0, gap: 3 },
});
