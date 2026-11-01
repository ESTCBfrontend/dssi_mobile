import { expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ThemeProvider } from '../theme';
import { FilterBar } from './FilterBar';
jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));
test('encaminha pesquisa, seleção e limpeza sem gerir os filtros', async () => {
  const search = jest.fn(); const change = jest.fn(); const reset = jest.fn();
  await render(<ThemeProvider><FilterBar title="Filtros" search={{ label: 'Pesquisar', value: '', onChange: search }}
    filters={[{ id: 'estado', label: 'Estado', value: null, onChange: change, options: [{ value: 'aberta', label: 'Aberta' }] }]} onReset={reset} /></ThemeProvider>);
  await fireEvent.changeText(screen.getByLabelText('Pesquisar'), 'cliente'); expect(search).toHaveBeenCalledWith('cliente');
  await fireEvent.press(screen.getByRole('button', { name: 'Estado' }));
  await fireEvent.press(screen.getByRole('radio', { name: 'Aberta' })); expect(change).toHaveBeenCalledWith('aberta');
  await fireEvent.press(screen.getByRole('button', { name: 'Limpar' })); expect(reset).toHaveBeenCalledTimes(1);
});
