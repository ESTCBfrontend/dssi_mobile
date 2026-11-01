import { expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ThemeProvider } from '../theme';
import { TeamSelector } from './TeamSelector';
jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

test('pesquisa equipas fornecidas, identifica estado e emite seleção controlada', async () => {
  const change = jest.fn();
  await render(<ThemeProvider><TeamSelector value={null} onChange={change} teams={[
    { id: 'a', name: 'Equipa Alfa', description: 'Climatização', statusLabel: 'Disponível' },
    { id: 'b', name: 'Equipa Beta', statusLabel: 'Indisponível', disabled: true },
  ]} /></ThemeProvider>);
  await fireEvent.press(screen.getByRole('button', { name: 'Equipa' }));
  expect(screen.getByRole('radio', { name: 'Equipa Beta' })).toBeDisabled();
  expect(screen.getByText('Climatização · Disponível')).toBeTruthy();
  await fireEvent.changeText(screen.getByLabelText('Pesquisar equipa'), 'Alfa');
  expect(screen.queryByRole('radio', { name: 'Equipa Beta' })).toBeNull();
  await fireEvent.press(screen.getByRole('radio', { name: 'Equipa Alfa' }));
  expect(change).toHaveBeenCalledWith('a');
});
test('mostra falha de carregamento e permite repetir', async () => {
  const retry = jest.fn();
  await render(<ThemeProvider><TeamSelector teams={[]} value={null} onChange={jest.fn()} loadError="Falha" onRetry={retry} /></ThemeProvider>);
  await fireEvent.press(screen.getByRole('button', { name: 'Equipa' }));
  expect(screen.getByText('Falha')).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Tentar novamente' }));
  expect(retry).toHaveBeenCalledTimes(1);
});
