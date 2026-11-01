import { expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Button } from '../Button';
import { ThemeProvider } from '../theme';
import { ToastProvider, useToast } from './ToastSnackbar';
jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));
function Controls() {
  const toast = useToast();
  return <><Button label="Primeira" onPress={() => toast.show({ id: 'a', message: 'Mensagem A', durationMs: null })} />
    <Button label="Segunda" onPress={() => toast.show({ id: 'b', message: 'Mensagem B', durationMs: null })} />
    <Button label="Temporária" onPress={() => toast.show({ id: 'c', message: 'Aviso temporário', durationMs: 100 })} /></>;
}
test('mantém fila e ignora identificadores repetidos até serem removidos', async () => {
  await render(<ThemeProvider><ToastProvider><Controls /></ToastProvider></ThemeProvider>);
  await fireEvent.press(screen.getByRole('button', { name: 'Primeira' }));
  await fireEvent.press(screen.getByRole('button', { name: 'Primeira' }));
  await fireEvent.press(screen.getByRole('button', { name: 'Segunda' }));
  expect(screen.getByText('Mensagem A')).toBeTruthy(); expect(screen.queryByText('Mensagem B')).toBeNull();
  await fireEvent.press(screen.getByRole('button', { name: 'Fechar notificação' }));
  expect(screen.getByText('Mensagem B')).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Fechar notificação' }));
  expect(screen.queryByText('Mensagem A')).toBeNull(); expect(screen.queryByText('Mensagem B')).toBeNull();
});
test('remove a notificação temporária e liberta a fila', async () => {
  await render(<ThemeProvider><ToastProvider><Controls /></ToastProvider></ThemeProvider>);
  await fireEvent.press(screen.getByRole('button', { name: 'Temporária' }));
  expect(screen.getByText('Aviso temporário')).toBeTruthy();
  await waitFor(() => expect(screen.queryByText('Aviso temporário')).toBeNull());
});
