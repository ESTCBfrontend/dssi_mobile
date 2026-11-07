import { useEffect, useRef, useState, useSyncExternalStore, type ComponentRef } from 'react';
import { Image } from 'expo-image';
import { AccessibilityInfo, Platform, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';

import type { DataSourceSelection } from '../data-source/dataSource';
import { Button } from '../../shared/ui/Button';
import { DrawerSheet } from '../../shared/ui/DrawerSheet';
import { ToastSnackbar } from '../../shared/ui/ToastSnackbar';
import { ThemeProvider, useTheme } from '../../shared/ui/theme';
import { mockWorkOrders } from '../work-orders/mockWorkOrders';
import { mockInterventions } from '../work-orders/mockInterventions';
import type { WorkOrderStatus } from '../../features/work-orders/domain/workOrder';

const sourceOptions = [
  { value: 'api', label: 'API' },
  { value: 'mock', label: 'Mock' },
] as const;

const scenarios = [
  { value: 'normal', label: 'Normal' }, { value: 'empty', label: 'Vazio' },
  { value: 'error', label: 'Erro' }, { value: 'slow', label: 'Lento' },
] as const;

const statusLabels: Record<WorkOrderStatus, string> = {
  NOVA: 'Nova', ATRIBUIDA: 'Atribuída', EM_EXECUCAO: 'Em execução',
  CONCLUIDA_TECNICAMENTE: 'Concluída tecnicamente', VALIDADA: 'Validada',
  PENDENTE: 'Pendente', CANCELADA: 'Cancelada',
};

export function DebugLayer({ selection }: { selection: DataSourceSelection }) {
  if (!selection.canSelect) return null;
  return <ThemeProvider><DebugContent selection={selection} /></ThemeProvider>;
}

function DebugContent({ selection }: { selection: DataSourceSelection }) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState<'main' | 'source' | 'technician' | 'mocks' | 'scenario' | 'orderExamples' | 'interventions' | 'interventionExamples'>('main');
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const toastId = useRef(0);
  const showToast = (message: string) => setToast({ id: ++toastId.current, message });
  useEffect(() => {
    if (!toast) return undefined;
    if (Platform.OS === 'ios') AccessibilityInfo.announceForAccessibility(toast.message);
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);
  const { colors } = useTheme();
  const triggerRef = useRef<ComponentRef<typeof Pressable>>(null);
  const source = useSyncExternalStore(selection.subscribe, selection.getSnapshot, selection.getSnapshot);
  const mock = useSyncExternalStore(mockWorkOrders.subscribe, mockWorkOrders.getSnapshot, mockWorkOrders.getSnapshot);
  const titles = { main: 'Ferramentas de desenvolvimento', source: 'Origem de dados', technician: 'Técnico fictício', mocks: 'Mocks de ordens', scenario: 'Cenário de ordens', orderExamples: 'Adicionar ordem', interventions: 'Mocks de intervenções', interventionExamples: 'Adicionar intervenção' };
  const goBack = () => {
    if (page === 'main') setOpen(false);
    else if (page === 'scenario') setPage('mocks');
    else if (page === 'orderExamples') setPage('mocks');
    else if (page === 'interventionExamples') setPage('interventions');
    else setPage('main');
  };

  return <>
    {!open && toast && <View pointerEvents="none" style={[styles.toastOverlay, { top: (StatusBar.currentHeight ?? 0) + 16 }]}>
      <ToastSnackbar toast={{ id: String(toast.id), message: toast.message, dismissible: false }} />
    </View>}
    <View style={styles.trigger}>
      <Pressable ref={triggerRef} accessibilityRole="button" accessibilityLabel="Abrir ferramentas de desenvolvimento"
        accessibilityHint="Abre o menu de diagnóstico" onPress={() => { setPage('main'); setOpen(true); }}
        style={({ pressed }) => [styles.iconButton, { backgroundColor: colors.actionSecondary, opacity: pressed ? 0.8 : 1 }]}>
        <Image source={require('./assets/bug.svg')} style={{ width: 24, height: 24, tintColor: colors.textPrimary }} accessible={false} />
      </Pressable>
    </View>
    <DrawerSheet testID="debug-sheet" open={open} title={titles[page]} closeLabel={page === 'main' ? 'Fechar ferramentas de desenvolvimento' : 'Voltar'}
      returnFocusRef={triggerRef} dismissOnBackdrop onCloseRequest={goBack} safeAreaInsets={{ bottom: 24 }}
      overlay={toast ? <ToastSnackbar toast={{ id: String(toast.id), message: toast.message, dismissible: false }} /> : null}>
      {page === 'main' && <View style={styles.mockControls}>
        <Button label={`Origem de dados: ${source === 'api' ? 'API' : 'Mock'}`} accessibilityHint="Escolhe a origem de dados." variant="secondary" fullWidth onPress={() => setPage('source')} />
        {source === 'mock' && <Button label={`Técnico fictício: ${mock.technicianLabel ?? 'Todas as ordens'}`}
          accessibilityHint="Filtra a consulta por um técnico fictício, sem autenticação." variant="secondary" fullWidth onPress={() => setPage('technician')} />}
        {source === 'mock' && <Button label="Mocks de ordens" accessibilityHint="Gere os cenários e dados fictícios." variant="secondary" fullWidth onPress={() => setPage('mocks')} />}
        {source === 'mock' && <Button label="Mocks de intervenções" accessibilityHint="Gere as intervenções fictícias." variant="secondary" fullWidth onPress={() => setPage('interventions')} />}
      </View>}
      {page === 'source' &&
      <View style={styles.section}>
        <View style={styles.heading}><Text style={{ color: colors.textPrimary, flexShrink: 1 }}>Escolhe a origem.</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Ajuda sobre origem de dados"
            onPress={() => showToast('A seleção é temporária. A API real ainda está indisponível; Mock usa dados fictícios.')} style={styles.help}><Text style={{ color: colors.textBrand }}>ⓘ</Text></Pressable></View>
        <View style={styles.choices}>{sourceOptions.map(option => <Choice key={option.value} label={option.label}
          group="Origem de dados" selected={source === option.value} onPress={() => { selection.select(option.value); showToast(`Origem selecionada: ${option.label}.`); }} />)}</View>
      </View>
      }
      {page === 'technician' && source === 'mock' && <View style={styles.section}>
        <View style={styles.heading}><Text style={{ color: colors.textPrimary, flexShrink: 1 }}>Escolhe o contexto da consulta.</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Ajuda sobre técnico fictício" style={styles.help}
            onPress={() => showToast('Filtra lista e detalhe por atribuição direta ao técnico. Não é uma sessão autenticada; a API não é afetada.')}><Text style={{ color: colors.textBrand }}>ⓘ</Text></Pressable></View>
        <View style={styles.choices}>
          {[{ id: null, name: 'Todas as ordens' }, ...mockWorkOrders.listTechnicians()].map(technician => <Choice
            key={technician.id ?? 'all'} label={technician.name} group="Técnico fictício" selected={mock.technicianId === technician.id}
            onPress={() => {
              mockWorkOrders.selectTechnician(technician.id);
              showToast(technician.id === null ? 'Consulta de todas as ordens fictícias.' : `Consulta das ordens de ${technician.name}.`);
            }} />)}
        </View>
      </View>}
      {page === 'scenario' &&
        <View style={styles.section}>
          <View style={styles.heading}><Text style={{ color: colors.textPrimary, flexShrink: 1 }}>Escolhe um cenário.</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Ajuda sobre cenários"
              onPress={() => showToast('Normal usa exemplos; Vazio não tem ordens; Erro simula falha; Lento simula demora. Mudar de cenário repõe os dados.')} style={styles.help}><Text style={{ color: colors.textBrand }}>ⓘ</Text></Pressable></View>
          <View style={styles.choices}>{scenarios.map(option => <Choice key={option.value} label={option.label}
            group="Cenário de ordens" selected={mock.scenario === option.value} onPress={() => {
            if (mock.scenario !== option.value) {
              mockWorkOrders.selectScenario(option.value);
              showToast('Cenário alterado; dados repostos.');
            } else showToast(`Cenário selecionado: ${option.label}.`);
          }} />)}</View>
        </View>
      }
      {page === 'mocks' && source === 'mock' && <View style={styles.mockControls}>
        <Button label={`Cenário: ${scenarios.find(option => option.value === mock.scenario)?.label}`} accessibilityHint="Escolhe o comportamento simulado das ordens." variant="secondary" fullWidth onPress={() => setPage('scenario')} />
        <Button label="Adicionar ordem" accessibilityHint="Escolhe um exemplo de ordem fictícia." variant="secondary" fullWidth onPress={() => setPage('orderExamples')} />
        <Button label="Adicionar todos os exemplos" accessibilityHint="Acrescenta os exemplos ainda não presentes." variant="secondary" fullWidth onPress={() => {
          const result = mockWorkOrders.addAll();
          showToast(`Adicionadas: ${result.added}. Já existentes: ${result.skipped}.`);
        }} />
        <Button label="Limpar ordens fictícias" accessibilityHint="Remove todas as ordens em memória." variant="secondary" fullWidth onPress={() => {
          mockWorkOrders.clear(); showToast('Ordens fictícias removidas.');
        }} />
        <Button label="Repor cenário" accessibilityHint="Repõe os dados iniciais do cenário selecionado." variant="secondary" fullWidth onPress={() => {
          mockWorkOrders.reset(); showToast('Dados iniciais do cenário repostos.');
        }} />
      </View>}
      {page === 'orderExamples' && source === 'mock' && <View style={styles.mockControls}>
        {mockWorkOrders.listExamples().map(example => <Button key={example.id}
          label={`${statusLabels[example.status]} · ${example.code}`} variant="secondary" fullWidth onPress={() => {
            const result = mockWorkOrders.addExample(example.id);
            showToast(result === 'added' ? 'Ordem adicionada.' : 'Esta ordem já existe.');
          }} />)}
      </View>}
      {page === 'interventions' && source === 'mock' && <View style={styles.mockControls}>
        <Button label="Adicionar intervenção" variant="secondary" fullWidth onPress={() => setPage('interventionExamples')} />
        <Button label="Adicionar todas as intervenções" variant="secondary" fullWidth onPress={() => {
          const result = mockInterventions.addAll();
          showToast(`Adicionadas: ${result.added}. Existentes: ${result.existing}. Sem ordem: ${result.missingOrder}.`);
        }} />
        <Button label="Limpar intervenções fictícias" variant="secondary" fullWidth onPress={() => {
          const count = mockInterventions.clear(); showToast(`Intervenções removidas: ${count}.`);
        }} />
      </View>}
      {page === 'interventionExamples' && source === 'mock' && <View style={styles.mockControls}>
        {mockInterventions.listExamples().map(example => <Button key={example.id}
          label={`${example.status} · ${example.id} · ${example.workOrderId}`} variant="secondary" fullWidth onPress={() => {
            const result = mockInterventions.addExample(example.id);
            showToast(result === 'added' ? 'Intervenção adicionada.' : result === 'existing'
              ? 'Esta intervenção já existe.' : `A ordem fictícia ${example.workOrderId} não está presente.`);
          }} />)}
      </View>}
    </DrawerSheet>
  </>;
}

function Choice({ label, group, selected, onPress }: { label: string; group: string; selected: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  return <Pressable accessibilityRole="radio" accessibilityLabel={`${label}, ${group}`} accessibilityState={{ checked: selected }}
    onPress={onPress} style={[styles.choice, { borderColor: selected ? colors.borderFocus : colors.borderDisabled,
      backgroundColor: selected ? colors.actionPrimary : colors.surface }]}>
    <Text style={{ color: selected ? colors.textOnPrimary : colors.textPrimary, fontWeight: '500' }}>{selected ? '✓ ' : ''}{label}</Text>
  </Pressable>;
}

const styles = StyleSheet.create({
  trigger: { position: 'absolute', bottom: 64, right: 16, zIndex: 10 },
  toastOverlay: { position: 'absolute', left: 16, right: 16, zIndex: 20, elevation: 10 },
  iconButton: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  mockControls: { gap: 12 },
  section: { gap: 4 },
  heading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  help: { minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center' },
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  choice: { minHeight: 44, minWidth: 64, borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center' },
});
