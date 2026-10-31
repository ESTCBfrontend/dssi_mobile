import { useState, type ComponentRef, type Ref } from 'react';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';

export type SwitchSize = 'compact' | 'comfortable';
type NativeSwitchProps = Pick<PressableProps, 'accessibilityHint' | 'testID' | 'nativeID' | 'onLayout' | 'onFocus' | 'onBlur'>;
type SwitchName = { label: string; accessibilityLabel?: string } | { label?: never; accessibilityLabel: string };

export type SwitchProps = NativeSwitchProps & SwitchName & {
  value: boolean;
  onValueChange: (value: boolean) => void;
  description?: string;
  disabled?: boolean;
  size?: SwitchSize;
  style?: StyleProp<ViewStyle>;
  ref?: Ref<ComponentRef<typeof Pressable>>;
};

export function Switch({ value, onValueChange, label, accessibilityLabel, description, disabled = false,
  size = 'comfortable', style, accessibilityHint, onFocus, onBlur, ref, ...nativeProps }: SwitchProps) {
  const { switch: tokens } = useTheme();
  const [focused, setFocused] = useState(false);
  const name = accessibilityLabel?.trim() || label?.trim();
  if (!name) throw new Error('Switch requer uma label ou accessibilityLabel não vazia.');
  const hint = [description?.trim(), accessibilityHint?.trim()].filter(Boolean).join('. ') || undefined;
  const metrics = tokens.sizes[size];
  const image = tokens.images[size][disabled ? 'disabled' : 'default'][value ? 'on' : 'off'];

  return <Pressable {...nativeProps} ref={ref} accessible accessibilityRole="switch"
    accessibilityLabel={name} accessibilityHint={hint} accessibilityState={{ checked: value, disabled }}
    disabled={disabled} onPress={() => onValueChange(!value)}
    onFocus={event => { setFocused(true); onFocus?.(event); }}
    onBlur={event => { setFocused(false); onBlur?.(event); }}
    style={({ pressed }) => [styles.root, { minHeight: metrics.minHeight, gap: tokens.gap,
      opacity: pressed && !disabled ? tokens.pressedOpacity : 1 }, style]}>
    {(label || description) ? <View style={styles.text}>
      {label ? <Text accessible={false} allowFontScaling style={{ color: disabled ? tokens.disabledText : tokens.label,
        fontFamily: tokens.labelFamily, fontSize: tokens.labelSize, lineHeight: tokens.labelLineHeight }}>{label}</Text> : null}
      {description ? <Text accessible={false} allowFontScaling style={{ color: disabled ? tokens.disabledText : tokens.description,
        fontFamily: tokens.descriptionFamily, fontSize: tokens.descriptionSize, lineHeight: tokens.descriptionLineHeight }}>{description}</Text> : null}
    </View> : null}
    <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
      pointerEvents="none" style={[styles.target, { width: metrics.targetWidth }]}>
      <View style={[styles.ring, { width: metrics.ringWidth, height: metrics.ringHeight,
        borderRadius: metrics.ringHeight / 2, borderColor: focused && !disabled ? tokens.focusBorder : 'transparent' }]}>
        <Image source={image} contentFit="contain" style={{ width: metrics.trackWidth, height: metrics.trackHeight }}
          accessibilityElementsHidden accessible={false} />
      </View>
    </View>
  </Pressable>;
}

const styles = StyleSheet.create({
  root: { flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch', maxWidth: '100%', padding: 4 },
  text: { flex: 1, minWidth: 0, gap: 4 },
  target: { height: 44, flexShrink: 0, alignItems: 'center', justifyContent: 'center' },
  ring: { borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});
