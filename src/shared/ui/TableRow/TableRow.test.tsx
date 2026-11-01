import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { TableRow, type TableRowData } from './TableRow';
import { ThemeProvider, lightTheme } from '../theme';
jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));
const row: TableRowData = { id: '1', reference: 'OS-1', title: 'Clínica', detail: '12 nov.', status: { label: 'Em execução', tone: 'info' } };
describe('TableRow', () => {
  test('apresenta dados, seleção acessível e encaminha o registo à ação', async () => {
    const open = jest.fn(); const selected = { ...row, selected: true };
    await render(<ThemeProvider><TableRow row={selected} onOpen={open} /></ThemeProvider>);
    expect(screen.getByLabelText('OS-1, Selecionado')).toBeTruthy(); expect(screen.getByText('Em execução')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Abrir: OS-1' })); expect(open).toHaveBeenCalledWith(selected);
  });
  test('não inventa campos ou ações e respeita o tema', async () => {
    const theme = { ...lightTheme, dataList: { ...lightTheme.dataList, background: '#abcdef' } };
    await render(<ThemeProvider themes={{ light: theme }}><TableRow testID="row" row={{ id: '2', reference: 'R', title: 'Nome' }} /></ThemeProvider>);
    expect(screen.getByTestId('row')).toHaveStyle({ backgroundColor: '#abcdef' }); expect(screen.queryByRole('button')).toBeNull();
  });
});
