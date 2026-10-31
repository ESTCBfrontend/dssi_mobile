import { afterEach, describe, expect, jest, test } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import * as ReactNative from 'react-native';
import { useFonts } from 'expo-font';
import { lightTheme, ThemeProvider, useTheme } from './index';

jest.mock('expo-font', () => ({ useFonts: jest.fn(() => [true, null]) }));

function Sample({ name = 'Tema' }: { name?: string }) {
  const theme = useTheme();
  return <ReactNative.Text style={{ color: theme.colors.textPrimary }}>{name}</ReactNative.Text>;
}

afterEach(() => {
  jest.restoreAllMocks();
  jest.mocked(useFonts).mockReturnValue([true, null]);
});

describe('ThemeProvider', () => {
  test('propaga falhas no carregamento da fonte para a composição tratar o erro', async () => {
    jest.mocked(useFonts).mockReturnValue([false, new Error('Falha na fonte local')]);
    await expect(render(<ThemeProvider><Sample /></ThemeProvider>)).rejects.toThrow('Falha na fonte local');
  });

  test('acompanha mudanças do sistema quando existe uma paleta escura fornecida', async () => {
    const scheme = jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('light');
    const dark = { ...lightTheme, colors: { ...lightTheme.colors, textPrimary: '#eeeeee' } };
    const element = () => <ThemeProvider themes={{ light: lightTheme, dark }}><Sample /></ThemeProvider>;
    const view = await render(element());
    expect(screen.getByText('Tema')).toHaveStyle({ color: lightTheme.colors.textPrimary });
    scheme.mockReturnValue('dark');
    await view.rerender(element());
    expect(screen.getByText('Tema')).toHaveStyle({ color: '#eeeeee' });
  });

  test('o modo explícito prevalece sobre o sistema e pode mudar sem remontar o consumidor', async () => {
    jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('dark');
    const dark = { ...lightTheme, colors: { ...lightTheme.colors, textPrimary: '#eeeeee' } };
    const themes = { light: lightTheme, dark };
    const view = await render(<ThemeProvider themes={themes} mode="light"><Sample /></ThemeProvider>);
    expect(screen.getByText('Tema')).toHaveStyle({ color: lightTheme.colors.textPrimary });
    await view.rerender(<ThemeProvider themes={themes} mode="dark"><Sample /></ThemeProvider>);
    expect(screen.getByText('Tema')).toHaveStyle({ color: '#eeeeee' });
  });

  test('conserva a paleta clara enquanto não existir uma paleta escura', async () => {
    jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('dark');
    await render(<ThemeProvider><Sample /></ThemeProvider>);
    expect(screen.getByText('Tema')).toHaveStyle({ color: lightTheme.colors.textPrimary });
  });

  test('um tema local não altera o contexto dos restantes componentes', async () => {
    const custom = { ...lightTheme, colors: { ...lightTheme.colors, textPrimary: '#166534' } };
    await render(
      <ThemeProvider mode="light">
        <Sample name="Global" />
        <ThemeProvider themes={{ light: custom }}><Sample name="Local" /></ThemeProvider>
      </ThemeProvider>,
    );
    expect(screen.getByText('Global')).toHaveStyle({ color: lightTheme.colors.textPrimary });
    expect(screen.getByText('Local')).toHaveStyle({ color: '#166534' });
  });

  test('permite à composição mostrar conteúdo enquanto a fonte local está a carregar', async () => {
    jest.mocked(useFonts).mockReturnValue([false, null]);
    const element = () => <ThemeProvider fallback={<ReactNative.Text>A preparar</ReactNative.Text>}><Sample /></ThemeProvider>;
    const view = await render(element());
    expect(screen.getByText('A preparar')).toBeVisible();
    expect(screen.queryByText('Tema')).toBeNull();
    jest.mocked(useFonts).mockReturnValue([true, null]);
    await view.rerender(element());
    expect(screen.getByText('Tema')).toBeVisible();
  });
});
