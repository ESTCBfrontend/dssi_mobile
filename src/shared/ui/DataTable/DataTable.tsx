import type { ReactElement, ReactNode } from 'react';
import { FlatList, StyleSheet, Text, View, type ListRenderItem, type StyleProp, type ViewStyle } from 'react-native';
import { Alert } from '../Alert';
import { LoadingIndicator } from '../LoadingIndicator';
import { Pagination, type PaginationProps } from '../Pagination';
import { SortableHeader, type SortableHeaderProps } from '../SortableHeader';
import { TableRow, type TableRowData } from '../TableRow';
import { useTheme } from '../theme';

export interface DataTableLabels {
  count: (total: number) => string; emptyTitle: string; emptyDescription: string; emptyFooter: string;
  loading: string; errorTitle: string; retry: string; open: string; selected: string;
}
export interface DataTableProps {
  title: string; description?: string; rows: readonly TableRowData[]; total?: number;
  onOpen?: (row: TableRowData) => void; renderRow?: (row: TableRowData, index: number) => ReactElement | null;
  filters?: ReactNode; sorting?: SortableHeaderProps; pagination?: PaginationProps;
  isLoading?: boolean; error?: string; onRetry?: () => void;
  labels?: Partial<DataTableLabels>; style?: StyleProp<ViewStyle>; testID?: string;
}
const defaults: DataTableLabels = {
  count: total => `${total} ${total === 1 ? 'registo' : 'registos'}`, emptyTitle: 'Nenhum registo encontrado',
  emptyDescription: 'Experimente alterar a pesquisa ou limpar os filtros.', emptyFooter: 'Sem resultados',
  loading: 'A carregar registos…', errorTitle: 'Não foi possível carregar os registos', retry: 'Repetir', open: 'Abrir', selected: 'Selecionado',
};
export function DataTable({ title, description, rows, total, onOpen, renderRow, filters, sorting, pagination, isLoading = false,
  error, onRetry, labels, style, testID }: DataTableProps) {
  const { dataList: t } = useTheme();
  if (!title.trim() || (error !== undefined && !error.trim())) throw new Error('DataTable requer título e erro válidos.');
  if (total !== undefined && (!Number.isSafeInteger(total) || total < rows.length)) throw new Error('DataTable requer total inteiro não inferior aos registos recebidos.');
  if (pagination && total !== undefined && pagination.total !== total) throw new Error('DataTable requer totais coerentes com a paginação.');
  const count = pagination?.total ?? total ?? rows.length;
  if (!Number.isSafeInteger(count) || count < rows.length) throw new Error('DataTable requer total inteiro não inferior aos registos recebidos.');
  const seen = new Set<string>();
  for (const row of rows) { if (!row.id.trim() || seen.has(row.id)) throw new Error('DataTable requer identificadores únicos e não vazios.'); seen.add(row.id); }
  const text = { ...defaults, emptyDescription: filters ? defaults.emptyDescription : 'Não existem registos para apresentar.', ...labels };
  const renderItem: ListRenderItem<TableRowData> = ({ item, index }) => renderRow ? renderRow(item, index)
    : <TableRow row={item} onOpen={onOpen} actionLabel={text.open} selectedLabel={text.selected} />;
  const showEmpty = !isLoading && !error && rows.length === 0;
  return <FlatList testID={testID} data={rows} keyExtractor={item => item.id} renderItem={renderItem}
    style={[styles.list, { backgroundColor: t.background, borderColor: t.border, borderRadius: t.radius }, style]}
    contentContainerStyle={{ padding: t.padding }} ItemSeparatorComponent={() => <View style={{ height: t.rowGap }} />}
    ListHeaderComponent={<View style={{ gap: t.gap, marginBottom: t.gap }}>
      <View style={styles.heading}><View style={styles.headingText}>
        <Text accessibilityRole="header" allowFontScaling style={{ color: t.primary, fontFamily: t.semiboldFont, fontSize: 17 }}>{title}</Text>
        {description ? <Text allowFontScaling style={{ color: t.secondary, fontFamily: t.regularFont, fontSize: 12 }}>{description}</Text> : null}
      </View>{!(isLoading && rows.length === 0) ? <Text allowFontScaling style={{ color: t.secondary, fontFamily: t.mediumFont, fontSize: 12 }}>{text.count(count)}</Text> : null}</View>
      {filters}{sorting ? <SortableHeader {...sorting} disabled={isLoading || sorting.disabled} /> : null}
      {error ? <Alert tone="danger" layout="detailed" title={text.errorTitle} message={error}
        action={onRetry && !isLoading ? { label: text.retry, onPress: onRetry } : undefined} /> : null}
      {isLoading && rows.length > 0 ? <LoadingIndicator type="inline" size="compact" label={text.loading} /> : null}
    </View>}
    ListEmptyComponent={isLoading ? <LoadingIndicator type="inline" label={text.loading} /> : showEmpty ?
      <View style={[styles.empty, { backgroundColor: t.subtle }]}><Text allowFontScaling style={[styles.center,
        { color: t.primary, fontFamily: t.semiboldFont, fontSize: 14 }]}>{text.emptyTitle}</Text>
        <Text allowFontScaling style={[styles.center, { color: t.secondary, fontFamily: t.regularFont, fontSize: 12 }]}>{text.emptyDescription}</Text></View> : undefined}
    ListFooterComponent={pagination && count > 0 ? <View style={{ marginTop: t.gap }}><Pagination {...pagination} disabled={isLoading || pagination.disabled} /></View>
      : showEmpty ? <Text allowFontScaling style={{ marginTop: t.gap, color: t.secondary, fontFamily: t.regularFont, fontSize: 12 }}>{text.emptyFooter}</Text> : undefined} />;
}
const styles = StyleSheet.create({
  list: { alignSelf: 'stretch', maxWidth: '100%', borderWidth: 1 },
  heading: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12 },
  headingText: { flexGrow: 1, flexShrink: 1, minWidth: 0, gap: 5 },
  empty: { alignItems: 'center', justifyContent: 'center', padding: 22, borderRadius: 12, gap: 9 },
  center: { textAlign: 'center' },
});
