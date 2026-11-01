import { useState } from 'react';
import { StyleSheet, Text, View, type LayoutChangeEvent, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { Radio, type RadioSize } from '../Radio';
import { useTheme } from '../theme';

export interface RadioGroupOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export type RadioGroupLayout = 'stacked' | 'twoColumns';
export interface RadioGroupProps extends Pick<ViewProps, 'testID' | 'nativeID' | 'onLayout'> {
  label: string;
  description?: string;
  options: readonly RadioGroupOption[];
  value: string | null;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  layout?: RadioGroupLayout;
  size?: RadioSize;
  style?: StyleProp<ViewStyle>;
}

export function RadioGroup({ label, description, options, value, onChange, error, disabled = false,
  layout = 'stacked', size = 'comfortable', style, onLayout, ...nativeProps }: RadioGroupProps) {
  const { radioGroup: tokens } = useTheme();
  const [width, setWidth] = useState(0);
  if (!label.trim()) throw new Error('RadioGroup requer uma label não vazia.');
  if (error !== undefined && !error.trim()) throw new Error('RadioGroup requer uma mensagem de erro não vazia.');
  if (new Set(options.map(option => option.value)).size !== options.length) {
    throw new Error('RadioGroup requer valores de opção únicos.');
  }
  const columnsFit = width >= tokens.minColumnWidth * 2 + tokens.columnGap + tokens.paddingWide * 2 + tokens.borderWidth * 2;
  const twoColumns = layout === 'twoColumns' && columnsFit;
  const split = Math.ceil(options.length / 2);
  const columns = twoColumns ? [options.slice(0, split), options.slice(split)] : [options];
  const optionHint = error?.trim() || undefined;

  function handleLayout(event: LayoutChangeEvent) {
    setWidth(event.nativeEvent.layout.width);
    onLayout?.(event);
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
    <View accessibilityRole="radiogroup" accessible={false} style={{ flexDirection: twoColumns ? 'row' : 'column', gap: tokens.columnGap }}>
      {columns.map((column, index) => <View key={index} style={[styles.column, { gap: tokens.optionGap }]}>
        {column.map(option => <Radio key={option.value} value={option.value} label={option.label}
          accessibilityLabel={`${option.label}, ${label}`} accessibilityHint={optionHint}
          description={option.description} selected={value === option.value}
          disabled={disabled || option.disabled} size={size} onChange={onChange} />)}
      </View>)}
    </View>
    {error ? <Text allowFontScaling style={{ color: tokens.errorText, fontFamily: tokens.bodyFamily,
      fontSize: tokens.errorSize, lineHeight: tokens.errorLineHeight }}>{error}</Text> : null}
  </View>;
}

const styles = StyleSheet.create({
  container: { alignSelf: 'stretch', maxWidth: '100%' },
  column: { flex: 1, minWidth: 0 },
});
