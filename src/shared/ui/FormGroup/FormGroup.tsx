import { useState, type ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';

export type FormGroupLayout = 'stacked' | 'twoColumns';
export interface FormGroupProps extends Pick<ViewProps, 'testID' | 'nativeID' | 'onLayout'> {
  title?: string;
  description?: string;
  children?: ReactNode;
  secondary?: ReactNode;
  actions?: ReactNode;
  layout?: FormGroupLayout;
  style?: StyleProp<ViewStyle>;
}

export function FormGroup({ title, description, children, secondary, actions, layout = 'stacked', style,
  onLayout, ...nativeProps }: FormGroupProps) {
  const { formGroup: tokens } = useTheme();
  const [width, setWidth] = useState(0);
  if (title !== undefined && !title.trim()) throw new Error('FormGroup requer um título não vazio quando fornecido.');
  if (description !== undefined && !description.trim()) throw new Error('FormGroup requer uma descrição não vazia quando fornecida.');
  const columns = layout === 'twoColumns' && width >= tokens.columnsBreakpoint;
  const gap = columns ? tokens.columnGap : tokens.fieldGap;

  return <View {...nativeProps} onLayout={event => { setWidth(event.nativeEvent.layout.width); onLayout?.(event); }}
    style={[styles.container, { backgroundColor: tokens.background, borderColor: tokens.border, borderRadius: tokens.radius,
      padding: columns ? tokens.columnsPadding : tokens.stackedPadding, gap: tokens.sectionGap }, style]}>
    {title || description ? <View style={[styles.slot, { gap: tokens.headingGap }]}>
      {title ? <Text accessibilityRole="header" allowFontScaling style={{ color: tokens.titleColor, fontFamily: tokens.titleFamily,
        fontSize: tokens.titleSize, lineHeight: tokens.titleLineHeight }}>{title}</Text> : null}
      {description ? <Text allowFontScaling style={{ color: tokens.descriptionColor, fontFamily: tokens.descriptionFamily,
        fontSize: tokens.descriptionSize }}>{description}</Text> : null}
    </View> : null}
    <View style={[styles.slot, columns && styles.columns, { gap }]}>
      <View style={[styles.fields, columns && styles.column, { gap }]}>{children}</View>
      {secondary != null && secondary !== false ? <View style={[styles.fields, columns && styles.column, { gap }]}>{secondary}</View> : null}
    </View>
    {actions ? <View style={[styles.actions, { gap: tokens.actionsGap }]}>{actions}</View> : null}
  </View>;
}

const styles = StyleSheet.create({
  container: { alignSelf: 'stretch', maxWidth: '100%', borderWidth: 1 },
  slot: { alignSelf: 'stretch', minWidth: 0 },
  columns: { flexDirection: 'row', alignItems: 'flex-start' },
  fields: { minWidth: 0 },
  column: { flex: 1 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' },
});
