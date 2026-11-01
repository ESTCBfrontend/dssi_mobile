import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Pagination } from './Pagination';
import { lightTheme, ThemeProvider } from '../theme';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

describe('Pagination', () => {
  test('calcula intervalo e limita navegação na primeira e última páginas', async () => {
    const onPageChange = jest.fn();
    const view = await render(<ThemeProvider><Pagination page={1} pageSize={10} total={24} onPageChange={onPageChange} /></ThemeProvider>);
    expect(screen.getByText('24 registos')).toBeTruthy(); expect(screen.getByText('1–10 de 24')).toBeTruthy();
    expect(screen.getByText('Página 1 de 3')).toBeTruthy(); expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled();
    await fireEvent.press(screen.getByRole('button', { name: 'Anterior' })); expect(onPageChange).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('button', { name: 'Seguinte' })); expect(onPageChange).toHaveBeenCalledWith(2);
    await view.rerender(<ThemeProvider><Pagination page={3} pageSize={10} total={24} onPageChange={onPageChange} /></ThemeProvider>);
    expect(screen.getByText('21–24 de 24')).toBeTruthy(); expect(screen.getByRole('button', { name: 'Seguinte' })).toBeDisabled();
    await fireEvent.press(screen.getByRole('button', { name: 'Anterior' })); expect(onPageChange).toHaveBeenCalledWith(2);
  });

  test('sem resultados não inventa páginas e desativa ambos os controlos', async () => {
    const onPageChange = jest.fn();
    await render(<ThemeProvider><Pagination page={1} pageSize={10} total={0} onPageChange={onPageChange} /></ThemeProvider>);
    expect(screen.getByText('0 registos')).toBeTruthy(); expect(screen.getByText('0–0 de 0')).toBeTruthy();
    expect(screen.getByText('Sem páginas')).toBeTruthy();
    for (const name of ['Anterior', 'Seguinte']) { const button = screen.getByRole('button', { name }); expect(button).toBeDisabled(); await fireEvent.press(button); }
    expect(onPageChange).not.toHaveBeenCalled();
  });

  test('controla estado intermédio, desativação global e localização', async () => {
    const onPageChange = jest.fn();
    const labels = { previous: 'Previous', next: 'Next', total: (total: number) => `${total} items`,
      range: (start: number, end: number, total: number) => `${start} to ${end} of ${total}`,
      page: (page: number, count: number) => `Page ${page} of ${count}` };
    const view = await render(<ThemeProvider><Pagination page={2} pageSize={10} total={24} labels={labels} onPageChange={onPageChange} /></ThemeProvider>);
    expect(screen.getByText('11 to 20 of 24')).toBeTruthy(); expect(screen.getByText('Page 2 of 3')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Next' })); expect(onPageChange).toHaveBeenCalledWith(3);
    await view.rerender(<ThemeProvider><Pagination page={2} pageSize={10} total={24} labels={labels} disabled onPageChange={onPageChange} /></ThemeProvider>);
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled(); expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  test('adapta a ordem à largura e mantém os botões quando o espaço muda', async () => {
    const onLayout = jest.fn();
    await render(<ThemeProvider><Pagination testID="paginacao" page={2} pageSize={10} total={24} onPageChange={jest.fn()} onLayout={onLayout} /></ThemeProvider>);
    const previous = screen.getByRole('button', { name: 'Anterior' });
    const next = screen.getByRole('button', { name: 'Seguinte' });
    const label = screen.getByText('Página 2 de 3');
    expect(label).toHaveStyle({ flexBasis: '100%' });
    await fireEvent(screen.getByTestId('paginacao'), 'layout', { nativeEvent: { layout: { width: 350, height: 100, x: 0, y: 0 } } });
    expect(label).toHaveStyle({ flexBasis: 90 });
    expect(screen.getByRole('button', { name: 'Anterior' })).toBe(previous);
    expect(screen.getByRole('button', { name: 'Seguinte' })).toBe(next);
    expect(onLayout).toHaveBeenCalledTimes(1);
  });

  test('respeita tema e rejeita valores inconsistentes', async () => {
    const theme = { ...lightTheme, pagination: { ...lightTheme.pagination, background: '#abcdef' } };
    await render(<ThemeProvider themes={{ light: theme }}><Pagination testID="paginacao" page={1} pageSize={10} total={1} onPageChange={jest.fn()} /></ThemeProvider>);
    expect(screen.getByTestId('paginacao')).toHaveStyle({ backgroundColor: '#abcdef' }); expect(screen.getByText('1 registo')).toBeTruthy();
    for (const args of [{ page: 0, pageSize: 10, total: 2 }, { page: 1, pageSize: 0, total: 2 },
      { page: 2, pageSize: 10, total: 0 }, { page: 3, pageSize: 10, total: 11 }, { page: 1, pageSize: 10, total: NaN }]) {
      await expect(render(<ThemeProvider><Pagination {...args} onPageChange={jest.fn()} /></ThemeProvider>)).rejects.toThrow();
    }
  });
});
