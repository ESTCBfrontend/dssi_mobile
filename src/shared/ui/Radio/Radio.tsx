import { useState, type ComponentRef, type Ref } from 'react';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';

export type RadioSize = 'compact' | 'comfortable';
type NativeRadioProps = Pick<PressableProps, 'accessibilityHint' | 'accessibilityLabel' | 'testID' | 'nativeID' | 'onLayout' | 'onFocus' | 'onBlur'>;

export interface RadioProps extends NativeRadioProps {
  value: string;
  selected: boolean;
  onChange: (value: string) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  size?: RadioSize;
  style?: StyleProp<ViewStyle>;
  ref?: Ref<ComponentRef<typeof Pressable>>;
}

export function Radio({ value, selected, onChange, label, description, disabled = false, size = 'comfortable',
  style, accessibilityLabel, accessibilityHint, onFocus, onBlur, ref, ...nativeProps }: RadioProps) {
  const { radio: tokens } = useTheme();
  const [focused, setFocused] = useState(false);
  if (!label.trim()) throw new Error('Radio requer uma label não vazia.');
  const state = disabled ? 'disabled' : focused ? 'focused' : 'default';
  const imageSource = tokens.images[size][state][selected ? 'selected' : 'unselected'];
  const hint = [description?.trim(), accessibilityHint?.trim()].filter(Boolean).join('. ') || undefined;

  return <Pressable {...nativeProps} ref={ref} accessible accessibilityRole="radio"
    accessibilityLabel={accessibilityLabel?.trim() || label.trim()} accessibilityHint={hint}
    accessibilityState={{ checked: selected, disabled }} disabled={disabled}
    onPress={() => { if (!selected) onChange(value); }}
    onFocus={event => { setFocused(true); onFocus?.(event); }}
    onBlur={event => { setFocused(false); onBlur?.(event); }}
    style={({ pressed }) => [styles.root, { minHeight: tokens.minTouchSize, gap: tokens.gap,
      opacity: pressed && !disabled ? tokens.pressedOpacity : 1 }, style]}>
    <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" pointerEvents="none">
      <Image source={imageSource} contentFit="contain" style={styles.icon} accessibilityElementsHidden accessible={false} />
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
  icon: { width: 28, height: 28 },
  text: { flex: 1, minWidth: 0, gap: 3 },
});
