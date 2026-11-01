import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';

export type CardDensity = 'compact' | 'comfortable';
export type CardVariant = 'outlined' | 'elevated';
export interface CardProps extends Pick<ViewProps, 'testID' | 'nativeID' | 'onLayout'> {
  title?: string;
  subtitle?: string;
  status?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  density?: CardDensity;
  variant?: CardVariant;
  style?: StyleProp<ViewStyle>;
}

export function Card({ title, subtitle, status, children, actions, footer, density = 'compact', variant = 'outlined',
  style, ...nativeProps }: CardProps) {
  const { card: tokens } = useTheme();
  const metrics = tokens.densities[density];
  if (title !== undefined && !title.trim()) throw new Error('Card requer um título não vazio quando fornecido.');
  if (subtitle !== undefined && !subtitle.trim()) throw new Error('Card requer um subtítulo não vazio quando fornecido.');
  const hasHeader = Boolean(title || subtitle || status);
  const hasFooter = Boolean(actions || footer);

  return <View {...nativeProps} style={[styles.container, { backgroundColor: tokens.background, borderRadius: tokens.radius,
    padding: metrics.padding, gap: metrics.gap, borderWidth: variant === 'outlined' ? 1 : 0,
    borderColor: tokens.border, boxShadow: variant === 'elevated' ? tokens.shadow : undefined }, style]}>
    {hasHeader ? <View style={[styles.header, { gap: tokens.headerGap }]}>
      {title || subtitle ? <View style={[styles.heading, { gap: tokens.headingGap }]}>
        {title ? <Text accessibilityRole="header" allowFontScaling style={{ color: tokens.titleColor,
          fontFamily: tokens.titleFamily, fontSize: metrics.titleSize, lineHeight: metrics.titleLineHeight }}>{title}</Text> : null}
        {subtitle ? <Text allowFontScaling style={{ color: tokens.subtitleColor, fontFamily: tokens.subtitleFamily,
          fontSize: tokens.subtitleSize, lineHeight: tokens.subtitleLineHeight }}>{subtitle}</Text> : null}
      </View> : null}
      {status ? <View style={styles.status}>{status}</View> : null}
    </View> : null}
    {children != null ? <View style={styles.slot}>{children}</View> : null}
    {hasFooter ? <View style={[styles.slot, { gap: tokens.footerGap }]}>
      <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
        style={{ height: 1, backgroundColor: tokens.border }} />
      {footer}
      {actions ? <View style={[styles.actions, { gap: tokens.actionsGap }]}>{actions}</View> : null}
    </View> : null}
  </View>;
}

const styles = StyleSheet.create({
  container: { alignSelf: 'stretch', maxWidth: '100%' },
  header: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', width: '100%' },
  heading: { flexGrow: 1, flexShrink: 1, flexBasis: 120, minWidth: 0 },
  status: { maxWidth: '100%', flexShrink: 1 },
  slot: { alignSelf: 'stretch', minWidth: 0 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' },
});
