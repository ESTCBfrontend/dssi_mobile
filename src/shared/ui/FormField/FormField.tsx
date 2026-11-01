import { type ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';

/** Dados a encaminhar para o controlo interativo da composição. */
export interface FormFieldControlProps {
  accessibilityLabel: string;
  accessibilityHint?: string;
  error?: string;
  disabled: boolean;
}

export interface FormFieldProps {
  label: string;
  required?: boolean;
  /** Texto anunciado em conjunto com a etiqueta quando o campo é obrigatório. */
  requiredLabel?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  children: (props: FormFieldControlProps) => ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function FormField({ label, required = false, requiredLabel = 'Obrigatório', helperText, error,
  disabled = false, children, style }: FormFieldProps) {
  const { formField: tokens } = useTheme();
  if (!label.trim()) throw new Error('FormField requer uma label não vazia.');
  if (required && !requiredLabel.trim()) throw new Error('FormField requer uma indicação de obrigatório não vazia.');
  if (error !== undefined && !error.trim()) throw new Error('FormField requer uma mensagem de erro não vazia.');
  const controlProps: FormFieldControlProps = {
    accessibilityLabel: required ? `${label.trim()}, ${requiredLabel.trim()}` : label.trim(),
    accessibilityHint: error ? undefined : helperText?.trim() || undefined,
    error: error?.trim(),
    disabled,
  };
  const message = error?.trim() || helperText?.trim();

  return (
    <View style={[styles.container, { gap: tokens.gap }, style]}>
      <Text accessible={false} allowFontScaling style={{
        color: disabled ? tokens.labelDisabled : tokens.label,
        fontFamily: tokens.labelFamily, fontSize: tokens.labelSize, lineHeight: tokens.labelLineHeight,
      }}>
        {label}{required ? <Text style={{ color: tokens.required }}> *</Text> : null}
      </Text>
      {children(controlProps)}
      {message ? <Text allowFontScaling style={{
        color: error ? tokens.error : tokens.helper, fontFamily: tokens.messageFamily,
        fontSize: tokens.messageSize, lineHeight: tokens.messageLineHeight,
      }}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({ container: { alignSelf: 'stretch', maxWidth: '100%' } });
