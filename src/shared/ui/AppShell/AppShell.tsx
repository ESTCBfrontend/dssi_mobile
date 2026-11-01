import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { resolveInsets, type LayoutInsets } from '../Layout/layoutInsets';
import { useTheme } from '../theme';

export interface AppShellProps {
  header?: ReactNode; navigation?: ReactNode; footer?: ReactNode; children: ReactNode;
  safeAreaInsets?: Partial<LayoutInsets>; style?: StyleProp<ViewStyle>; testID?: string;
}
/** Distribui slots; a navegação e o estado das páginas pertencem à composição da aplicação. */
export function AppShell({ header, navigation, footer, children, safeAreaInsets, style, testID }: AppShellProps) {
  const { navigation: t } = useTheme(); const insets = resolveInsets(safeAreaInsets);
  const slot = (node: ReactNode) => typeof node === 'string' || typeof node === 'number'
    ? <Text allowFontScaling style={{ color: t.primary, fontFamily: t.regularFont }}>{node}</Text> : node;
  return <View testID={testID} style={[styles.shell, { backgroundColor: t.page, paddingLeft: insets.left, paddingRight: insets.right }, style]}>
    {header ? <View style={{ paddingTop: insets.top, backgroundColor: t.surface }}>{slot(header)}</View> : null}
    <View testID={testID ? `${testID}-main` : undefined} style={[styles.main, {
      paddingTop: header ? 0 : insets.top, paddingBottom: navigation || footer ? 0 : insets.bottom }]}>{slot(children)}</View>
    {footer ? <View style={{ backgroundColor: t.surface, paddingBottom: navigation ? 0 : insets.bottom }}>{slot(footer)}</View> : null}
    {navigation ? <View accessibilityRole="tablist" testID={testID ? `${testID}-navigation` : undefined}
      style={{ backgroundColor: t.surface, borderTopColor: t.border, borderTopWidth: 1, paddingBottom: insets.bottom }}>{slot(navigation)}</View> : null}
  </View>;
}
const styles = StyleSheet.create({ shell: { flex: 1, minHeight: 0 }, main: { flex: 1, minHeight: 0 } });
