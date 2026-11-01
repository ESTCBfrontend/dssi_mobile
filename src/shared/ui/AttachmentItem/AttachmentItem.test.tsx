import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ThemeProvider } from '../theme';
import { AttachmentItem, type AttachmentFile } from './AttachmentItem';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));
const file: AttachmentFile = { id: '1', name: 'relatorio.pdf', details: 'PDF · 1 MB', kind: 'document' };
describe('AttachmentItem', () => {
  test('apresenta o ficheiro e encaminha as ações sem alterar o estado', async () => {
    const onOpen = jest.fn(); const onRemove = jest.fn();
    await render(<ThemeProvider><AttachmentItem file={file} state="ready" onOpen={onOpen} onRemove={onRemove} /></ThemeProvider>);
    expect(screen.getByText('PDF · 1 MB')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Abrir relatorio.pdf' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Remover relatorio.pdf' }));
    expect(onOpen).toHaveBeenCalledWith(file); expect(onRemove).toHaveBeenCalledWith(file);
    expect(screen.getByText('Pronto para anexar')).toBeTruthy();
  });
  test('apresenta progresso determinado e impede valores incoerentes', async () => {
    await render(<ThemeProvider><AttachmentItem file={file} state="uploading" progress={62} /></ThemeProvider>);
    expect(screen.getByRole('progressbar', { name: 'Progresso do envio' })).toHaveAccessibilityValue({ now: 62, min: 0, max: 100, text: '62%' });
    await expect(render(<ThemeProvider><AttachmentItem file={file} state="uploading" progress={101} /></ThemeProvider>)).rejects.toThrow();
    await expect(render(<ThemeProvider><AttachmentItem file={file} state="uploading" /></ThemeProvider>)).rejects.toThrow();
  });
  test('erro permite repetir somente quando existe callback', async () => {
    const retry = jest.fn();
    const view = await render(<ThemeProvider><AttachmentItem file={file} state="error" /></ThemeProvider>);
    expect(screen.queryByRole('button', { name: 'Repetir' })).toBeNull();
    await view.rerender(<ThemeProvider><AttachmentItem file={file} state="error" onRetry={retry} /></ThemeProvider>);
    await fireEvent.press(screen.getByRole('button', { name: 'Repetir' }));
    expect(retry).toHaveBeenCalledWith(file); expect(screen.getByText('Não foi possível enviar')).toBeTruthy();
  });
});
