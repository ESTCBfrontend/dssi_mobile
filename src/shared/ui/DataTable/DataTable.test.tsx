import { useState } from 'react';
import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { DataTable } from './DataTable';
import type { SortDirection } from '../SortableHeader';
import type { TableRowData } from '../TableRow';
import { ThemeProvider } from '../theme';
jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));
const rows: TableRowData[] = [{ id: 'b', reference: 'B', title: 'Beta' }, { id: 'a', reference: 'A', title: 'Alfa' }];
function ControlledExample() {
  const [direction, setDirection] = useState<SortDirection>('none');
  const shown = direction === 'ascending' ? [...rows].sort((a, b) => a.reference.localeCompare(b.reference)) : rows;
  return <ThemeProvider><DataTable title="Registos" rows={shown} sorting={{ label: 'Referência', direction, onSort: setDirection }} /></ThemeProvider>;
}
describe('DataTable', () => {
  test('apresenta a ordenação realmente fornecida pela composição', async () => {
    await render(<ControlledExample />);
    expect(screen.getAllByText(/^[AB]$/).map(node => node.props.children)).toEqual(['B', 'A']);
    await fireEvent.press(screen.getByRole('button', { name: 'Ordenar por Referência' }));
    expect(screen.getAllByText(/^[AB]$/).map(node => node.props.children)).toEqual(['A', 'B']);
    expect(rows.map(row => row.reference)).toEqual(['B', 'A']);
  });
  test('encaminha ação e paginação e preserva filtros fornecidos', async () => {
    const open = jest.fn(); const page = jest.fn();
    await render(<ThemeProvider><DataTable title="Registos" rows={rows} onOpen={open} filters={<Text>Filtro ativo</Text>}
      pagination={{ page: 1, pageSize: 2, total: 4, onPageChange: page }} /></ThemeProvider>);
    expect(screen.getByText('Filtro ativo')).toBeTruthy(); expect(screen.getAllByText('4 registos').length).toBeGreaterThan(0);
    await fireEvent.press(screen.getByRole('button', { name: 'Abrir: B' })); expect(open).toHaveBeenCalledWith(rows[0]);
    await fireEvent.press(screen.getByRole('button', { name: 'Seguinte' })); expect(page).toHaveBeenCalledWith(2);
  });
  test('distingue lista vazia, carregamento e erro recuperável', async () => {
    const retry = jest.fn(); const view = await render(<ThemeProvider><DataTable title="Registos" rows={[]} /></ThemeProvider>);
    expect(screen.getByText('Nenhum registo encontrado')).toBeTruthy();
    expect(screen.getByText('Não existem registos para apresentar.')).toBeTruthy();
    await view.rerender(<ThemeProvider><DataTable title="Registos" rows={[]} isLoading /></ThemeProvider>);
    expect(screen.getByRole('progressbar', { name: 'A carregar registos…' })).toBeTruthy(); expect(screen.queryByText('Nenhum registo encontrado')).toBeNull();
    await view.rerender(<ThemeProvider><DataTable title="Registos" rows={[]} error="Sem ligação" onRetry={retry} /></ThemeProvider>);
    expect(screen.getByText('Sem ligação')).toBeTruthy(); await fireEvent.press(screen.getByRole('button', { name: 'Repetir' })); expect(retry).toHaveBeenCalledTimes(1);
    await view.rerender(<ThemeProvider><DataTable title="Registos" rows={[]} error="Sem ligação" onRetry={retry} isLoading /></ThemeProvider>);
    expect(screen.queryByRole('button', { name: 'Repetir' })).toBeNull();
  });
  test('rejeita identificadores repetidos ou contagens incoerentes', async () => {
    await expect(render(<ThemeProvider><DataTable title="Registos" rows={[rows[0], rows[0]]} /></ThemeProvider>)).rejects.toThrow();
    await expect(render(<ThemeProvider><DataTable title="Registos" rows={rows} total={1} /></ThemeProvider>)).rejects.toThrow();
  });
  test('mantém registos e bloqueia ordenação e paginação durante carregamento', async () => {
    const sort = jest.fn(); const page = jest.fn();
    await render(<ThemeProvider><DataTable title="Registos" rows={rows} isLoading
      sorting={{ label: 'Referência', direction: 'ascending', onSort: sort }}
      pagination={{ page: 1, pageSize: 2, total: 4, onPageChange: page }} /></ThemeProvider>);
    expect(screen.getByText('Beta')).toBeTruthy(); expect(screen.getByRole('progressbar', { name: 'A carregar registos…' })).toBeTruthy();
    const order = screen.getByRole('button', { name: 'Ordenar por Referência' }); const next = screen.getByRole('button', { name: 'Seguinte' });
    expect(order).toBeDisabled(); expect(next).toBeDisabled(); await fireEvent.press(order); await fireEvent.press(next);
    expect(sort).not.toHaveBeenCalled(); expect(page).not.toHaveBeenCalled();
  });
});
