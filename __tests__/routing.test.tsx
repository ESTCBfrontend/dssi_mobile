import { expect, jest, test } from '@jest/globals';
import Home from '../App';
import RootLayout from '../src/app/_layout';
import Detail from '../src/app/services/[id]';
import { appDataSource } from '../src/composition/data-source/appDataSource';
import { fireEvent, waitFor } from '@testing-library/react-native';

// Expo Router's matcher type augmentation conflicts with the React Native matchers.
const { renderRouter } = require('expo-router/testing-library');

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

test('abre a rota inicial com as ferramentas de desenvolvimento', async () => {
  const route = await renderRouter({ _layout: RootLayout, index: Home }, { initialUrl: '/' });
  expect(route.getByRole('header', { name: 'Os meus serviços' })).toBeTruthy();
  expect(route.getByRole('button', { name: 'Abrir ferramentas de desenvolvimento' })).toBeTruthy();
});

test('abre o detalhe de uma ordem fictícia e regressa à lista', async () => {
  appDataSource.select('mock');
  try {
    const route = await renderRouter({ _layout: RootLayout, index: Home, 'services/[id]': Detail }, { initialUrl: '/' });
    await waitFor(() => expect(route.getByRole('button', { name: 'Ver serviço: OS-EXEMPLO-001' })).toBeTruthy());
    await fireEvent.press(route.getByRole('button', { name: 'Ver serviço: OS-EXEMPLO-001' }));
    await waitFor(() => expect(route.getByRole('header', { name: 'Detalhes do serviço' })).toBeTruthy());
    await fireEvent.press(route.getByRole('button', { name: 'Voltar aos serviços' }));
    await waitFor(() => expect(route.getByRole('header', { name: 'Os meus serviços' })).toBeTruthy());
  } finally {
    appDataSource.select('api');
  }
});
