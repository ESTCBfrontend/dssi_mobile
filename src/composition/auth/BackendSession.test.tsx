import { afterEach, expect, jest, test } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import { useWorkOrders } from '../../features/work-orders/presentation/hooks/useWorkOrders';
import { MockWorkOrders } from '../../features/work-orders/infrastructure/mock/MockWorkOrders';
import { ThemeProvider } from '../../shared/ui/theme';
import { createConfiguredDataSource } from '../data-source/configuredDataSource';
import { createWorkOrderServices } from '../work-orders/workOrderServices';
import { BackendSession } from './BackendSession';
import { debugOptions, testAccounts } from '../debug/debugOptions';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));
afterEach(() => { jest.restoreAllMocks(); });

test('permite mostrar e ocultar a palavra-passe sem alterar o valor', async () => {
  const selection = createConfiguredDataSource({ development: true, debugLayerEnabled: true });
  await render(<ThemeProvider><QueryClientProvider client={new QueryClient()}>
    <BackendSession selection={selection} services={createWorkOrderServices(null)}><Text>Conteúdo protegido</Text></BackendSession>
  </QueryClientProvider></ThemeProvider>);
  await fireEvent.changeText(screen.getByLabelText('Palavra-passe'), 'valor-teste');
  expect(screen.getByLabelText('Palavra-passe').props.secureTextEntry).toBe(true);
  await fireEvent.press(screen.getByRole('button', { name: 'Mostrar palavra-passe' }));
  expect(screen.getByLabelText('Palavra-passe').props.secureTextEntry).toBe(false);
  expect(screen.getByLabelText('Palavra-passe').props.value).toBe('valor-teste');
  await fireEvent.press(screen.getByRole('button', { name: 'Ocultar palavra-passe' }));
  expect(screen.getByLabelText('Palavra-passe').props.secureTextEntry).toBe(true);
});

test('autentica e termina sessão sem guardar a palavra-passe', async () => {
  jest.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true, status: 200,
    json: async () => ({ accessToken: 'token-teste' }) } as Response);
  const selection = createConfiguredDataSource({ development: true, debugLayerEnabled: true });
  const client = new QueryClient();
  await render(<ThemeProvider><QueryClientProvider client={client}>
    <BackendSession selection={selection} services={createWorkOrderServices(null)}><Text>Conteúdo protegido</Text></BackendSession>
  </QueryClientProvider></ThemeProvider>);
  await fireEvent.changeText(screen.getByLabelText('E-mail profissional'), 'tecnico@example.test');
  await fireEvent.changeText(screen.getByLabelText('Palavra-passe'), 'segredo-teste');
  await fireEvent.press(screen.getByRole('button', { name: 'Entrar na aplicação' }));
  await waitFor(() => expect(screen.getByText('Conteúdo protegido')).toBeTruthy());
  client.setQueryData(['work-orders', 'api', 'teste'], ['dados']);
  expect(screen.queryByRole('button', { name: 'Terminar sessão' })).toBeNull();
  await act(() => { debugOptions.endSession(); });
  expect(screen.getByLabelText('Palavra-passe').props.value).toBe('');
  expect(screen.queryByText('Conteúdo protegido')).toBeNull();
  expect(client.getQueryData(['work-orders', 'api', 'teste'])).toBeUndefined();
});

test('mostra erro para credenciais recusadas', async () => {
  jest.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 401 } as Response);
  const selection = createConfiguredDataSource({ development: true, debugLayerEnabled: true });
  await render(<ThemeProvider><QueryClientProvider client={new QueryClient()}>
    <BackendSession selection={selection} services={createWorkOrderServices(null)}><Text>Conteúdo protegido</Text></BackendSession>
  </QueryClientProvider></ThemeProvider>);
  await fireEvent.changeText(screen.getByLabelText('E-mail profissional'), 'tecnico@example.test');
  await fireEvent.changeText(screen.getByLabelText('Palavra-passe'), 'errada');
  await fireEvent.press(screen.getByRole('button', { name: 'Entrar na aplicação' }));
  await waitFor(() => expect(screen.getByText(/Não foi possível iniciar sessão/)).toBeTruthy());
  expect(screen.queryByText('Conteúdo protegido')).toBeNull();
});

test('uma resposta 401 informa que a sessão expirou e volta ao login', async () => {
  jest.spyOn(globalThis, 'fetch')
    .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ accessToken: 'token-teste' }) } as Response)
    .mockResolvedValue({ ok: false, status: 401 } as Response);
  const selection = createConfiguredDataSource({ development: true, debugLayerEnabled: true });
  function OrdersProbe() { useWorkOrders(); return <Text>Ordens</Text>; }
  await render(<ThemeProvider><QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })}>
    <BackendSession selection={selection} services={createWorkOrderServices(null)}><OrdersProbe /></BackendSession>
  </QueryClientProvider></ThemeProvider>);
  await fireEvent.changeText(screen.getByLabelText('E-mail profissional'), 'tecnico@example.test');
  await fireEvent.changeText(screen.getByLabelText('Palavra-passe'), 'segredo-teste');
  await fireEvent.press(screen.getByRole('button', { name: 'Entrar na aplicação' }));
  await waitFor(() => expect(screen.getByText('A sessão expirou ou deixou de ser válida. Inicia sessão novamente.')).toBeTruthy());
  expect(screen.queryByText('Ordens')).toBeNull();
});

