import { useState } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { Button } from '../Button';
import { useTheme } from '../theme';

export interface PaginationLabels {
  previous: string;
  next: string;
  total: (total: number) => string;
  range: (start: number, end: number, total: number) => string;
  page: (page: number, pageCount: number) => string;
  empty: string;
}
export interface PaginationProps extends Pick<ViewProps, 'testID' | 'nativeID' | 'onLayout'> {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  labels?: Partial<PaginationLabels>;
  style?: StyleProp<ViewStyle>;
}

const defaultLabels: PaginationLabels = {
  previous: 'Anterior', next: 'Seguinte',
  total: total => `${total} ${total === 1 ? 'registo' : 'registos'}`,
  range: (start, end, total) => `${start}–${end} de ${total}`,
  page: (page, count) => `Página ${page} de ${count}`,
  empty: 'Sem páginas',
};

export function Pagination({ page, pageSize, total, onPageChange, disabled = false, labels, style, onLayout, ...nativeProps }: PaginationProps) {
  const { pagination: tokens } = useTheme();
  const [width, setWidth] = useState(0);
  if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(pageSize) || pageSize < 1 ||
    !Number.isSafeInteger(total) || total < 0) throw new Error('Pagination requer página e tamanho positivos e total não negativo, inteiros seguros.');
  const pageCount = Math.ceil(total / pageSize);
  if (page > Math.max(1, pageCount)) throw new Error('Pagination requer uma página dentro do intervalo disponível.');
  const text = { ...defaultLabels, ...labels };
  if (!text.previous.trim() || !text.next.trim() || !text.empty.trim()) throw new Error('Pagination requer etiquetas não vazias.');
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = total === 0 ? 0 : Math.min(page * pageSize, total);
  const narrow = width < tokens.narrowBreakpoint;
  const previous = <Button key="previous" variant="outline" label={text.previous} disabled={disabled || total === 0 || page === 1} onPress={() => onPageChange(page - 1)} />;
  const next = <Button key="next" variant="outline" label={text.next} disabled={disabled || total === 0 || page >= pageCount} onPress={() => onPageChange(page + 1)} />;
  const pageLabel = <Text key="page" allowFontScaling accessibilityLiveRegion="none" style={[styles.page, narrow && styles.pageFull,
    { color: tokens.text, fontFamily: tokens.pageFamily, fontSize: tokens.fontSize }]}>{total === 0 ? text.empty : text.page(page, pageCount)}</Text>;

  return <View {...nativeProps} onLayout={event => { setWidth(event.nativeEvent.layout.width); onLayout?.(event); }}
    style={[styles.container, { backgroundColor: tokens.background, borderColor: tokens.border,
    borderRadius: tokens.radius, padding: tokens.padding, gap: tokens.gap }, style]}>
    <View style={[styles.heading, { gap: tokens.gap }]}>
      <Text allowFontScaling style={[styles.headingText, { color: tokens.secondary, fontFamily: tokens.totalFamily,
        fontSize: tokens.fontSize }]}>{text.total(total)}</Text>
      <Text allowFontScaling style={[styles.headingText, styles.range, { color: tokens.secondary, fontFamily: tokens.rangeFamily,
        fontSize: tokens.fontSize }]}>{text.range(start, end, total)}</Text>
    </View>
    <View style={[styles.navigation, narrow && styles.narrowNavigation, { gap: tokens.navigationGap }]}>
      {narrow ? [pageLabel, previous, next] : [previous, pageLabel, next]}
    </View>
  </View>;
}

const styles = StyleSheet.create({
  container: { alignSelf: 'stretch', maxWidth: '100%', borderWidth: 1 },
  heading: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' },
  headingText: { flexShrink: 1, minWidth: 0 }, range: { textAlign: 'right' },
  navigation: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' },
  narrowNavigation: { justifyContent: 'space-between' },
  page: { flexGrow: 1, flexShrink: 1, flexBasis: 90, minWidth: 0, textAlign: 'center' },
  pageFull: { flexBasis: '100%' },
});
