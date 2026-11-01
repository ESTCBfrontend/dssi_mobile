import { useState, type ComponentRef, type Ref } from 'react';
import { StyleSheet, Text, TextInput, View, type StyleProp, type TextInputProps, type TextStyle, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';

export type TextareaHeight = 'compact' | 'comfortable';
export interface TextareaProps extends Omit<TextInputProps,
  'value' | 'defaultValue' | 'onChange' | 'onChangeText' | 'editable' | 'style' | 'multiline' | 'accessibilityLabel' | 'ref'
> {
  value: string;
  onChange: (value: string) => void;
  accessibilityLabel: string;
  height?: TextareaHeight;
  disabled?: boolean;
  error?: string;
  showCounter?: boolean;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  ref?: Ref<ComponentRef<typeof TextInput>>;
}

export function Textarea({ value, onChange, accessibilityLabel, height = 'compact', disabled = false, error,
  showCounter = false, style, inputStyle, onFocus, onBlur, onContentSizeChange, accessibilityState,
  accessibilityHint, ref, ...nativeProps }: TextareaProps) {
  const { textField, textarea: tokens } = useTheme();
  const [focused, setFocused] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  if (!accessibilityLabel.trim()) throw new Error('Textarea requer uma accessibilityLabel não vazia.');
  if (error !== undefined && !error.trim()) throw new Error('Textarea requer uma mensagem de erro não vazia.');
  if (nativeProps.maxLength !== undefined && (!Number.isSafeInteger(nativeProps.maxLength) || nativeProps.maxLength < 0)) {
    throw new Error('Textarea requer um maxLength inteiro não negativo.');
  }
  const state = disabled ? 'disabled' : error ? 'error' : focused ? 'focused' : 'default';
  const palette = textField.states[state];
  const counter = nativeProps.maxLength === undefined ? `${value.length}` : `${value.length} / ${nativeProps.maxLength}`;

  return <View style={[styles.container, {
    minHeight: tokens.minHeight[height], paddingHorizontal: tokens.paddingHorizontal, paddingVertical: tokens.paddingVertical,
    gap: tokens.gap, borderRadius: textField.radius, backgroundColor: palette.background, borderColor: palette.border,
    borderWidth: state === 'focused' || state === 'error' ? textField.activeBorderWidth : textField.borderWidth,
  }, style]}>
    <TextInput {...nativeProps} ref={ref} value={value} onChangeText={onChange} editable={!disabled} multiline
      accessibilityLabel={accessibilityLabel.trim()}
      accessibilityHint={[error, accessibilityHint, showCounter ? counter : undefined].filter(Boolean).join('. ') || undefined}
      accessibilityState={{ ...accessibilityState, disabled }}
      placeholderTextColor={nativeProps.placeholderTextColor ?? palette.placeholder} underlineColorAndroid="transparent"
      onFocus={event => { setFocused(true); onFocus?.(event); }}
      onBlur={event => { setFocused(false); onBlur?.(event); }}
      onContentSizeChange={event => {
        const next = event.nativeEvent.contentSize.height;
        if (Number.isFinite(next) && next >= 0) setContentHeight(Math.ceil(next));
        onContentSizeChange?.(event);
      }}
      style={[styles.input, { minHeight: contentHeight, color: palette.text, fontFamily: textField.fontFamily,
        fontSize: tokens.fontSize, lineHeight: tokens.lineHeight }, inputStyle]}
    />
    {showCounter ? <Text accessible={false} allowFontScaling style={{ alignSelf: 'flex-end', color: tokens.counterColor,
      fontFamily: textField.fontFamily, fontSize: tokens.counterSize }}>{counter}</Text> : null}
  </View>;
}

const styles = StyleSheet.create({
  container: { alignSelf: 'stretch', maxWidth: '100%' },
  input: { flexGrow: 1, minWidth: 0, padding: 0, textAlignVertical: 'top', includeFontPadding: false },
});
