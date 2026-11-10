import { expect, jest, test } from '@jest/globals';
import Home from '../App';
import RootLayout from '../src/app/_layout';
import Detail from '../src/app/services/[id]';
import { appDataSource } from '../src/composition/data-source/appDataSource';
import { mockWorkOrders } from '../src/composition/work-orders/mockWorkOrders';
import { act, fireEvent, waitFor } from '@testing-library/react-native';

// Expo Router's matcher type augmentation conflicts with the React Native matchers.
const { renderRouter } = require('expo-router/testing-library');

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

test('abre a rota inicial com as ferramentas de desenvolvimento', async () => {
  const route = await renderRouter({ _layout: RootLayout, index: Home }, { initialUrl: '/' });
  expect(route.getByRole('header', { name: 'Entrar no AlarmeON' })).toBeTruthy();
  expect(route.getByRole('button', { name: 'Abrir ferramentas de desenvolvimento' })).toBeTruthy();
  expect(route.queryByRole('tab', { name: 'Serviços' })).toBeNull();
});

test('abre o detalhe de uma ordem fictícia e regressa à lista', async () => {
  appDataSource.select('mock');
  try {
    const route = await renderRouter({ _layout: RootLayout, index: Home, 'services/[id]': Detail }, { initialUrl: '/' });
    await waitFor(() => expect(route.getByRole('button', { name: 'Ver serviço: OS-EXEMPLO-001' })).toBeTruthy());
    await fireEvent.press(route.getByRole('button', { name: 'Ver serviço: OS-EXEMPLO-001' }));
    await waitFor(() => expect(route.getByRole('header', { name: 'Detalhes do serviço' })).toBeTruthy());
    expect(route.getAllByRole('tab')).toHaveLength(4);
    await fireEvent.press(route.getByRole('button', { name: 'Voltar aos serviços' }));
    await waitFor(() => expect(route.getByRole('header', { name: 'Os meus serviços' })).toBeTruthy());
    expect(route.getAllByRole('tab')).toHaveLength(4);
  } finally {
    await act(() => { appDataSource.select('api'); });
  }
});

test('abre uma ligação direta para OS inexistente e regressa à lista sem histórico', async () => {
  appDataSource.select('mock');
  try {
    const route = await renderRouter({ _layout: RootLayout, index: Home, 'services/[id]': Detail },
      { initialUrl: '/services/ordem-inexistente' });
    await waitFor(() => expect(route.getByText('Serviço não encontrado')).toBeTruthy());
    expect(route.getAllByRole('tab')).toHaveLength(4);
    await fireEvent.press(route.getByRole('button', { name: 'Voltar aos serviços' }));
    await waitFor(() => expect(route.getByRole('header', { name: 'Os meus serviços' })).toBeTruthy());
    expect(route.getAllByRole('tab')).toHaveLength(4);
  } finally {
    await act(() => { appDataSource.select('api'); });
  }
});

test('escolhe o técnico no menu e atualiza lista e detalhe na aplicação', async () => {
  mockWorkOrders.selectScenario('normal');
  mockWorkOrders.selectTechnician(null);
  appDataSource.select('mock');
  try {
    const route = await renderRouter({ _layout: RootLayout, index: Home, 'services/[id]': Detail }, { initialUrl: '/' });
    const chooseTechnician = async (current: string, name: string) => {
      await fireEvent.press(route.getByRole('button', { name: 'Abrir ferramentas de desenvolvimento' }));
      await fireEvent.press(route.getByRole('button', { name: `Técnico fictício: ${current}` }));
      await fireEvent.press(route.getByRole('radio', { name: `${name}, Técnico fictício` }));
      await fireEvent.press(route.getByRole('button', { name: 'Voltar' }));
      await fireEvent.press(route.getByRole('button', { name: 'Fechar ferramentas de desenvolvimento' }));
    };
    await chooseTechnician('Todas as ordens', 'João Almeida');
    await waitFor(() => expect(route.getByRole('button', { name: 'Todos (2)' })).toBeTruthy());
    expect(route.queryByText('OS-EXEMPLO-001')).toBeNull();
    await fireEvent.press(route.getByRole('button', { name: 'Ver serviço: OS-EXEMPLO-002' }));
    await waitFor(() => expect(route.getByRole('header', { name: 'Detalhes do serviço' })).toBeTruthy());
    expect(route.getByText('Técnico fictício: João Almeida')).toBeTruthy();
    await chooseTechnician('João Almeida', 'Mariana Ferreira');
    await waitFor(() => expect(route.getByText('Serviço não encontrado')).toBeTruthy());
    expect(route.getByText('Técnico fictício: Mariana Ferreira')).toBeTruthy();
    await fireEvent.press(route.getByRole('button', { name: 'Voltar aos serviços' }));
    await waitFor(() => expect(route.getByText('OS-EXEMPLO-004')).toBeTruthy());
    expect(route.getByText('OS-EXEMPLO-006')).toBeTruthy();
    expect(route.queryByText('OS-EXEMPLO-002')).toBeNull();
  } finally {
    await act(() => { mockWorkOrders.selectTechnician(null); appDataSource.select('api'); });
  }
}, 15000);
