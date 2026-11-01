import { expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as NativePicker from 'expo-image-picker';
import { ThemeProvider } from '../theme';
import { ImagePicker } from './ImagePicker';
jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));
jest.mock('expo-image-picker', () => ({ requestCameraPermissionsAsync: jest.fn(), launchCameraAsync: jest.fn(), launchImageLibraryAsync: jest.fn() }));
test('pede acesso à câmara apenas por ação e comunica recusa', async () => {
  const permission = jest.mocked(NativePicker.requestCameraPermissionsAsync); const camera = jest.mocked(NativePicker.launchCameraAsync);
  permission.mockResolvedValueOnce({ granted: false, canAskAgain: true, expires: 'never', status: 'denied' } as never);
  await render(<ThemeProvider><ImagePicker title="Fotografias" photos={[]} onAdd={jest.fn()} allowCamera /></ThemeProvider>);
  expect(permission).not.toHaveBeenCalled();
  await fireEvent.press(screen.getByRole('button', { name: 'Tirar fotografia' }));
  await waitFor(() => expect(screen.getByText('A permissão da câmara não foi concedida.')).toBeTruthy());
  expect(camera).not.toHaveBeenCalled();
});
test('devolve resultados da galeria e não pede a câmara', async () => {
  const gallery = jest.mocked(NativePicker.launchImageLibraryAsync); const add = jest.fn();
  const asset = { uri: 'file://foto.jpg', width: 100, height: 100 };
  gallery.mockResolvedValueOnce({ canceled: false, assets: [asset] });
  await render(<ThemeProvider><ImagePicker title="Fotografias" photos={[]} onAdd={add} /></ThemeProvider>);
  await fireEvent.press(screen.getByRole('button', { name: 'Escolher da galeria' }));
  await waitFor(() => expect(add).toHaveBeenCalledWith([asset], 'gallery'));
});
