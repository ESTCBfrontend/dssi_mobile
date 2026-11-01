import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';

export interface AppHeaderProps {
  title: string; subtitle?: string; mark?: ReactNode; leading?: ReactNode; trailing?: ReactNode;
  avatarText?: string; onProfilePress?: () => void; profileLabel?: string; style?: StyleProp<ViewStyle>; testID?: string;
}
export function AppHeader({ title, subtitle, mark, leading, trailing, avatarText, onProfilePress,
  profileLabel = 'Perfil', style, testID }: AppHeaderProps) {
  const { navigation: t } = useTheme();
  if (!title.trim() || (subtitle !== undefined && !subtitle.trim()) ||
      (avatarText !== undefined && !avatarText.trim()) || (onProfilePress && !profileLabel.trim()))
    throw new Error('AppHeader requer título e textos fornecidos não vazios.');
  const slot = (node: ReactNode) => typeof node === 'string' || typeof node === 'number'
    ? <Text allowFontScaling style={{ color: t.primary, fontFamily: t.mediumFont }}>{node}</Text> : node;
  return <View testID={testID} style={[styles.header, { backgroundColor: t.surface, borderColor: t.border, paddingHorizontal: t.headerPadding }, style]}>
    {leading ? <View style={styles.slot}>{slot(leading)}</View> : null}
    {mark ? <View style={styles.slot}>{slot(mark)}</View> : null}
    <View style={styles.heading}>
      <Text accessibilityRole="header" allowFontScaling style={{ color: t.primary, fontFamily: t.semiboldFont, fontSize: 15 }}>{title}</Text>
      {subtitle ? <Text allowFontScaling style={{ color: t.secondary, fontFamily: t.regularFont, fontSize: 11 }}>{subtitle}</Text> : null}
    </View>
    {trailing ? <View style={styles.slot}>{slot(trailing)}</View> : null}
    {avatarText && onProfilePress ? <Pressable accessibilityRole="button" accessibilityLabel={profileLabel} onPress={onProfilePress} style={styles.profileTarget}>
      <View style={[styles.avatar, { backgroundColor: t.subtle }]}><Text allowFontScaling style={{ color: t.brandText, fontFamily: t.semiboldFont, fontSize: 13 }}>{avatarText}</Text></View>
    </Pressable> : avatarText ? <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[styles.avatar, { backgroundColor: t.subtle }]}>
      <Text allowFontScaling style={{ color: t.brandText, fontFamily: t.semiboldFont, fontSize: 13 }}>{avatarText}</Text></View> : null}
  </View>;
}
const styles = StyleSheet.create({
  header: { alignSelf: 'stretch', minHeight: 60, paddingVertical: 8, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  heading: { flex: 1, minWidth: 0, gap: 1 }, slot: { flexShrink: 0 }, profileTarget: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  avatar: { minWidth: 32, minHeight: 32, borderRadius: 16, padding: 5, alignItems: 'center', justifyContent: 'center' },
});
