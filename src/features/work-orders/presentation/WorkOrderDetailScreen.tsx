import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWorkOrder } from './hooks/useWorkOrders';
import { Alert } from '../../../shared/ui/Alert';
import { ContentPanel } from '../../../shared/ui/ContentPanel';
import { LoadingIndicator } from '../../../shared/ui/LoadingIndicator';
import { StatusBadge } from '../../../shared/ui/StatusBadge';
import { formatWorkOrderDate, formatWorkOrderPriority, workOrderStatus } from './workOrderDisplay';

type Props = { id: string; onBack: () => void };

export function WorkOrderDetailScreen({ id, onBack }: Props) {
  const { source, mockContextLabel, order, loading, error, reload } = useWorkOrder(id);
  return <SafeAreaView edges={['top']} style={styles.safe}>
    <StatusBar style="light" />
    <View style={styles.header}>
      <Image source={require('./assets/header.svg')} style={styles.graphic} accessible={false} />
      <View style={styles.brandRow}><View style={styles.brand}>
        <Image source={require('./assets/brand.svg')} style={styles.logo} accessible={false} />
        <View><Text style={styles.brandName}>AlarmeON</Text><Text style={styles.caption}>FIELD OPERATIONS</Text></View>
      </View><View style={styles.utilities} accessibilityLabel="Notificações e perfil ainda não disponíveis">
        <Image source={require('./assets/bell.svg')} style={styles.bell} accessible={false} /><Text style={styles.avatar}>?</Text>
      </View></View>
      <View style={styles.titleRow}><Pressable accessibilityRole="button" accessibilityLabel="Voltar aos serviços"
        onPress={onBack} style={styles.back}><Image source={require('./assets/arrow-left.svg')} style={styles.arrow} accessible={false} /></Pressable>
        <Text accessibilityRole="header" style={styles.title}>Detalhes do serviço</Text></View>
      {order && <Text style={styles.subtitle}>{order.code} · {order.client.name}</Text>}
    </View>
    <ScrollView style={styles.body} contentContainerStyle={styles.content}>
      {mockContextLabel && <Text style={styles.mock}>{mockContextLabel}</Text>}
      {loading ? <LoadingIndicator type="inline" label="A carregar serviço…" /> : error
        ? <Alert tone="danger" layout="detailed" title="Não foi possível carregar o serviço" message={error}
          action={source === 'mock' ? { label: 'Tentar novamente', onPress: reload } : undefined} />
        : !order ? <Alert tone="warning" layout="detailed" title="Serviço não encontrado" message="Esta ordem não está disponível na origem selecionada." />
          : <>
            {source === 'mock' && <Text style={styles.mock}>Dados fictícios de teste</Text>}
            <View style={styles.summary}><View style={styles.summaryTop}>
              <Text style={styles.label}>ORDEM DE SERVIÇO</Text><StatusBadge size="small" {...workOrderStatus[order.status]} />
            </View><Text style={styles.service}>{order.serviceType}</Text>
              <View style={styles.place}><Image source={require('./assets/pin.svg')} style={styles.pin} accessible={false} />
                <Text style={styles.secondary}>{order.site.name}</Text></View>
            </View>
            <ContentPanel><PanelTitle title="Informação do serviço" subtitle="Cliente e local" />
              <View style={styles.fields}><Field label="Cliente" value={order.client.name} /><Field label="Local" value={order.site.name} />
                {order.site.address && <Field label="Morada da intervenção" value={order.site.address} />}
                <Field label="Descrição" value={order.description} />
                <Field label="Prioridade" value={formatWorkOrderPriority(order.priority)} />
                {order.instructions && <Field label="Instruções" value={order.instructions} />}</View>
            </ContentPanel>
            <ContentPanel><PanelTitle title="Planeamento e equipa" subtitle="Quando e com quem intervir" />
              <View style={styles.fields}><Field label="Data prevista" value={formatWorkOrderDate(order.scheduledDate)} />
                <Field label="Técnico responsável" value={order.assignedTechnician?.name ?? 'Não atribuído'} /></View>
            </ContentPanel>
          </>}
    </ScrollView>
  </SafeAreaView>;
}

function PanelTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return <View style={styles.panelHeader}><View style={styles.accent} /><View style={styles.panelText}>
    <Text accessibilityRole="header" style={styles.panelTitle}>{title}</Text><Text style={styles.caption}>{subtitle}</Text>
  </View></View>;
}
function Field({ label, value }: { label: string; value: string }) {
  return <View style={styles.field}><Text style={styles.label}>{label.toUpperCase()}</Text><Text style={styles.value}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#20272d' }, header: { backgroundColor: '#20272d', paddingHorizontal: 18, paddingTop: 10, paddingBottom: 18, overflow: 'hidden' },
  graphic: { position: 'absolute', right: 0, top: 0, width: 390, height: 191 }, brandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 44 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 9 }, logo: { width: 36, height: 37 }, brandName: { color: '#fff', fontSize: 18, fontFamily: 'Inter-SemiBold' }, caption: { color: '#cad5e0', fontSize: 10 },
  utilities: { flexDirection: 'row', alignItems: 'center', gap: 12 }, bell: { width: 24, height: 24 }, avatar: { backgroundColor: '#e7ecf2', color: '#131b26', width: 38, height: 38, textAlign: 'center', textAlignVertical: 'center', borderRadius: 19, overflow: 'hidden' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 18 }, back: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: '#34404b', borderRadius: 9 }, arrow: { width: 22, height: 22 },
  title: { color: '#fff', fontFamily: 'Inter-SemiBold', fontSize: 23, flexShrink: 1 }, subtitle: { color: '#cad5e0', fontSize: 11, marginTop: 5 },
  body: { flex: 1, backgroundColor: '#e8ecf1' }, content: { padding: 18, gap: 12 }, mock: { color: '#526171', fontSize: 11 },
  summary: { backgroundColor: '#fff', borderColor: '#e6e9ee', borderWidth: 1, borderRadius: 14, padding: 15, gap: 8 }, summaryTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  label: { color: '#677381', fontSize: 10, fontFamily: 'Inter-SemiBold' }, service: { color: '#131b26', fontSize: 17, fontFamily: 'Inter-SemiBold' }, place: { flexDirection: 'row', alignItems: 'center', gap: 7 }, pin: { width: 17, height: 17 }, secondary: { color: '#677381', fontSize: 11, flexShrink: 1 },
  panelHeader: { backgroundColor: '#20272d', borderRadius: 10, padding: 12, flexDirection: 'row', gap: 10, alignItems: 'center' }, accent: { width: 4, minHeight: 31, backgroundColor: '#194a9d', borderRadius: 2 }, panelText: { flex: 1, gap: 3 }, panelTitle: { color: '#fff', fontSize: 14, fontFamily: 'Inter-SemiBold' }, fields: { gap: 14, paddingTop: 14 }, field: { gap: 5 }, value: { color: '#131b26', fontSize: 12, fontFamily: 'Inter-SemiBold' },
});
