import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ThemeProvider } from '../theme';
import { Select } from './Select';
jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

describe('Select', () => {
  test('filtra opções e emite apenas a opção selecionada', async () => {
    const change = jest.fn();
    await render(<ThemeProvider><Select accessibilityLabel="Equipa" value={null} onChange={change} searchable options={[
      { value: 'a', label: 'Alfa' }, { value: 'b', label: 'Beta', disabled: true }]} /></ThemeProvider>);
    await fireEvent.press(screen.getByRole('button', { name: 'Equipa' }));
    await fireEvent.changeText(screen.getByLabelText('Pesquisar opções'), 'Beta');
    expect(screen.getByRole('radio', { name: 'Beta' })).toBeDisabled();
    await fireEvent.changeText(screen.getByLabelText('Pesquisar opções'), 'Alfa');
    await fireEvent.press(screen.getByRole('radio', { name: 'Alfa' }));
    expect(change).toHaveBeenCalledWith('a');
  });
  test('mostra estados remotos e permite limpar o valor controlado', async () => {
    const change = jest.fn();
    const view = await render(<ThemeProvider><Select accessibilityLabel="Equipa" value="a" onChange={change}
      options={[{ value: 'a', label: 'Alfa' }]} clearable loading /></ThemeProvider>);
    await fireEvent.press(screen.getByRole('button', { name: 'Equipa' }));
    expect(screen.getByText('A carregar opções')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Limpar seleção' }));
    expect(change).toHaveBeenCalledWith(null);
    await view.rerender(<ThemeProvider><Select accessibilityLabel="Equipa" value={null} onChange={change} options={[]} loadError="Falha ao carregar" /></ThemeProvider>);
    await fireEvent.press(screen.getByRole('button', { name: 'Equipa' }));
    expect(screen.getByText('Falha ao carregar')).toBeTruthy();
  });
});
