import { useState, type ComponentRef, type ReactNode, type Ref } from 'react';
import { StyleSheet, TextInput, View, type StyleProp, type TextInputProps, type TextStyle, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';

export type TextFieldSize = 'small' | 'medium' | 'large';
export interface TextFieldIconProps { color: string; size: number }
export type TextFieldIcon = ReactNode | ((props: TextFieldIconProps) => ReactNode);

export interface TextFieldProps extends Omit<TextInputProps,
  'value' | 'defaultValue' | 'onChange' | 'onChangeText' | 'editable' | 'style' | 'multiline' | 'accessibilityLabel' | 'ref'
> {
  value: string;
  onChange: (value: string) => void;
  accessibilityLabel: string;
  size?: TextFieldSize;
  disabled?: boolean;
  /** Mensagem de erro acessível, também apresentada pela composição do formulário. */
  error?: string;
  iconStart?: TextFieldIcon;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  ref?: Ref<ComponentRef<typeof TextInput>>;
}

export function TextField({
  value, onChange, accessibilityLabel, size = 'medium', disabled = false, error,
  iconStart, style, inputStyle, onFocus, onBlur, accessibilityState, accessibilityHint, ref, ...nativeProps
}: TextFieldProps) {
  const { textField: tokens } = useTheme();
  const [focused, setFocused] = useState(false);
  if (!accessibilityLabel.trim()) throw new Error('TextField requer uma accessibilityLabel não vazia.');
  if (error !== undefined && !error.trim()) throw new Error('TextField requer uma mensagem de erro não vazia.');
  const state = disabled ? 'disabled' : error ? 'error' : focused ? 'focused' : 'default';
  const palette = tokens.states[state];
  const metrics = tokens.sizes[size];
  const icon = typeof iconStart === 'function' ? iconStart({ color: palette.text, size: tokens.iconSize }) : iconStart;

  return (
    <View style={[styles.container, {
      minHeight: metrics.minHeight, paddingHorizontal: tokens.paddingHorizontal,
      gap: tokens.gap, borderRadius: tokens.radius,
      borderWidth: state === 'focused' || state === 'error' ? tokens.activeBorderWidth : tokens.borderWidth,
      borderColor: palette.border, backgroundColor: palette.background,
    }, style]}>
      {icon ? <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
        pointerEvents="none" style={styles.icon}>{icon}</View> : null}
      <TextInput
        {...nativeProps}
        ref={ref}
        value={value}
        onChangeText={onChange}
        editable={!disabled}
        accessibilityLabel={accessibilityLabel.trim()}
        accessibilityHint={[error, accessibilityHint].filter(Boolean).join('. ') || undefined}
        accessibilityState={{ ...accessibilityState, disabled }}
        placeholderTextColor={nativeProps.placeholderTextColor ?? palette.placeholder}
        underlineColorAndroid="transparent"
        onFocus={event => { setFocused(true); onFocus?.(event); }}
        onBlur={event => { setFocused(false); onBlur?.(event); }}
        style={[styles.input, { color: palette.text, fontFamily: tokens.fontFamily, fontSize: metrics.fontSize }, inputStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch', maxWidth: '100%' },
  input: { flex: 1, minWidth: 0, paddingHorizontal: 0, paddingVertical: 8, includeFontPadding: false },
  icon: { flexShrink: 0, alignItems: 'center', justifyContent: 'center' },
});
