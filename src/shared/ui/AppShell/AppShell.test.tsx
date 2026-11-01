import { expect, jest, test } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { ThemeProvider } from '../theme';
import { AppShell } from './AppShell';
import { NavItem } from '../NavItem';
jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));
test('compõe cabeçalho, conteúdo e navegação controlada com margens seguras', async () => {
  const press = jest.fn();
  await render(<ThemeProvider><AppShell testID="shell" safeAreaInsets={{ top: 10, bottom: 20, left: 4 }}
    header={<Text>Cabeçalho</Text>}
    navigation={<View><NavItem label="Início" selected onPress={press} /></View>}>
    <Text>Conteúdo</Text></AppShell></ThemeProvider>);
  expect(screen.getByText('Cabeçalho')).toBeTruthy(); expect(screen.getByText('Conteúdo')).toBeTruthy();
  expect(screen.getByRole('tab', { name: 'Início' }).props.accessibilityState.selected).toBe(true);
  expect(screen.getByTestId('shell')).toHaveStyle({ paddingLeft: 4 });
  expect(screen.getByTestId('shell-navigation')).toHaveStyle({ paddingBottom: 20 });
});
test('rejeita margens inválidas', async () => {
  await expect(render(<ThemeProvider><AppShell safeAreaInsets={{ bottom: -1 }}><Text>Conteúdo</Text></AppShell></ThemeProvider>)).rejects.toThrow();
});
