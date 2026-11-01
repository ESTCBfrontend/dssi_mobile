import { useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { resolveInsets, type LayoutInsets } from '../Layout/layoutInsets';
import { useTheme } from '../theme';

export interface PageLayoutProps {
  title: string; description?: string; breadcrumbs?: ReactNode; actions?: ReactNode; children?: ReactNode; footer?: ReactNode;
  layout?: 'stacked' | 'wide'; scrollable?: boolean; safeAreaInsets?: Partial<LayoutInsets>;
  style?: StyleProp<ViewStyle>; testID?: string;
}
export function PageLayout({ title, description, breadcrumbs, actions, children, footer, layout = 'stacked',
  scrollable = true, safeAreaInsets, style, testID }: PageLayoutProps) {
  const { navigation: t } = useTheme(); const [width, setWidth] = useState(0); const insets = resolveInsets(safeAreaInsets);
  if (!title.trim() || (description !== undefined && !description.trim())) throw new Error('PageLayout requer título e descrição fornecida não vazios.');
  const wide = layout === 'wide' && width >= t.wideBreakpoint;
  const padding = wide ? t.widePadding : t.pagePadding;
  const slot = (node: ReactNode) => typeof node === 'string' || typeof node === 'number'
    ? <Text allowFontScaling style={{ color: t.primary, fontFamily: t.regularFont, fontSize: 14 }}>{node}</Text> : node;
  const content = <View testID={testID ? `${testID}-content` : undefined} style={[styles.content, {
    backgroundColor: t.page, paddingTop: padding + insets.top, paddingBottom: padding + insets.bottom,
    paddingLeft: padding + insets.left, paddingRight: padding + insets.right, gap: wide ? 22 : 18,
  }]}>
    {breadcrumbs ? <View>{typeof breadcrumbs === 'string' || typeof breadcrumbs === 'number'
      ? <Text allowFontScaling style={{ color: t.secondary, fontFamily: t.mediumFont, fontSize: 11 }}>{breadcrumbs}</Text> : breadcrumbs}</View> : null}
    <View style={[styles.heading, wide && styles.wideHeading]}>
      <View style={styles.headingText}><Text accessibilityRole="header" allowFontScaling
        style={{ color: t.primary, fontFamily: t.semiboldFont, fontSize: 22, lineHeight: 30 }}>{title}</Text>
        {description ? <Text allowFontScaling style={{ color: t.secondary, fontFamily: t.regularFont, fontSize: 14, lineHeight: 21 }}>{description}</Text> : null}
      </View>
      {actions ? <View style={styles.actions}>{slot(actions)}</View> : null}
    </View>
    {slot(children)}{footer ? <View>{slot(footer)}</View> : null}
  </View>;
  return scrollable ? <ScrollView testID={testID} onLayout={event => setWidth(event.nativeEvent.layout.width)}
    keyboardShouldPersistTaps="handled" style={[styles.scroll, { backgroundColor: t.page }, style]} contentContainerStyle={styles.grow}>{content}</ScrollView>
    : <View testID={testID} onLayout={event => setWidth(event.nativeEvent.layout.width)} style={[styles.container, style]}>{content}</View>;
}
const styles = StyleSheet.create({ scroll: { flex: 1 }, grow: { flexGrow: 1 }, container: { alignSelf: 'stretch', maxWidth: '100%' },
  content: { alignSelf: 'stretch', flexGrow: 1, minWidth: 0 }, heading: { gap: 12 }, wideHeading: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' },
  headingText: { flexGrow: 1, flexShrink: 1, minWidth: 0, gap: 6 }, actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 } });
