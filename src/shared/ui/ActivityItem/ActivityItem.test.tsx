import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ActivityItem, type ActivityEvent } from './ActivityItem';
import { lightTheme, ThemeProvider } from '../theme';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));
const event: ActivityEvent = { id: 'a', type: 'status', title: 'Estado atualizado', description: 'Em execução',
  author: 'Ana Silva', timestamp: 20, when: '12/11/2026 10:45', reference: 'OS-42' };

describe('ActivityItem', () => {
  test('apresenta informação fornecida e não cria interação automaticamente', async () => {
    await render(<ThemeProvider><ActivityItem event={event} /></ThemeProvider>);
    for (const value of ['Estado atualizado', 'Em execução', 'Ana Silva', '12/11/2026 10:45', 'OS-42']) expect(screen.getByText(value)).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });

  test('expõe ação opcional com os dados acessíveis e encaminha o evento', async () => {
    const onOpenRelated = jest.fn();
    await render(<ThemeProvider><ActivityItem event={event} onOpenRelated={onOpenRelated} /></ThemeProvider>);
    const button = screen.getByRole('button', { name: 'Estado atualizado. Em execução. Ana Silva. 12/11/2026 10:45. OS-42' });
    await fireEvent.press(button); expect(onOpenRelated).toHaveBeenCalledWith(event);
  });

  test('aceita ausência de descrição, respeita o tema e rejeita dados incompletos', async () => {
    const theme = { ...lightTheme, activityItem: { ...lightTheme.activityItem, background: '#abcdef' } };
    await render(<ThemeProvider themes={{ light: theme }}><ActivityItem testID="atividade" event={{ ...event, description: undefined }} /></ThemeProvider>);
    expect(screen.getByTestId('atividade')).toHaveStyle({ backgroundColor: '#abcdef' });
    await expect(render(<ThemeProvider><ActivityItem event={{ ...event, author: ' ' }} /></ThemeProvider>)).rejects.toThrow();
    await expect(render(<ThemeProvider><ActivityItem event={{ ...event, timestamp: NaN }} /></ThemeProvider>)).rejects.toThrow();
  });
});
