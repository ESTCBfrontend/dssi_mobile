import { expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as DocumentPicker from 'expo-document-picker';
import { ThemeProvider } from '../theme';
import { FileUpload } from './FileUpload';
jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));
jest.mock('expo-document-picker', () => ({ getDocumentAsync: jest.fn() }));
test('cancelamento não altera dados e formato inválido não é aceite', async () => {
  const pick = jest.mocked(DocumentPicker.getDocumentAsync); const add = jest.fn();
  pick.mockResolvedValueOnce({ canceled: true, assets: null });
  pick.mockResolvedValueOnce({ canceled: false, assets: [{ name: 'foto.jpg', uri: 'file://foto.jpg', size: 3, mimeType: 'image/jpeg', lastModified: 1 }] });
  await render(<ThemeProvider><FileUpload title="Anexos" files={[]} onAdd={add} accept={['application/pdf']} /></ThemeProvider>);
  await fireEvent.press(screen.getByRole('button', { name: 'Adicionar ficheiro' }));
  expect(add).not.toHaveBeenCalled();
  await fireEvent.press(screen.getByRole('button', { name: 'Adicionar ficheiro' }));
  await waitFor(() => expect(screen.getByText('Um ficheiro não corresponde aos formatos permitidos.')).toBeTruthy());
  expect(add).not.toHaveBeenCalled();
});
test('aceita documento válido e aplica limite de tamanho', async () => {
  const pick = jest.mocked(DocumentPicker.getDocumentAsync); const add = jest.fn();
  const asset = { name: 'ficheiro.pdf', uri: 'file://ficheiro.pdf', size: 25, mimeType: 'application/pdf', lastModified: 1 };
  pick.mockResolvedValueOnce({ canceled: false, assets: [asset] });
  await render(<ThemeProvider><FileUpload title="Anexos" files={[]} onAdd={add} accept={['application/pdf']}
    allowedExtensions={['pdf']} maxSizeBytes={100} /></ThemeProvider>);
  await fireEvent.press(screen.getByRole('button', { name: 'Adicionar ficheiro' }));
  await waitFor(() => expect(add).toHaveBeenCalledWith([asset]));
});
