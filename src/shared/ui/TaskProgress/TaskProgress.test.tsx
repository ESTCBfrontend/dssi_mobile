import { describe, expect, jest, test } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { TaskProgress } from './TaskProgress';
import { ThemeProvider } from '../theme';
jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

describe('TaskProgress', () => {
  test('apresenta contagens, percentagem e conclusão coerentes', async () => {
    const view = await render(<ThemeProvider><TaskProgress completed={8} total={13} /></ThemeProvider>);
    expect(screen.getByText('8 de 13')).toBeTruthy();
    expect(screen.getByRole('progressbar', { name: 'Verificações concluídas' }).props.accessibilityValue.now).toBe(62);
    await view.rerender(<ThemeProvider><TaskProgress completed={13} total={13} /></ThemeProvider>);
    expect(screen.getByText('Concluída')).toBeTruthy();
    expect(screen.getByRole('progressbar', { name: 'Verificações concluídas. Concluída' }).props.accessibilityValue.now).toBe(100);
    expect(screen.getByText('Verificações concluídas', { includeHiddenElements: true })).toBeTruthy();
  });
  test('não confunde lista vazia ou quase concluída com conclusão', async () => {
    const view = await render(<ThemeProvider><TaskProgress completed={0} total={0} /></ThemeProvider>);
    expect(screen.getByText('Sem verificações')).toBeTruthy(); expect(screen.queryByText('Concluída')).toBeNull();
    await view.rerender(<ThemeProvider><TaskProgress completed={199} total={200} /></ThemeProvider>);
    expect(screen.getByRole('progressbar', { name: 'Verificações concluídas' }).props.accessibilityValue.now).toBe(99);
    expect(screen.queryByText('Tudo verificado')).toBeNull();
  });
  test('rejeita contagens impossíveis', async () => {
    await expect(render(<ThemeProvider><TaskProgress completed={2} total={1} /></ThemeProvider>)).rejects.toThrow();
    await expect(render(<ThemeProvider><TaskProgress completed={-1} total={1} /></ThemeProvider>)).rejects.toThrow();
  });
  test('adapta também o estado lido pelo leitor de ecrã', async () => {
    await render(<ThemeProvider><TaskProgress completed={1} total={1} labels={{ complete: 'Done', progress: 'Checks' }} /></ThemeProvider>);
    expect(screen.getByRole('progressbar', { name: 'Checks. Done' })).toBeTruthy();
  });
});
