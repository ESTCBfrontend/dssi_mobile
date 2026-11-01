import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { PageButton } from './PageButton';
import { lightTheme, ThemeProvider } from '../theme';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

describe('PageButton', () => {
  test('comunica a página selecionada e emite a página sem gerir navegação', async () => {
    const onSelect = jest.fn();
    const view = await render(<ThemeProvider><PageButton page={3} onSelect={onSelect} /></ThemeProvider>);
    const button = screen.getByRole('button', { name: 'Página 3' });
    expect(button.props.accessibilityState.selected).toBe(false);
    await fireEvent.press(button);
    expect(onSelect).toHaveBeenCalledWith(3);
    expect(button.props.accessibilityState.selected).toBe(false);
    await view.rerender(<ThemeProvider><PageButton page={3} current onSelect={onSelect} /></ThemeProvider>);
    expect(screen.getByRole('button', { name: 'Página 3' }).props.accessibilityState.selected).toBe(true);
  });

  test('bloqueia seleção quando desativado e mantém o estado atual acessível', async () => {
    const onSelect = jest.fn();
    await render(<ThemeProvider><PageButton page={2} current disabled onSelect={onSelect} /></ThemeProvider>);
    const button = screen.getByRole('button', { name: 'Página 2' });
    expect(button).toBeDisabled(); expect(button.props.accessibilityState.selected).toBe(true);
    await fireEvent.press(button); expect(onSelect).not.toHaveBeenCalled();
  });

  test('respeita nome, tema e área tátil compacta', async () => {
    const theme = { ...lightTheme, pageButton: { ...lightTheme.pageButton, minTouchSize: 48 } };
    await render(<ThemeProvider themes={{ light: theme }}><PageButton page={100} size="compact" accessibilityLabel="Page 100" onSelect={jest.fn()} /></ThemeProvider>);
    expect(screen.getByRole('button', { name: 'Page 100' })).toHaveStyle({ minWidth: 48, minHeight: 48 });
    expect(screen.getByText('100')).toBeTruthy();
  });

  test('rejeita números de página ou nomes acessíveis inválidos', async () => {
    for (const page of [0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
      await expect(render(<ThemeProvider><PageButton page={page} onSelect={jest.fn()} /></ThemeProvider>)).rejects.toThrow();
    }
    await expect(render(<ThemeProvider><PageButton page={1} accessibilityLabel=" " onSelect={jest.fn()} /></ThemeProvider>)).rejects.toThrow();
  });
});
