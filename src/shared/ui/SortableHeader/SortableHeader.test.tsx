import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { SortableHeader } from './SortableHeader';
import { ThemeProvider } from '../theme';
jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));
describe('SortableHeader', () => {
  test('apresenta a direção controlada e pede a próxima, incluindo limpar', async () => {
    const sort = jest.fn(); const view = await render(<ThemeProvider><SortableHeader label="Data" direction="none" onSort={sort} /></ThemeProvider>);
    let button = screen.getByRole('button', { name: 'Ordenar por Data' });
    expect(button.props.accessibilityValue.text).toBe('Sem ordenação'); await fireEvent.press(button); expect(sort).toHaveBeenLastCalledWith('ascending');
    await view.rerender(<ThemeProvider><SortableHeader label="Data" direction="ascending" onSort={sort} /></ThemeProvider>);
    button = screen.getByRole('button', { name: 'Ordenar por Data' }); expect(button.props.accessibilityValue.text).toBe('Ordem ascendente');
    await fireEvent.press(button); expect(sort).toHaveBeenLastCalledWith('descending');
    await view.rerender(<ThemeProvider><SortableHeader label="Data" direction="descending" onSort={sort} /></ThemeProvider>);
    await fireEvent.press(screen.getByRole('button', { name: 'Ordenar por Data' })); expect(sort).toHaveBeenLastCalledWith('none');
  });
  test('desativa a interação e permite localizar as indicações acessíveis', async () => {
    const sort = jest.fn();
    const view = await render(<ThemeProvider><SortableHeader label="Date" direction="none" onSort={sort} disabled
      labels={{ name: value => `Sort by ${value}`, none: 'Not sorted' }} /></ThemeProvider>);
    const button = screen.getByRole('button', { name: 'Sort by Date' }); expect(button).toBeDisabled();
    expect(button.props.accessibilityValue.text).toBe('Not sorted'); await fireEvent.press(button); expect(sort).not.toHaveBeenCalled();
    await view.rerender(<ThemeProvider><SortableHeader label="Data" direction="ascending" onSort={sort} disabled /></ThemeProvider>);
    expect(screen.getByRole('button', { name: 'Ordenar por Data' }).props.accessibilityValue.text).toBe('Ordem ascendente');
    expect(screen.getByText('Data')).toHaveStyle({ color: '#667385' });
  });
});
