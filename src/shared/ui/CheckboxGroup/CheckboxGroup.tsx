import { useState } from 'react';
import { StyleSheet, Text, View, type LayoutChangeEvent, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { Checkbox, type CheckboxSize } from '../Checkbox';
import { useTheme } from '../theme';

export interface CheckboxGroupOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export type CheckboxGroupLayout = 'stacked' | 'twoColumns';
export interface CheckboxGroupProps extends Pick<ViewProps, 'testID' | 'nativeID' | 'onLayout'> {
  label: string;
  description?: string;
  helperText?: string;
  options: readonly CheckboxGroupOption[];
  values: readonly string[];
  onChange: (values: string[]) => void;
  error?: string;
  disabled?: boolean;
  layout?: CheckboxGroupLayout;
  size?: CheckboxSize;
  style?: StyleProp<ViewStyle>;
}

export function CheckboxGroup({ label, description, helperText, options, values, onChange, error, disabled = false,
  layout = 'stacked', size = 'comfortable', style, onLayout, ...nativeProps }: CheckboxGroupProps) {
  const { checkboxGroup: tokens } = useTheme();
  const [width, setWidth] = useState(0);
  if (!label.trim()) throw new Error('CheckboxGroup requer uma label não vazia.');
  if (error !== undefined && !error.trim()) throw new Error('CheckboxGroup requer uma mensagem de erro não vazia.');
  if (new Set(options.map(option => option.value)).size !== options.length) {
    throw new Error('CheckboxGroup requer valores de opção únicos.');
  }
  if (new Set(values).size !== values.length) throw new Error('CheckboxGroup requer valores selecionados únicos.');
  const columnsFit = width >= tokens.minColumnWidth * 2 + tokens.columnGap + tokens.paddingWide * 2 + tokens.borderWidth * 2;
  const twoColumns = layout === 'twoColumns' && columnsFit;
  const split = Math.ceil(options.length / 2);
  const columns = twoColumns ? [options.slice(0, split), options.slice(split)] : [options];
  const message = error?.trim() || helperText?.trim() || undefined;

  function handleLayout(event: LayoutChangeEvent) {
    setWidth(event.nativeEvent.layout.width);
    onLayout?.(event);
  }

  function handleChange(optionValue: string, checked: boolean) {
    const contains = values.includes(optionValue);
    if (checked === contains) return;
    onChange(checked ? [...values, optionValue] : values.filter(value => value !== optionValue));
  }

  return <View {...nativeProps} onLayout={handleLayout} style={[styles.container, {
    borderColor: error ? tokens.errorBorder : tokens.border, borderWidth: tokens.borderWidth,
    borderRadius: tokens.radius, backgroundColor: tokens.background,
    padding: twoColumns ? tokens.paddingWide : tokens.paddingStacked, gap: tokens.sectionGap,
  }, style]}>
    <View style={{ gap: tokens.headerGap }}>
      <Text accessibilityRole="header" allowFontScaling style={{ color: tokens.title, fontFamily: tokens.titleFamily,
        fontSize: tokens.titleSize, lineHeight: tokens.titleLineHeight }}>{label}</Text>
      {description ? <Text allowFontScaling style={{ color: tokens.description, fontFamily: tokens.bodyFamily,
        fontSize: tokens.descriptionSize }}>{description}</Text> : null}
    </View>
    <View accessible={false} testID={nativeProps.testID ? `${nativeProps.testID}-options` : undefined}
      style={{ flexDirection: twoColumns ? 'row' : 'column', gap: tokens.columnGap }}>
      {columns.map((column, index) => <View key={index} style={[styles.column, { gap: tokens.optionGap }]}>
        {column.map(option => <Checkbox key={option.value} label={option.label}
          accessibilityLabel={`${option.label}, ${label}`} accessibilityHint={message}
          description={option.description} checked={values.includes(option.value)}
          disabled={disabled || option.disabled} size={size} onChange={checked => handleChange(option.value, checked)} />)}
      </View>)}
    </View>
    {message ? <Text allowFontScaling style={{ color: error ? tokens.errorText : tokens.helperText, fontFamily: tokens.bodyFamily,
      fontSize: tokens.messageSize, lineHeight: tokens.messageLineHeight }}>{message}</Text> : null}
  </View>;
}

const styles = StyleSheet.create({
  container: { alignSelf: 'stretch', maxWidth: '100%' },
  column: { flex: 1, minWidth: 0 },
});
