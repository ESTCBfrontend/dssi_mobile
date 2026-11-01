import { expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ThemeProvider } from '../theme';
import { NavItem } from './NavItem';
jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));
test('expõe seleção e destino acessíveis sem gerir a rota', async () => {
  const press = jest.fn();
  const view = await render(<ThemeProvider><NavItem label="Ordens" selected onPress={press} badge="3" /></ThemeProvider>);
  const item = screen.getByRole('tab', { name: 'Ordens, 3' });
  expect(item.props.accessibilityState.selected).toBe(true);
  await fireEvent.press(item); expect(press).toHaveBeenCalledTimes(1);
  await view.rerender(<ThemeProvider><NavItem label="Ordens" selected={false} onPress={press} disabled /></ThemeProvider>);
  const disabled = screen.getByRole('tab', { name: 'Ordens' });
  expect(disabled).toBeDisabled(); await fireEvent.press(disabled); expect(press).toHaveBeenCalledTimes(1);
});
