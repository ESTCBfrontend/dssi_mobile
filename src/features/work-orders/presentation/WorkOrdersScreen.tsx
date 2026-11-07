import { useState } from 'react';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWorkOrders } from './hooks/useWorkOrders';
import { formatWorkOrderDate, formatWorkOrderPriority, workOrderStatus } from './workOrderDisplay';
import { Alert } from '../../../shared/ui/Alert';
import { LoadingIndicator } from '../../../shared/ui/LoadingIndicator';
import { NavItem } from '../../../shared/ui/NavItem';
import { ServiceOrderCard } from '../../../shared/ui/ServiceOrderCard';
import { lightTheme, ThemeProvider } from '../../../shared/ui/theme';

type Filter = 'all' | 'today' | 'unscheduled';
const navTheme = { light: { ...lightTheme, navigation: { ...lightTheme.navigation,
  surface: '#20272d', subtle: '#303b48', secondary: '#cad5e0', brandText: '#ffffff', activeIndicator: '#f97316' } } };
const icons = {
  home: require('./assets/home.svg'), services: require('./assets/services.svg'),
  agenda: require('./assets/agenda.svg'), profile: require('./assets/profile.svg'),
};

function civilToday(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function WorkOrdersScreen() {
  const { source, orders, loading, error, reload } = useWorkOrders();
  const [filter, setFilter] = useState<Filter>('all');
  const today = civilToday();
  const todayCount = orders.filter(order => order.scheduledDate === today).length;
  const unscheduledCount = orders.filter(order => order.scheduledDate === null).length;
  const filtered = orders.filter(order => filter === 'all' || (filter === 'today' ? order.scheduledDate === today : order.scheduledDate === null));
  const available = !loading && !error;
  const filters: { id: Filter; label: string; count: number }[] = [
    { id: 'all', label: 'Todos', count: orders.length },
    { id: 'today', label: 'Hoje', count: todayCount },
    { id: 'unscheduled', label: 'Por agendar', count: unscheduledCount },
  ];

  return <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
    <StatusBar style="light" />
    <View style={styles.header}>
      <Image source={require('./assets/header.svg')} style={styles.headerGraphic} accessible={false} />
      <View style={styles.brandRow}>
        <View style={styles.brand}><Image source={require('./assets/brand.svg')} style={styles.logo} accessible={false} />
          <View><Text style={styles.brandName}>AlarmeON</Text><Text style={styles.brandCaption}>FIELD OPERATIONS</Text></View></View>
        <View style={styles.utilities} accessibilityLabel="Notificações e perfil ainda não disponíveis">
          <Image source={require('./assets/bell.svg')} style={styles.bell} accessible={false} /><Text style={styles.avatar}>?</Text>
        </View>
      </View>
      <Text accessibilityRole="header" style={styles.title}>Os meus serviços</Text>
      <Text style={styles.subtitle}>Acompanhe as suas intervenções.</Text>
    </View>
    <View style={styles.body}>
      <View style={styles.summaryRow}>
        <Summary icon={require('./assets/clipboard.svg')} count={available ? String(orders.length) : '—'} label="Serviços" />
        <Summary icon={require('./assets/clock.svg')} count={available ? String(unscheduledCount) : '—'} label="Por agendar" dark />
      </View>
      <View style={styles.heading}><Text accessibilityRole="header" style={styles.headingText}>Serviços</Text>
        {available && <Text style={styles.count}>{orders.length} serviços</Text>}</View>
      {source === 'mock' && <Text style={styles.mockLabel}>Dados fictícios de teste</Text>}
      {available && <View style={styles.filters}>{filters.map(option => <Pressable key={option.id}
        accessibilityRole="button" accessibilityState={{ selected: filter === option.id }}
        onPress={() => setFilter(option.id)} style={[styles.filter, filter === option.id && styles.filterSelected]}>
        <Text style={[styles.filterText, filter === option.id && styles.filterTextSelected]}>{option.label} ({option.count})</Text>
      </Pressable>)}</View>}
      {loading ? <LoadingIndicator type="inline" label="A carregar serviços…" /> : error
        ? <Alert tone="danger" layout="detailed" title="Não foi possível carregar as ordens" message={error}
          action={source === 'mock' ? { label: 'Tentar novamente', onPress: reload } : undefined} />
        : <FlatList data={filtered} keyExtractor={order => order.id} contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>Não há serviços para apresentar.</Text>}
          renderItem={({ item }) => <ServiceOrderCard order={{ id: item.id, reference: item.code, subtitle: item.serviceType,
            clientName: item.client.name, location: item.site.name, scheduledAt: formatWorkOrderDate(item.scheduledDate),
            responsible: item.assignedTechnician?.name }} state={item.status === 'EM_EXECUCAO' ? 'active' : 'planned'} status={workOrderStatus[item.status]}
            extraFields={[{ label: 'Prioridade', value: formatWorkOrderPriority(item.priority) }]}
            labels={{ open: 'Ver serviço', follow: 'Ver serviço' }}
            onOpen={() => router.push({ pathname: '/services/[id]', params: { id: item.id } })} />} />}
    </View>
    <WorkOrdersNavigation />
  </SafeAreaView>;
}

