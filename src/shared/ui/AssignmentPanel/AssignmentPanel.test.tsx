import { expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ThemeProvider } from '../theme';
import { AssignmentPanel } from './AssignmentPanel';
jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

const teams = [{ id: 'a', name: 'Alfa' }, { id: 'b', name: 'Beta' }];
const users = [{ id: 'u', name: 'Ana', teamIds: ['a'] }];
test('preserva o técnico ao alterar equipa e não submete sem autorização', async () => {
  const change = jest.fn(); const submit = jest.fn();
  await render(<ThemeProvider><AssignmentPanel title="Atribuição" value={{ teamId: 'a', userId: 'u' }}
    onChange={change} teams={teams} users={users} onSubmit={submit} canSubmit={false} /></ThemeProvider>);
  expect(screen.getByRole('button', { name: 'Confirmar atribuição' })).toBeDisabled();
  await fireEvent.press(screen.getByRole('button', { name: 'Equipa' }));
  await fireEvent.press(screen.getByRole('radio', { name: 'Beta' }));
  expect(change).toHaveBeenCalledWith({ teamId: 'b', userId: 'u' });
  expect(submit).not.toHaveBeenCalled();
});
test('submete o valor atual somente quando autorizado e bloqueia durante processamento', async () => {
  const change = jest.fn(); const submit = jest.fn(); const value = { teamId: 'a', userId: 'u' };
  const element = (pending: boolean) => <ThemeProvider><AssignmentPanel title="Atribuição" value={value}
    onChange={change} teams={teams} users={users} onSubmit={submit} canSubmit state="assigned"
    note="Informação" error="Erro do servidor" pending={pending} /></ThemeProvider>;
  const view = await render(element(false));
  expect(screen.getByText('Informação')).toBeTruthy();
  expect(screen.getByText('Erro do servidor')).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Alterar atribuição' }));
  expect(submit).toHaveBeenCalledWith(value);
  await view.rerender(element(true));
  expect(screen.getByRole('button', { name: 'Alterar atribuição' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Equipa' })).toBeDisabled();
});
