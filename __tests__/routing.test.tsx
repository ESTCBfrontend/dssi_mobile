import { expect, jest, test } from '@jest/globals';
import Home from '../App';
import RootLayout from '../src/app/_layout';
import Detail from '../src/app/services/[id]';
import { appDataSource } from '../src/composition/data-source/appDataSource';
import { act, fireEvent, waitFor } from '@testing-library/react-native';

// Expo Router's matcher type augmentation conflicts with the React Native matchers.
const { renderRouter } = require('expo-router/testing-library');

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

test('abre a rota inicial com as ferramentas de desenvolvimento', async () => {
  const route = await renderRouter({ _layout: RootLayout, index: Home }, { initialUrl: '/' });
  expect(route.getByRole('header', { name: 'Os meus serviços' })).toBeTruthy();
  expect(route.getByRole('button', { name: 'Abrir ferramentas de desenvolvimento' })).toBeTruthy();
  expect(route.getAllByRole('tab')).toHaveLength(4);
  expect(route.getByRole('tab', { name: 'Serviços' }).props.accessibilityState).toMatchObject({ selected: true, disabled: false });
  for (const name of ['Início', 'Agenda', 'Perfil']) {
    expect(route.getByRole('tab', { name }).props.accessibilityState).toMatchObject({ selected: false, disabled: true });
  }
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
