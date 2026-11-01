import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { ContentPanel } from './ContentPanel';
import { Button } from '../Button';
import { lightTheme, ThemeProvider } from '../theme';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

describe('ContentPanel', () => {
  test('compõe texto, ação, conteúdo e rodapé sem agrupar os controlos', async () => {
    const onPress = jest.fn();
    await render(<ThemeProvider><ContentPanel title="Intervenções" description="Lista atual" actions={<Button label="Criar" onPress={onPress} />}
      footer={<Text>Última atualização hoje</Text>}><Text>Intervenção 1</Text></ContentPanel></ThemeProvider>);
    expect(screen.getByRole('header', { name: 'Intervenções' })).toBeTruthy();
    expect(screen.getByText('Lista atual')).toBeTruthy();
    expect(screen.getByText('Intervenção 1')).toBeTruthy();
    expect(screen.getByText('Última atualização hoje')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Criar' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('não cria conteúdo nem ações fictícias e atualiza os slots', async () => {
    const view = await render(<ThemeProvider><ContentPanel title="Secção" /></ThemeProvider>);
    expect(screen.queryByRole('button')).toBeNull();
    await view.rerender(<ThemeProvider><ContentPanel><Text>Conteúdo real atualizado</Text></ContentPanel></ThemeProvider>);
    expect(screen.queryByText('Secção')).toBeNull();
    expect(screen.getByText('Conteúdo real atualizado')).toBeTruthy();
  });

  test('aplica tema e variante mesmo em contentor estreito', async () => {
    const theme = { ...lightTheme, contentPanel: { ...lightTheme.contentPanel,
      background: { ...lightTheme.contentPanel.background, muted: '#abcdef' } } };
    await render(<ThemeProvider themes={{ light: theme }}><View style={{ width: 180 }}><ContentPanel testID="painel"
      layout="wide" surface="muted" title="Uma secção com título comprido" actions={<Button label="Abrir" onPress={jest.fn()} />} /></View></ThemeProvider>);
    expect(screen.getByTestId('painel')).toHaveStyle({ backgroundColor: '#abcdef', borderWidth: 0 });
    expect(screen.getByRole('button', { name: 'Abrir' })).toBeTruthy();
  });

  test('dispõe as ações conforme a largura medida e encaminha onLayout', async () => {
    const onLayout = jest.fn();
    await render(<ThemeProvider><ContentPanel testID="painel" title="Título" layout="wide" onLayout={onLayout}
      actions={<Button label="Abrir" onPress={jest.fn()} />} /></ThemeProvider>);
    const header = screen.getByRole('header', { name: 'Título' }).parent?.parent;
    expect(header).not.toHaveStyle({ flexDirection: 'row' });
    await fireEvent(screen.getByTestId('painel'), 'layout', { nativeEvent: { layout: { width: 600, height: 200, x: 0, y: 0 } } });
    expect(header).toHaveStyle({ flexDirection: 'row' });
    await fireEvent(screen.getByTestId('painel'), 'layout', { nativeEvent: { layout: { width: 220, height: 200, x: 0, y: 0 } } });
    expect(header).not.toHaveStyle({ flexDirection: 'row' });
    expect(onLayout).toHaveBeenCalledTimes(2);
  });

  test('rejeita título e descrição vazios quando fornecidos', async () => {
    await expect(render(<ThemeProvider><ContentPanel title=" " /></ThemeProvider>)).rejects.toThrow();
    await expect(render(<ThemeProvider><ContentPanel description=" " /></ThemeProvider>)).rejects.toThrow();
  });
});