export function WorkOrdersNavigation() {
  return <ThemeProvider themes={navTheme}><View accessibilityRole="tablist" style={styles.navigation}>
      {([{ label: 'Início', icon: icons.home }, { label: 'Serviços', icon: icons.services },
        { label: 'Agenda', icon: icons.agenda }, { label: 'Perfil', icon: icons.profile }] as const).map(item => {
        const selected = item.label === 'Serviços';
        return <NavItem key={item.label} label={item.label} selected={selected} disabled={!selected}
          accessibilityHint={selected ? undefined : 'Ainda não disponível'} onPress={() => {}} style={styles.navItem}
          icon={<Image source={item.icon} style={styles.navIcon} accessible={false} />} />;
      })}
    </View></ThemeProvider>;
}

function Summary({ icon, count, label, dark = false }: { icon: number; count: string; label: string; dark?: boolean }) {
  return <View style={[styles.summary, dark && styles.summaryDark]}><View style={[styles.summaryIcon, dark && styles.summaryIconDark]}>
    <Image source={icon} style={styles.summaryImage} accessible={false} /></View><View>
      <Text style={[styles.summaryCount, dark && styles.white]}>{count}</Text><Text style={[styles.summaryLabel, dark && styles.white]}>{label}</Text>
    </View></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#20272d' }, header: { backgroundColor: '#20272d', paddingHorizontal: 18, paddingTop: 10, paddingBottom: 36, overflow: 'hidden' },
  headerGraphic: { position: 'absolute', right: 0, top: 0, width: 390, height: 191 },
  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 9 }, logo: { width: 36, height: 37 },
  brandName: { color: '#fff', fontSize: 18, fontFamily: 'Inter-SemiBold' }, brandCaption: { color: '#cad5e0', fontSize: 8 },
  utilities: { flexDirection: 'row', alignItems: 'center', gap: 12 }, bell: { width: 24, height: 24 },
  avatar: { backgroundColor: '#e7ecf2', color: '#131b26', width: 38, height: 38, textAlign: 'center', textAlignVertical: 'center', borderRadius: 19, overflow: 'hidden' },
  title: { color: '#fff', fontFamily: 'Inter-SemiBold', fontSize: 25, marginTop: 18 }, subtitle: { color: '#cad5e0', fontSize: 11, marginTop: 5 },
  body: { flex: 1, backgroundColor: '#e8ecf1', paddingHorizontal: 18, gap: 10 }, summaryRow: { flexDirection: 'row', gap: 10, marginTop: -24 },
  summary: { flex: 1, minHeight: 80, backgroundColor: '#fff', borderRadius: 13, padding: 11, flexDirection: 'row', alignItems: 'center', gap: 9 },
  summaryDark: { backgroundColor: '#20272d' }, summaryIcon: { backgroundColor: '#fff0e7', borderRadius: 11, width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  summaryIconDark: { backgroundColor: '#3e4855' }, summaryImage: { width: 24, height: 24 }, summaryCount: { color: '#131b26', fontFamily: 'Inter-SemiBold', fontSize: 24 },
  summaryLabel: { color: '#131b26', fontSize: 11, fontFamily: 'Inter-SemiBold' }, white: { color: '#fff' },
  heading: { backgroundColor: '#20272d', minHeight: 48, borderRadius: 11, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  headingText: { color: '#fff', fontSize: 17, fontFamily: 'Inter-SemiBold', borderLeftColor: '#f97316', borderLeftWidth: 4, paddingLeft: 10 },
  count: { color: '#cad5e0', backgroundColor: '#333d49', padding: 9, borderRadius: 10, fontSize: 11 }, mockLabel: { color: '#526171', fontSize: 11 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, filter: { minHeight: 44, paddingHorizontal: 12, justifyContent: 'center', backgroundColor: '#fff', borderRadius: 12 },
  filterSelected: { backgroundColor: '#f97316' }, filterText: { color: '#131b26', fontFamily: 'Inter-SemiBold', fontSize: 11 }, filterTextSelected: { color: '#fff' },
  list: { gap: 10, paddingBottom: 18 }, empty: { color: '#526171', paddingVertical: 18 },
  navigation: { flexDirection: 'row', backgroundColor: '#20272d', paddingHorizontal: 12, borderTopLeftRadius: 18, borderTopRightRadius: 18 },
  navItem: { flex: 1 }, navIcon: { width: 23, height: 23 },
});
