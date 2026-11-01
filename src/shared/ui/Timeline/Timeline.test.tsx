import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Timeline } from './Timeline';
import type { ActivityEvent } from '../ActivityItem';
import { lightTheme, ThemeProvider } from '../theme';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));
const makeEvent = (id: string, timestamp: number): ActivityEvent => ({ id, type: 'comment', title: `Evento ${id}`,
  author: 'Ana', timestamp, when: '12/11/2026', reference: 'OS-42' });

describe('Timeline', () => {
  test('ordena do mais recente para o mais antigo sem modificar os dados e preserva empates', async () => {
    const events = [makeEvent('A', 10), makeEvent('B', 20), makeEvent('C', 20)];
    await render(<ThemeProvider><Timeline title="Histórico" events={events} /></ThemeProvider>);
    expect(screen.getAllByText(/^Evento [ABC]$/).map(node => node.props.children)).toEqual(['Evento B', 'Evento C', 'Evento A']);
    expect(events.map(item => item.id)).toEqual(['A', 'B', 'C']);
    expect(screen.getByText('3 eventos')).toBeTruthy();
  });

  test('carrega mais apenas quando solicitado e bloqueia repetição durante carregamento', async () => {
    const onLoadMore = jest.fn(); const events = [makeEvent('A', 10)];
    const view = await render(<ThemeProvider><Timeline title="Histórico" events={events} hasMore onLoadMore={onLoadMore} /></ThemeProvider>);
    expect(screen.getByText('1 evento carregado')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Ver mais atividades' })); expect(onLoadMore).toHaveBeenCalledTimes(1);
    await view.rerender(<ThemeProvider><Timeline title="Histórico" events={events} hasMore isLoading onLoadMore={onLoadMore} /></ThemeProvider>);
    const button = screen.getByRole('button', { name: 'Ver mais atividades' }); expect(button).toBeDisabled();
    await fireEvent.press(button); expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  test('encaminha a ação do item e não mostra carregamento adicional sem callback', async () => {
    const onOpenRelated = jest.fn(); const event = makeEvent('A', 10);
    await render(<ThemeProvider><Timeline title="Histórico" events={[event]} hasMore onOpenRelated={onOpenRelated} /></ThemeProvider>);
    await fireEvent.press(screen.getByRole('button', { name: 'Evento A. Ana. 12/11/2026. OS-42' }));
    expect(onOpenRelated).toHaveBeenCalledWith(event);
    expect(screen.queryByRole('button', { name: 'Ver mais atividades' })).toBeNull();
  });

  test('distingue lista vazia, carregamento e resultados por carregar', async () => {
    const onLoadMore = jest.fn();
    const view = await render(<ThemeProvider><Timeline title="Histórico" events={[]} /></ThemeProvider>);
    expect(screen.getByText('Sem eventos')).toBeTruthy(); expect(screen.getByText('Ainda sem atividade registada')).toBeTruthy();
    await view.rerender(<ThemeProvider><Timeline title="Histórico" events={[]} isLoading /></ThemeProvider>);
    expect(screen.getByRole('progressbar', { name: 'A carregar atividades…' })).toBeTruthy(); expect(screen.queryByText('Sem eventos')).toBeNull();
    await view.rerender(<ThemeProvider><Timeline title="Histórico" events={[]} hasMore total={3} onLoadMore={onLoadMore} /></ThemeProvider>);
    expect(screen.getByText('3 eventos')).toBeTruthy(); expect(screen.getByText('Ainda sem atividades carregadas')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Ver mais atividades' })); expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  test('respeita o tema e rejeita identificadores duplicados e totais inválidos', async () => {
    const theme = { ...lightTheme, timeline: { ...lightTheme.timeline, background: '#abcdef' } };
    await render(<ThemeProvider themes={{ light: theme }}><Timeline testID="timeline" title="Histórico" events={[]} /></ThemeProvider>);
    expect(screen.getByTestId('timeline')).toHaveStyle({ backgroundColor: '#abcdef' });
    await expect(render(<ThemeProvider><Timeline title="Histórico" events={[makeEvent('A', 1), makeEvent('A', 2)]} /></ThemeProvider>)).rejects.toThrow();
    await expect(render(<ThemeProvider><Timeline title="Histórico" events={[makeEvent('A', 1)]} total={0} /></ThemeProvider>)).rejects.toThrow();
  });
});
