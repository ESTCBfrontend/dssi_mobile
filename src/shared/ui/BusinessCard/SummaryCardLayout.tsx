import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Button } from '../Button';
import { Card } from '../Card';
import { StatusBadge, type StatusBadgeTone } from '../StatusBadge';
import { useTheme } from '../theme';

export interface SummaryDetail { label: string; value?: string }
export interface SummaryStatus { label: string; tone: StatusBadgeTone }
interface SummaryCardLayoutProps {
  title: string; subtitle?: string; status: SummaryStatus; details: readonly SummaryDetail[];
  actionLabel: string; onOpen?: () => void; actions?: ReactNode;
  style?: StyleProp<ViewStyle>; testID?: string;
}
/** Composição interna comum aos três cartões de resumo do Figma. */
export function SummaryCardLayout({ title, subtitle, status, details, actionLabel, onOpen, actions, style, testID }: SummaryCardLayoutProps) {
  const { card, businessCard: t } = useTheme();
  if (!title.trim() || !status.label.trim() || (onOpen && !actionLabel.trim())) throw new Error('O cartão requer título, estado e ação válidos.');
  const shown = details.filter(detail => detail.value?.trim());
  if (shown.some(detail => !detail.label.trim())) throw new Error('Os detalhes do cartão requerem etiquetas não vazias.');
  const footer = onOpen || actions ? <View style={{ gap: 10 }}>
    {onOpen ? <Button label={actionLabel} accessibilityLabel={`${actionLabel}: ${title}`} variant="outline" fullWidth onPress={onOpen} /> : null}
    {actions}</View> : undefined;
  return <Card testID={testID} title={title} subtitle={subtitle?.trim() || undefined} style={style} footer={footer}
    status={<StatusBadge label={status.label} tone={status.tone} size="small" showDot />}>
    {shown.length ? <View style={{ gap: t.rowGap }}>{shown.map((detail, index) => <View key={`${detail.label}-${index}`}
      accessible accessibilityRole="text" accessibilityLabel={`${detail.label}: ${detail.value}`} style={styles.row}>
      <Text accessible={false} allowFontScaling style={{ width: t.labelWidth, maxWidth: '100%', color: card.subtitleColor,
        fontFamily: card.subtitleFamily, fontSize: t.detailSize }}>{detail.label}</Text>
      <Text accessible={false} allowFontScaling style={{ flexGrow: 1, flexShrink: 1, flexBasis: t.valuePreferredWidth, minWidth: 0, maxWidth: '100%', textAlign: 'right',
        color: card.titleColor, fontFamily: card.titleFamily, fontSize: t.detailSize }}>{detail.value}</Text>
    </View>)}</View> : null}
  </Card>;
}
const styles = StyleSheet.create({ row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', columnGap: 8, rowGap: 3 } });
