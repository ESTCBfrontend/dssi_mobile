import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { act, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo, Animated, StyleSheet } from 'react-native';
import { LoadingIndicator } from './LoadingIndicator';
import { lightTheme, ThemeProvider } from '../theme';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

describe('LoadingIndicator', () => {
  let changed: (value: boolean) => void;
  const remove = jest.fn();
  const start = jest.fn();
  const stop = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
    jest.spyOn(AccessibilityInfo, 'addEventListener').mockImplementation((_event, callback) => {
      changed = callback as (value: boolean) => void;
      return { remove };
    });
    jest.spyOn(Animated, 'loop').mockReturnValue({ start, stop, reset: jest.fn() });
  });
  afterEach(() => { jest.restoreAllMocks(); jest.clearAllMocks(); });

  test('apresenta estado indeterminado acessível e texto configurável', async () => {
    await render(<ThemeProvider><LoadingIndicator type="inline" label="A sincronizar" /></ThemeProvider>);
    const progress = screen.getByRole('progressbar', { name: 'A sincronizar' });
    expect(progress.props.accessibilityState).toEqual({ busy: true });
    expect(progress.props.accessibilityLiveRegion).toBe('none');
    expect(screen.getByText('A sincronizar', { includeHiddenElements: true })).toBeTruthy();
    expect(start).not.toHaveBeenCalled();
  });

  test('ativa e interrompe animação quando a preferência do sistema muda e remove a subscrição', async () => {
    const view = await render(<ThemeProvider><LoadingIndicator /></ThemeProvider>);
    await act(() => { changed(false); });
    expect(start).toHaveBeenCalledTimes(1);
    await act(() => { changed(true); });
    expect(stop).toHaveBeenCalledTimes(1);
    const previousRemovals = remove.mock.calls.length;
    await view.unmount();
    expect(remove).toHaveBeenCalledTimes(previousRemovals + 1);
  });

  test('ignora consulta antiga quando a preferência muda antes da resposta', async () => {
    let resolvePreference!: (value: boolean) => void;
    jest.mocked(AccessibilityInfo.isReduceMotionEnabled).mockReturnValue(new Promise(resolve => { resolvePreference = resolve; }));
    await render(<ThemeProvider><LoadingIndicator /></ThemeProvider>);
    await act(() => { changed(true); resolvePreference(false); });
    expect(start).not.toHaveBeenCalled();
  });

  test('redução explícita impede animação e indicador inativo desaparece', async () => {
    const view = await render(<ThemeProvider><LoadingIndicator reducedMotion /></ThemeProvider>);
    await act(() => { changed(false); });
    expect(start).not.toHaveBeenCalled();
    await view.rerender(<ThemeProvider><LoadingIndicator active={false} /></ThemeProvider>);
    expect(screen.queryByRole('progressbar')).toBeNull();
  });

  test('esqueleto adapta número de linhas e tema sem animação', async () => {
    const theme = { ...lightTheme, loadingIndicator: { ...lightTheme.loadingIndicator, skeleton: '#abcdef' } };
    await render(<ThemeProvider themes={{ light: theme }}><LoadingIndicator type="skeleton" skeletonLines={4} accessibilityLabel="A carregar lista" /></ThemeProvider>);
    const progress = screen.getByRole('progressbar', { name: 'A carregar lista' });
    expect(progress.queryAll(node => StyleSheet.flatten(node.props.style)?.backgroundColor === '#abcdef')).toHaveLength(4);
    expect(start).not.toHaveBeenCalled();
  });

  test('valida nomes e limites de linhas', async () => {
    await expect(render(<ThemeProvider><LoadingIndicator label=" " /></ThemeProvider>)).rejects.toThrow();
    await expect(render(<ThemeProvider><LoadingIndicator type="inline" label=" " accessibilityLabel="Carregar" /></ThemeProvider>)).rejects.toThrow();
    await expect(render(<ThemeProvider><LoadingIndicator type="skeleton" skeletonLines={21} /></ThemeProvider>)).rejects.toThrow();
  });
});