test('terminar sessão impede que um login ainda pendente volte a entrar', async () => {
  let resolveLogin!: (value: Response) => void;
  jest.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise<Response>(resolve => { resolveLogin = resolve; }));
  const selection = createConfiguredDataSource({ development: true, debugLayerEnabled: true });
  await render(<ThemeProvider><QueryClientProvider client={new QueryClient()}>
    <BackendSession selection={selection} services={createWorkOrderServices(null)}><Text>Conteúdo protegido</Text></BackendSession>
  </QueryClientProvider></ThemeProvider>);
  await fireEvent.changeText(screen.getByLabelText('E-mail profissional'), 'tecnico@example.test');
  await fireEvent.changeText(screen.getByLabelText('Palavra-passe'), 'segredo-teste');
  await fireEvent.press(screen.getByRole('button', { name: 'Entrar na aplicação' }));
  await act(() => { debugOptions.endSession(); });
  await act(async () => { resolveLogin({ ok: true, status: 200, json: async () => ({ accessToken: 'token-teste' }) } as Response); });
  expect(screen.queryByText('Conteúdo protegido')).toBeNull();
  expect(screen.getByLabelText('Palavra-passe').props.value).toBe('');
});

test('após login, alterna entre a API e os dados fictícios independentes', async () => {
  const mock = new MockWorkOrders();
  const realExample = { ...mock.listExamples()[0], id: 'api-id', code: 'OS-API' };
  jest.spyOn(globalThis, 'fetch')
    .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ accessToken: 'token-teste' }) } as Response)
    .mockResolvedValue({ ok: true, status: 200, json: async () => ({ items: [realExample], page: 0, totalPages: 1 }) } as Response);
  const selection = createConfiguredDataSource({ development: true, debugLayerEnabled: true });
  function OrdersProbe() {
    const { orders } = useWorkOrders();
    return <Text>{orders.map(order => order.code).join(',')}</Text>;
  }
  await render(<ThemeProvider><QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })}>
    <BackendSession selection={selection} services={createWorkOrderServices(mock)}><OrdersProbe /></BackendSession>
  </QueryClientProvider></ThemeProvider>);
  await fireEvent.changeText(screen.getByLabelText('E-mail profissional'), 'tecnico@example.test');
  await fireEvent.changeText(screen.getByLabelText('Palavra-passe'), 'segredo-teste');
  await fireEvent.press(screen.getByRole('button', { name: 'Entrar na aplicação' }));
  await waitFor(() => expect(screen.getByText('OS-API')).toBeTruthy());
  await act(() => { selection.select('mock'); });
  await waitFor(() => expect(screen.getByText(/OS-EXEMPLO-001/)).toBeTruthy());
  expect(screen.queryByText('OS-API')).toBeNull();
  await act(() => { selection.select('api'); });
  await waitFor(() => expect(screen.getByText('OS-API')).toBeTruthy());
});

test('a seleção de conta inicia sessão com a palavra-passe local', async () => {
  const previous = process.env.EXPO_PUBLIC_TEST_PASSWORD;
  process.env.EXPO_PUBLIC_TEST_PASSWORD = 'segredo-teste';
  const request = jest.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true, status: 200,
    json: async () => ({ accessToken: 'token-teste' }) } as Response);
  try {
    const selection = createConfiguredDataSource({ development: true, debugLayerEnabled: true });
    await render(<ThemeProvider><QueryClientProvider client={new QueryClient()}>
      <BackendSession selection={selection} services={createWorkOrderServices(null)}><Text>Conteúdo protegido</Text></BackendSession>
    </QueryClientProvider></ThemeProvider>);
    await act(() => { debugOptions.selectAccount(testAccounts[0].email); });
    await waitFor(() => expect(screen.getByText('Conteúdo protegido')).toBeTruthy());
    expect(request).toHaveBeenCalledWith(expect.stringContaining('/auth/login'), expect.objectContaining({
      body: JSON.stringify({ email: testAccounts[0].email, password: 'segredo-teste' }),
    }));
  } finally {
    if (previous === undefined) delete process.env.EXPO_PUBLIC_TEST_PASSWORD;
    else process.env.EXPO_PUBLIC_TEST_PASSWORD = previous;
    await act(() => { debugOptions.update({ email: '', selection: 0 }); });
  }
});
