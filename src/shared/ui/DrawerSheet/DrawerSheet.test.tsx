import { describe, expect, jest, test } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { PanResponder, StyleSheet, Text, type GestureResponderEvent, type PanResponderGestureState } from 'react-native';
import { Button } from '../Button';
import { ThemeProvider, lightTheme } from '../theme';
import { DrawerSheet } from './DrawerSheet';
jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

describe('DrawerSheet', () => {
  test('mostra conteúdo e encaminha pedido de fecho sem o executar autonomamente', async () => {
    const close = jest.fn(); const save = jest.fn();
    await render(<ThemeProvider><DrawerSheet testID="sheet" open title="Editar intervenção" onCloseRequest={close}
      actions={<Button label="Guardar" onPress={save} />}><Text>Campos fornecidos</Text></DrawerSheet></ThemeProvider>);
    expect(screen.getByTestId('sheet-handle', { includeHiddenElements: true })).toBeTruthy(); await fireEvent.press(screen.getByRole('button', { name: 'Guardar' }));
    expect(save).toHaveBeenCalledTimes(1); await fireEvent.press(screen.getByRole('button', { name: 'Fechar' }));
    expect(close).toHaveBeenCalledWith('closeButton'); expect(screen.getByText('Campos fornecidos')).toBeTruthy();
  });
  test('apresenta ecrã inteiro sem pega e aplica margens seguras e tema', async () => {
    const theme = { ...lightTheme, overlay: { ...lightTheme.overlay, background: '#abcdef' } };
    await render(<ThemeProvider themes={{ light: theme }}><DrawerSheet testID="sheet" open title="Editar"
      placement="fullscreen" safeAreaInsets={{ top: 24, bottom: 16 }} onCloseRequest={jest.fn()} /></ThemeProvider>);
    expect(screen.queryByTestId('sheet-handle')).toBeNull(); expect(screen.getByTestId('sheet')).toHaveStyle({ backgroundColor: '#abcdef' });
    const content = StyleSheet.flatten(screen.getByTestId('sheet-scroll').props.contentContainerStyle);
    expect(content.paddingTop).toBe(44); expect(content.paddingBottom).toBe(36);
  });
  test('gesto na pega só solicita fecho ao ultrapassar o limiar e quando permitido', async () => {
    const spy = jest.spyOn(PanResponder, 'create'); const close = jest.fn();
    const view = await render(<ThemeProvider><DrawerSheet open title="Ações" onCloseRequest={close} /></ThemeProvider>);
    const config = spy.mock.calls.at(-1)?.[0]; expect(config).toBeDefined();
    const event = {} as GestureResponderEvent;
    expect(config?.onMoveShouldSetPanResponder?.(event, { dx: 5, dy: 30 } as PanResponderGestureState)).toBe(true);
    expect(config?.onMoveShouldSetPanResponder?.(event, { dx: 30, dy: 5 } as PanResponderGestureState)).toBe(false);
    await act(() => { config?.onPanResponderRelease?.(event, { dy: 30 } as PanResponderGestureState); }); expect(close).not.toHaveBeenCalled();
    await act(() => { config?.onPanResponderRelease?.(event, { dy: 80 } as PanResponderGestureState); }); expect(close).toHaveBeenCalledWith('swipe');
    close.mockClear(); await view.rerender(<ThemeProvider><DrawerSheet open title="Ações" dismissible={false} onCloseRequest={close} /></ThemeProvider>);
    expect(config?.onMoveShouldSetPanResponder?.(event, { dx: 5, dy: 30 } as PanResponderGestureState)).toBe(false);
    await act(() => { config?.onPanResponderRelease?.(event, { dy: 80 } as PanResponderGestureState); }); expect(close).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
