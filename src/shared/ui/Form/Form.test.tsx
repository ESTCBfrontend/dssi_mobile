import { expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { TextInput } from 'react-native';
import { ThemeProvider } from '../theme';
import { Form } from './Form';
jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));
test('submete e bloqueia ações durante o processamento sem desmontar campos', async () => {
  const submit = jest.fn(); const reset = jest.fn();
  const element = (pending: boolean) => <ThemeProvider><Form title="Pedido" submitLabel="Guardar" onSubmit={submit}
    onReset={reset} pending={pending} error="Erro do servidor"><TextInput accessibilityLabel="Nome" defaultValue="Ana" /></Form></ThemeProvider>;
  const view = await render(element(false));
  await fireEvent.press(screen.getByRole('button', { name: 'Guardar' })); expect(submit).toHaveBeenCalledTimes(1);
  await view.rerender(element(true));
  expect(screen.getByRole('button', { name: 'Guardar' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Limpar' })).toBeDisabled();
  expect(screen.getByLabelText('Nome').props.defaultValue).toBe('Ana');
  expect(screen.getByText('Erro do servidor')).toBeTruthy();
});
