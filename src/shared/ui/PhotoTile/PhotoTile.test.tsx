import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ThemeProvider, lightTheme } from '../theme';
import { PhotoTile, type PhotoTilePhoto } from './PhotoTile';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));
const photo: PhotoTilePhoto = { id: 'p1', name: 'foto.jpg', uri: 'file:///foto.jpg', alt: 'Equipamento' };
describe('PhotoTile', () => {
  test('disponibiliza ações identificáveis e seleção controlada', async () => {
    const open = jest.fn(); const remove = jest.fn();
    await render(<ThemeProvider><PhotoTile photo={photo} state="ready" selected onOpen={open} onRemove={remove} /></ThemeProvider>);
    const openButton = screen.getByRole('button', { name: 'Abrir Equipamento' });
    expect(openButton.props.accessibilityState).toMatchObject({ selected: true });
    await fireEvent.press(openButton); await fireEvent.press(screen.getByRole('button', { name: 'Remover foto.jpg' }));
    expect(open).toHaveBeenCalledWith(photo); expect(remove).toHaveBeenCalledWith(photo);
  });
  test('distingue envio e erro e só repete através do callback', async () => {
    const retry = jest.fn();
    const view = await render(<ThemeProvider><PhotoTile photo={{ ...photo, uri: undefined }} state="uploading" progress={35} /></ThemeProvider>);
    expect(screen.getByRole('progressbar', { name: 'Progresso do envio' })).toHaveAccessibilityValue({ min: 0, max: 100, now: 35, text: '35%' });
    await view.rerender(<ThemeProvider><PhotoTile photo={photo} state="error" onRetry={retry} /></ThemeProvider>);
    expect(screen.getByText('Erro de envio')).toBeTruthy(); await fireEvent.press(screen.getByRole('button', { name: 'Repetir' }));
    expect(retry).toHaveBeenCalledWith(photo);
    await expect(render(<ThemeProvider><PhotoTile photo={photo} state="uploading" progress={-1} /></ThemeProvider>)).rejects.toThrow();
  });
  test('aceita tokens personalizados e uma imagem sem ação', async () => {
    const theme = { ...lightTheme, media: { ...lightTheme.media, background: '#abcdef' } };
    await render(<ThemeProvider themes={{ light: theme }}><PhotoTile testID="photo" photo={photo} state="ready" /></ThemeProvider>);
    expect(screen.getByTestId('photo')).toHaveStyle({ backgroundColor: '#abcdef' });
    expect(screen.queryByRole('button')).toBeNull();
  });
  test('usa o marcador quando a imagem não pode ser carregada', async () => {
    await render(<ThemeProvider><PhotoTile testID="photo" photo={photo} state="ready" /></ThemeProvider>);
    await fireEvent(screen.getByTestId('photo-image'), 'error', { nativeEvent: { error: 'Falha ao carregar' } });
    expect(screen.queryByTestId('photo-image')).toBeNull();
    expect(screen.getByLabelText('Equipamento')).toBeTruthy();
  });
});
