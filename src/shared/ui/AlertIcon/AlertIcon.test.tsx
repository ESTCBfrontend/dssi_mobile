import { describe, expect, jest, test } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { AlertIcon } from './AlertIcon';
import { lightTheme, ThemeProvider } from '../theme';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

describe('AlertIcon', () => {
  test('é decorativo por omissão e não acrescenta anúncios nem ações', async () => {
    await render(<ThemeProvider><AlertIcon testID="icon" /></ThemeProvider>);
    expect(screen.queryByRole('image')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByTestId('icon', { includeHiddenElements: true }).props.importantForAccessibility).toBe('no-hide-descendants');
  });

  test('expõe um único nome contextual quando não é decorativo', async () => {
    await render(<ThemeProvider><AlertIcon tone="danger" decorative={false} accessibilityLabel="  Falha ao guardar a intervenção  " /></ThemeProvider>);
    expect(screen.getAllByRole('image')).toHaveLength(1);
    expect(screen.getByRole('image', { name: 'Falha ao guardar a intervenção' })).toBeVisible();
  });

  test('rejeita informação sem nome acessível', async () => {
    await expect(render(<ThemeProvider><AlertIcon decorative={false} accessibilityLabel="  " /></ThemeProvider>))
      .rejects.toThrow('AlertIcon não decorativo requer uma accessibilityLabel não vazia.');
  });

  test('altera símbolo, cor e nome ao mudar o estado', async () => {
    const view = await render(<ThemeProvider><AlertIcon tone="info" decorative={false} accessibilityLabel="A processar" /></ThemeProvider>);
    const sourceBefore = screen.getByRole('image').queryAll(node => node.props.source !== undefined)[0].props.source;
    await view.rerender(<ThemeProvider><AlertIcon tone="success" decorative={false} accessibilityLabel="Concluído" /></ThemeProvider>);
    const icon = screen.getByRole('image', { name: 'Concluído' });
    expect(icon).toHaveStyle({ backgroundColor: lightTheme.alertIcon.tones.success.background });
    expect(icon.queryAll(node => node.props.source !== undefined)[0].props.source).not.toEqual(sourceBefore);
    expect(screen.queryByRole('image', { name: 'A processar' })).toBeNull();
  });

  test('usa o tema configurado e permite tamanho e cor locais sem afetar os irmãos', async () => {
    const customTheme = { ...lightTheme, alertIcon: {
      size: 42,
      tones: { ...lightTheme.alertIcon.tones, warning: { background: '#123456', symbol: '#abcdef' } },
    } };
    await render(<ThemeProvider mode="dark" themes={{ light: lightTheme, dark: customTheme }}>
      <AlertIcon tone="warning" decorative={false} accessibilityLabel="Tema" />
      <AlertIcon tone="warning" size={60} colorOverride="#654321" style={{ marginTop: 8 }} decorative={false} accessibilityLabel="Local" />
    </ThemeProvider>);
    const themed = screen.getByRole('image', { name: 'Tema' });
    expect(themed).toHaveStyle({ width: 42, height: 42, backgroundColor: '#123456' });
    expect(themed.queryAll(node => node.props.source !== undefined)[0]).toHaveStyle({ tintColor: '#abcdef' });
    expect(screen.getByRole('image', { name: 'Local' })).toHaveStyle({ width: 60, height: 60, borderRadius: 30, backgroundColor: '#654321', marginTop: 8 });
  });

  test('rejeita tamanhos que tornariam o símbolo invisível ou inválido', async () => {
    for (const size of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
      await expect(render(<ThemeProvider><AlertIcon size={size} /></ThemeProvider>))
        .rejects.toThrow('AlertIcon requer um tamanho finito maior que zero.');
    }
  });
});
