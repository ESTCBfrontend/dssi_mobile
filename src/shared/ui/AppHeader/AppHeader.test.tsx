import { expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ThemeProvider } from '../theme';
import { AppHeader } from './AppHeader';
jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));
test('apresenta título e encaminha a ação de perfil quando fornecida', async () => {
  const profile = jest.fn();
  await render(<ThemeProvider><AppHeader title="Serviços" subtitle="Área técnica" avatarText="AS" onProfilePress={profile} /></ThemeProvider>);
  expect(screen.getByRole('header', { name: 'Serviços' })).toBeTruthy();
  expect(screen.getByText('Área técnica')).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Perfil' }));
  expect(profile).toHaveBeenCalledTimes(1);
});
test('não apresenta ação fictícia e aceita uma marca textual', async () => {
  await render(<ThemeProvider><AppHeader title="Serviços" avatarText="AS" mark="MDS" /></ThemeProvider>);
  expect(screen.queryByRole('button', { name: 'Perfil' })).toBeNull();
  expect(screen.getByText('MDS')).toBeTruthy();
});
