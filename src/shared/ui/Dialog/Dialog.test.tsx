import { describe, expect, jest, test } from '@jest/globals';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { AccessibilityInfo, Text, type HostInstance } from 'react-native';
import { Button } from '../Button';
import { ThemeProvider } from '../theme';
import { Dialog } from './Dialog';
jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

describe('Dialog', () => {
  test('pede o fecho sem alterar o estado controlado e mantém ações independentes', async () => {
    const close = jest.fn(); const confirm = jest.fn();
    const view = await render(<ThemeProvider><Dialog testID="dialog" open title="Eliminar registo?" intent="danger"
      message="A ação não pode ser desfeita." onCloseRequest={close} actions={<Button label="Eliminar" variant="danger" onPress={confirm} />}>
      <Text>Conteúdo fornecido</Text></Dialog></ThemeProvider>);
    expect(screen.getByRole('header', { name: 'Eliminar registo?' })).toBeTruthy();
    expect(screen.getByText('A ação não pode ser desfeita.')).toHaveStyle({ color: '#b42318' });
    await fireEvent.press(screen.getByRole('button', { name: 'Eliminar' })); expect(confirm).toHaveBeenCalledTimes(1); expect(close).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('button', { name: 'Fechar' })); expect(close).toHaveBeenCalledWith('closeButton');
    expect(screen.getByText('Conteúdo fornecido')).toBeTruthy();
    await view.rerender(<ThemeProvider><Dialog testID="dialog" open={false} title="Eliminar registo?" onCloseRequest={close} /></ThemeProvider>);
    expect(screen.queryByText('Conteúdo fornecido')).toBeNull();
  });
  test('distingue voltar, toque fora opcional e bloqueio do fecho', async () => {
    const close = jest.fn(); const view = await render(<ThemeProvider><Dialog testID="dialog" open title="Editar" onCloseRequest={close} /></ThemeProvider>);
    await fireEvent.press(screen.getByTestId('dialog-backdrop', { includeHiddenElements: true })); expect(close).not.toHaveBeenCalled();
    await fireEvent(screen.getByTestId('dialog-native'), 'requestClose'); expect(close).toHaveBeenCalledWith('system');
    await view.rerender(<ThemeProvider><Dialog testID="dialog" open title="Editar" onCloseRequest={close} dismissOnBackdrop /></ThemeProvider>);
    await fireEvent.press(screen.getByTestId('dialog-backdrop', { includeHiddenElements: true })); expect(close).toHaveBeenCalledWith('backdrop');
    close.mockClear(); await view.rerender(<ThemeProvider><Dialog testID="dialog" open title="Editar" onCloseRequest={close} dismissible={false} dismissOnBackdrop /></ThemeProvider>);
    expect(screen.getByRole('button', { name: 'Fechar' })).toBeDisabled();
    await fireEvent.press(screen.getByRole('button', { name: 'Fechar' })); await fireEvent(screen.getByTestId('dialog-native'), 'requestClose');
    expect(close).not.toHaveBeenCalled();
  });
  test('aplica margens fornecidas e rejeita dados inválidos', async () => {
    const close = jest.fn();
    await render(<ThemeProvider><Dialog testID="dialog" open title="Editar" onCloseRequest={close} safeAreaInsets={{ bottom: 12 }} /></ThemeProvider>);
    expect(screen.getByTestId('dialog-scroll')).toBeTruthy();
    await expect(render(<ThemeProvider><Dialog open title=" " onCloseRequest={close} /></ThemeProvider>)).rejects.toThrow();
    await expect(render(<ThemeProvider><Dialog open title="Editar" onCloseRequest={close} safeAreaInsets={{ top: -1 }} /></ThemeProvider>)).rejects.toThrow();
  });
  test('solicita foco inicial e retorno após a aplicação fechar o diálogo', async () => {
    const spy = jest.spyOn(AccessibilityInfo, 'sendAccessibilityEvent').mockImplementation(() => {});
    const initial = {} as HostInstance; const returned = {} as HostInstance;
    const initialFocusRef = { current: initial }; const returnFocusRef = { current: returned }; const close = jest.fn();
    const view = await render(<ThemeProvider><Dialog testID="dialog" open title="Editar" onCloseRequest={close}
      initialFocusRef={initialFocusRef} returnFocusRef={returnFocusRef} /></ThemeProvider>);
    await fireEvent(screen.getByTestId('dialog-native'), 'show'); expect(spy).toHaveBeenCalledWith(initial, 'focus');
    await view.rerender(<ThemeProvider><Dialog testID="dialog" open={false} title="Editar" onCloseRequest={close}
      initialFocusRef={initialFocusRef} returnFocusRef={returnFocusRef} /></ThemeProvider>);
    await waitFor(() => expect(spy).toHaveBeenCalledWith(returned, 'focus')); spy.mockRestore();
  });
  test('eventos nativos atrasados respeitam o estado e callback mais recentes', async () => {
    const first = jest.fn(); const latest = jest.fn();
    const view = await render(<ThemeProvider><Dialog testID="dialog" open title="Editar" onCloseRequest={first} /></ThemeProvider>);
    const request = screen.getByTestId('dialog-native').props.onRequestClose; expect(typeof request).toBe('function');
    await view.rerender(<ThemeProvider><Dialog testID="dialog" open title="Editar" onCloseRequest={latest} /></ThemeProvider>);
    await act(() => request()); expect(first).not.toHaveBeenCalled(); expect(latest).toHaveBeenCalledWith('system');
    latest.mockClear(); await view.rerender(<ThemeProvider><Dialog testID="dialog" open={false} title="Editar" onCloseRequest={latest} /></ThemeProvider>);
    await act(() => request()); expect(latest).not.toHaveBeenCalled();
  });
});
