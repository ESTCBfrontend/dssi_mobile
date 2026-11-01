import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View, type ListRenderItem, type StyleProp, type ViewStyle } from 'react-native';
import { ActivityItem, type ActivityEvent, validateActivityEvent } from '../ActivityItem';
import { Button } from '../Button';
import { useTheme } from '../theme';

export interface TimelineLabels {
  count: (count: number, hasMore: boolean) => string;
  emptyTitle: string; emptyDescription: string; unloadedTitle: string; loading: string; loadMore: string;
}
export interface TimelineProps {
  events: readonly ActivityEvent[];
  title: string;
  subtitle?: string;
  total?: number;
  hasMore?: boolean;
  isLoading?: boolean;
  onLoadMore?: () => void;
  onOpenRelated?: (event: ActivityEvent) => void;
  labels?: Partial<TimelineLabels>;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const defaultLabels: TimelineLabels = {
  count: (count, hasMore) => count === 0 && !hasMore ? 'Sem eventos' : `${count} ${count === 1 ? 'evento' : 'eventos'}${hasMore ? count === 1 ? ' carregado' : ' carregados' : ''}`,
  emptyTitle: 'Ainda sem atividade registada', emptyDescription: 'Os movimentos serão apresentados aqui.',
  unloadedTitle: 'Ainda sem atividades carregadas', loading: 'A carregar atividades…', loadMore: 'Ver mais atividades',
};

export function Timeline({ events, title, subtitle, total, hasMore = false, isLoading = false, onLoadMore,
  onOpenRelated, labels, style, testID }: TimelineProps) {
  const { timeline: tokens } = useTheme();
  if (!title.trim() || (subtitle !== undefined && !subtitle.trim())) throw new Error('Timeline requer título e subtítulo válidos.');
  if (total !== undefined && (!Number.isSafeInteger(total) || total < events.length)) throw new Error('Timeline requer um total inteiro não inferior aos eventos apresentados.');
  const seen = new Set<string>();
  for (const event of events) { validateActivityEvent(event); if (seen.has(event.id)) throw new Error('Timeline requer identificadores únicos.'); seen.add(event.id); }
  const ordered = events.map((event, index) => ({ event, index })).sort((a, b) => b.event.timestamp - a.event.timestamp || a.index - b.index).map(item => item.event);
  const text = { ...defaultLabels, ...labels };
  if (!text.emptyTitle.trim() || !text.emptyDescription.trim() || !text.unloadedTitle.trim() || !text.loading.trim() || !text.loadMore.trim()) throw new Error('Timeline requer etiquetas não vazias.');
  const renderItem: ListRenderItem<ActivityEvent> = ({ item }) => <ActivityItem event={item} onOpenRelated={onOpenRelated} />;
  const count = total ?? events.length;

  return <FlatList testID={testID} data={ordered} renderItem={renderItem} keyExtractor={item => item.id}
    style={[styles.list, { backgroundColor: tokens.background, borderColor: tokens.border, borderRadius: tokens.radius }, style]}
    contentContainerStyle={{ padding: tokens.padding }}
    ItemSeparatorComponent={() => <View style={{ height: tokens.itemGap }} />}
    ListHeaderComponent={<View style={[styles.header, { gap: tokens.headerGap, marginBottom: tokens.sectionGap }]}>
      <View style={[styles.heading, { gap: tokens.headingGap }]}>
        <Text accessibilityRole="header" allowFontScaling style={{ color: tokens.titleColor, fontFamily: tokens.titleFamily, fontSize: tokens.titleSize }}>{title}</Text>
        {subtitle ? <Text allowFontScaling style={{ color: tokens.secondary, fontFamily: tokens.bodyFamily, fontSize: tokens.bodySize }}>{subtitle}</Text> : null}
      </View>
      {!(isLoading && events.length === 0) ? <Text allowFontScaling style={{ color: tokens.accent, fontFamily: tokens.titleFamily,
        fontSize: tokens.bodySize }}>{text.count(count, total === undefined && hasMore)}</Text> : null}
    </View>}
    ListEmptyComponent={isLoading ? <View accessible style={styles.empty} accessibilityRole="progressbar" accessibilityLabel={text.loading} accessibilityState={{ busy: true }}>
      <ActivityIndicator color={tokens.accent} accessible={false} />
      <Text allowFontScaling style={{ color: tokens.secondary, fontFamily: tokens.bodyFamily, fontSize: tokens.bodySize }}>{text.loading}</Text>
    </View> : <View style={[styles.empty, { backgroundColor: tokens.emptyBackground, borderRadius: tokens.emptyRadius, padding: tokens.emptyPadding, gap: tokens.emptyGap }]}>
      <Image source={require('./assets/empty.png')} accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
        resizeMode="contain" fadeDuration={0} style={{ width: tokens.emptySymbolWidth, height: tokens.emptySymbolHeight, tintColor: tokens.accent }} />
      <Text allowFontScaling style={[styles.center, { color: tokens.titleColor, fontFamily: tokens.titleFamily, fontSize: tokens.emptyTitleSize }]}>{hasMore || (total ?? 0) > 0 ? text.unloadedTitle : text.emptyTitle}</Text>
      <Text allowFontScaling style={[styles.center, { color: tokens.secondary, fontFamily: tokens.bodyFamily, fontSize: tokens.bodySize }]}>{text.emptyDescription}</Text>
    </View>}
    ListFooterComponent={hasMore && onLoadMore && (!isLoading || events.length > 0) ? <View style={{ marginTop: tokens.sectionGap }}>
      <Button label={text.loadMore} loading={isLoading} loadingLabel={text.loading} variant="outline" fullWidth onPress={onLoadMore} />
    </View> : undefined}
  />;
}

const styles = StyleSheet.create({
  list: { alignSelf: 'stretch', maxWidth: '100%', borderWidth: 1 },
  header: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' },
  heading: { flexGrow: 1, flexShrink: 1, minWidth: 0 },
  empty: { alignItems: 'center', justifyContent: 'center' }, center: { textAlign: 'center' },
});
