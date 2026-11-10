import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type PropsWithChildren } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApiWorkOrderService } from '../../features/work-orders/infrastructure/api/ApiWorkOrderService';
import { traceApiRequest } from '../../shared/infrastructure/logging/traceApiRequest';
import { Button } from '../../shared/ui/Button';
import { FormField } from '../../shared/ui/FormField';
import { TextField } from '../../shared/ui/TextField';
import type { DataSourceSelection } from '../data-source/dataSource';
import type { WorkOrderServices } from '../work-orders/workOrderServices';
import { WorkOrderSourceProvider } from '../work-orders/WorkOrderSourceProvider';
import { debugOptions } from '../debug/debugOptions';
import { inspectFetch } from '../debug/inspectBackend';

const baseUrl = (process.env.EXPO_PUBLIC_API_URL || 'https://alarmeon-backend-962ded164ecf.herokuapp.com').replace(/\/$/, '');
type Session = { token: string; scope: string };

export function BackendSession({ selection, services, children }: PropsWithChildren<{ selection: DataSourceSelection; services: WorkOrderServices }>) {
  const source = useSyncExternalStore(selection.subscribe, selection.getSnapshot, selection.getSnapshot);
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionNumber = useRef(0);
  const sessionRef = useRef<Session | null>(null);
  const loginVersion = useRef(0);
  const options = useSyncExternalStore(debugOptions.subscribe, debugOptions.getSnapshot, debugOptions.getSnapshot);
  const lastLogout = useRef(options.logout);

  useEffect(() => {
    if (!options.selection) return;
    loginVersion.current += 1;
    sessionRef.current = null;
    setSession(null); setPassword(''); setError(null); setEmail(options.email);
    void queryClient.cancelQueries({ queryKey: ['work-orders', 'api'] });
    queryClient.removeQueries({ queryKey: ['work-orders', 'api'] });
    const testPassword = __DEV__ ? process.env.EXPO_PUBLIC_TEST_PASSWORD : undefined;
    if (testPassword) void authenticate(options.email, testPassword);
    // Executar apenas após seleção explícita da conta de teste.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.selection, options.email, queryClient]);

  const logout = (expected?: Session) => {
    if (expected && sessionRef.current !== expected) return;
    loginVersion.current += 1;
    sessionRef.current = null;
    setSession(null);
    setBusy(false);
    setPassword('');
    void queryClient.cancelQueries({ queryKey: ['work-orders', 'api'] });
    queryClient.removeQueries({ queryKey: ['work-orders', 'api'] });
  };
  useEffect(() => {
    if (lastLogout.current === options.logout) return;
    lastLogout.current = options.logout;
    logout();
    // A alteração da opção representa uma ação explícita no Debug Menu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.logout]);
  const apiService = useMemo(() => session ? new ApiWorkOrderService(baseUrl, session.token, () => logout(session), inspectFetch) : undefined,
    // A instância só muda quando muda a sessão; logout verifica a sessão que fez o pedido.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session]);

  const authenticate = async (loginEmail: string, loginPassword: string) => {
    if (!loginEmail.trim() || !loginPassword) { setError('Introduz o email e a palavra-passe.'); return; }
    setBusy(true); setError(null);
    const version = ++loginVersion.current;
    try {
      const response = await traceApiRequest('POST', () => inspectFetch(`${baseUrl}/api/v1/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: loginEmail.trim(), password: loginPassword }),
      }));
      if (!response.ok) throw new Error('login');
      const body: unknown = await response.json();
      if (version !== loginVersion.current) return;
      if (typeof body !== 'object' || body === null || !('accessToken' in body) || typeof body.accessToken !== 'string' || !body.accessToken) throw new Error('login');
      const next = { token: body.accessToken, scope: `session-${++sessionNumber.current}` };
      sessionRef.current = next; setSession(next); setPassword('');
    } catch { if (version === loginVersion.current) { setPassword(''); setError('Não foi possível iniciar sessão. Confirma as credenciais e a ligação.'); } }
    finally { if (version === loginVersion.current) setBusy(false); }
  };

  const showLogin = source === 'api' && !session;
  return <WorkOrderSourceProvider selection={selection} services={services} apiService={apiService} apiScope={session?.scope}>
    <View style={styles.flex} pointerEvents={showLogin ? 'none' : 'auto'} accessibilityElementsHidden={showLogin} importantForAccessibility={showLogin ? 'no-hide-descendants' : 'auto'}>
      {children}
    </View>
    {showLogin && <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
          <Text accessibilityRole="header" style={styles.title}>Entrar no AlarmeON</Text>
          <Text style={styles.subtitle}>Usa a tua conta para consultar os serviços.</Text>
          <FormField label="Email">{props => <TextField {...props} value={email} onChange={setEmail} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" autoComplete="email" />}</FormField>
          <FormField label="Palavra-passe">{props => <TextField {...props} value={password} onChange={setPassword} secureTextEntry autoCapitalize="none" autoComplete="password" />}</FormField>
          {error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
          <Button label="Entrar" loading={busy} loadingLabel="A entrar…" fullWidth onPress={() => { void authenticate(email, password); }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>}
  </WorkOrderSourceProvider>;
}

const styles = StyleSheet.create({ safe: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: '#f5f7fa' }, flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24, gap: 16 },
  title: { fontSize: 24, color: '#20272d', fontWeight: '600' }, subtitle: { color: '#526171' },
  error: { color: '#b42318' } });
