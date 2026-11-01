import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Tab } from './Tab';
import { lightTheme, ThemeProvider } from '../theme';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

describe('Tab', () => {
  test('emite id e mantém seleção controlada pelo consumidor', async () => {
    const onSelect = jest.fn();
    const view = await render(<ThemeProvider><Tab id="dados" label="Dados" selected={false} onSelect={onSelect} /></ThemeProvider>);
    const tab = screen.getByRole('tab', { name: 'Dados' });
    expect(tab.props.accessibilityState.selected).toBe(false);
    await fireEvent.press(tab); expect(onSelect).toHaveBeenCalledWith('dados');
    expect(tab.props.accessibilityState.selected).toBe(false);
    await view.rerender(<ThemeProvider><Tab id="dados" label="Dados" selected onSelect={onSelect} /></ThemeProvider>);
    expect(screen.getByRole('tab', { name: 'Dados' }).props.accessibilityState.selected).toBe(true);
  });

  test('separador desativado não emite seleção e continua a comunicar o estado', async () => {
    const onSelect = jest.fn();
    await render(<ThemeProvider><Tab id="equipa" label="Equipa" selected disabled onSelect={onSelect} /></ThemeProvider>);
    const tab = screen.getByRole('tab', { name: 'Equipa' });
    expect(tab).toBeDisabled(); expect(tab.props.accessibilityState.selected).toBe(true);
    await fireEvent.press(tab); expect(onSelect).not.toHaveBeenCalled();
  });

  test('inclui contador no nome acessível e encaminha eventos de foco', async () => {
    const onFocus = jest.fn(); const onBlur = jest.fn();
    await render(<ThemeProvider><Tab id="notas" label="Notas" count={0} selected={false} onSelect={jest.fn()} onFocus={onFocus} onBlur={onBlur} /></ThemeProvider>);
    const tab = screen.getByRole('tab', { name: 'Notas, 0' });
    await fireEvent(tab, 'focus', { nativeEvent: {} }); await fireEvent(tab, 'blur', { nativeEvent: {} });
    expect(onFocus).toHaveBeenCalledTimes(1); expect(onBlur).toHaveBeenCalledTimes(1);
  });

  test('respeita nome, tamanho e tema, rejeitando valores inválidos', async () => {
    const theme = { ...lightTheme, tab: { ...lightTheme.tab, minTouchSize: 48 } };
    await render(<ThemeProvider themes={{ light: theme }}><Tab id="a" label="Informação extensa" accessibilityLabel="Info" size="compact" selected={false} onSelect={jest.fn()} /></ThemeProvider>);
    expect(screen.getByRole('tab', { name: 'Info' })).toHaveStyle({ minWidth: 48, minHeight: 44 });
    await expect(render(<ThemeProvider><Tab id=" " label="A" selected={false} onSelect={jest.fn()} /></ThemeProvider>)).rejects.toThrow();
    await expect(render(<ThemeProvider><Tab id="a" label="A" count={-1} selected={false} onSelect={jest.fn()} /></ThemeProvider>)).rejects.toThrow();
    await expect(render(<ThemeProvider><Tab id="a" label=" " selected={false} onSelect={jest.fn()} /></ThemeProvider>)).rejects.toThrow();
  });
});
