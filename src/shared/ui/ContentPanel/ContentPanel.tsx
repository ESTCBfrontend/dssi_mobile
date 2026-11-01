import { useState, type ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';

export type ContentPanelLayout = 'stacked' | 'wide';
export type ContentPanelSurface = 'surface' | 'muted';
export interface ContentPanelProps extends Pick<ViewProps, 'testID' | 'nativeID' | 'onLayout'> {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  layout?: ContentPanelLayout;
  surface?: ContentPanelSurface;
  style?: StyleProp<ViewStyle>;
}

export function ContentPanel({ title, description, actions, children, footer, layout = 'stacked', surface = 'surface',
  style, onLayout, ...nativeProps }: ContentPanelProps) {
  const { contentPanel: tokens } = useTheme();
  const [width, setWidth] = useState(0);
  const metrics = tokens.layouts[layout];
  if (title !== undefined && !title.trim()) throw new Error('ContentPanel requer um título não vazio quando fornecido.');
  if (description !== undefined && !description.trim()) throw new Error('ContentPanel requer uma descrição não vazia quando fornecida.');
  const hasHeader = Boolean(title || description || actions);
  const hasContent = children !== null && children !== undefined && children !== false;

  const wideHeader = layout === 'wide' && width >= tokens.wideBreakpoint;

  return <View {...nativeProps} onLayout={event => { setWidth(event.nativeEvent.layout.width); onLayout?.(event); }}
    style={[styles.container, { backgroundColor: tokens.background[surface],
    borderColor: tokens.border, borderWidth: surface === 'surface' ? 1 : 0, borderRadius: tokens.radius,
    padding: metrics.padding, gap: metrics.gap }, style]}>
    {hasHeader ? <View style={[wideHeader ? styles.wideHeader : styles.stackedHeader, { gap: tokens.headerGap }]}>
      {title || description ? <View style={[styles.heading, wideHeader && styles.wideHeading, { gap: tokens.headingGap }]}>
        {title ? <Text accessibilityRole="header" allowFontScaling style={{ color: tokens.titleColor,
          fontFamily: tokens.titleFamily, fontSize: tokens.titleSize, lineHeight: tokens.titleLineHeight }}>{title}</Text> : null}
        {description ? <Text allowFontScaling style={{ color: tokens.descriptionColor, fontFamily: tokens.descriptionFamily,
          fontSize: tokens.descriptionSize, lineHeight: tokens.descriptionLineHeight }}>{description}</Text> : null}
      </View> : null}
      {actions ? <View style={[styles.actions, { gap: tokens.actionsGap }]}>{actions}</View> : null}
    </View> : null}
    {hasHeader && hasContent ? <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
      style={{ height: 1, backgroundColor: tokens.border }} /> : null}
    {hasContent ? <View style={styles.slot}>{children}</View> : null}
    {footer ? <View style={[styles.slot, { gap: tokens.footerGap }]}>
      {hasHeader || hasContent ? <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
        style={{ height: 1, backgroundColor: tokens.border }} /> : null}
      {footer}
    </View> : null}
  </View>;
}

const styles = StyleSheet.create({
  container: { alignSelf: 'stretch', maxWidth: '100%' },
  stackedHeader: { alignSelf: 'stretch' },
  wideHeader: { alignSelf: 'stretch', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' },
  heading: { flexGrow: 1, flexShrink: 1, minWidth: 0 },
  wideHeading: { flexBasis: 200, flexShrink: 0, maxWidth: '100%' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', maxWidth: '100%' },
  slot: { alignSelf: 'stretch', minWidth: 0 },
});
