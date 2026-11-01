import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { Card } from './Card';
import { Button } from '../Button';
import { StatusBadge } from '../StatusBadge';
import { lightTheme, ThemeProvider } from '../theme';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

describe('Card', () => {
  test('compõe estado, conteúdo e ação sem agrupar os controlos acessíveis', async () => {
    const onPress = jest.fn();
    await render(<ThemeProvider><Card title="Intervenção" subtitle="Hoje" status={<StatusBadge label="Em curso" />}
      actions={<Button label="Abrir" onPress={onPress} />}><Text>Três linhas de informação de uma intervenção.</Text></Card></ThemeProvider>);
    expect(screen.getByRole('header', { name: 'Intervenção' })).toBeTruthy();
    expect(screen.getByLabelText('Em curso')).toBeTruthy();
    expect(screen.getByText('Três linhas de informação de uma intervenção.')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Abrir' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('adapta conteúdo atualizado e rodapé sem conteúdo de exemplo', async () => {
    const view = await render(<ThemeProvider><Card><Text>Primeira linha</Text></Card></ThemeProvider>);
    expect(screen.getByText('Primeira linha')).toBeTruthy();
    await view.rerender(<ThemeProvider><Card footer={<Text>Rodapé</Text>}><Text>Primeira linha{'\n'}Segunda{'\n'}Terceira</Text></Card></ThemeProvider>);
    expect(screen.getByText('Rodapé')).toBeTruthy();
    expect(screen.getByText('Primeira linha\nSegunda\nTerceira')).toBeTruthy();
  });

  test('permite tema, largura reduzida e alteração de variante', async () => {
    const theme = { ...lightTheme, card: { ...lightTheme.card, background: '#abcdef' } };
    const view = await render(<ThemeProvider themes={{ light: theme }}><View style={{ width: 150 }}>
      <Card testID="card" title="Um título suficientemente comprido para quebrar linha" variant="elevated" density="comfortable" />
    </View></ThemeProvider>);
    expect(screen.getByTestId('card')).toHaveStyle({ backgroundColor: '#abcdef', borderWidth: 0 });
    await view.rerender(<ThemeProvider themes={{ light: theme }}><Card testID="card" title="Título" /></ThemeProvider>);
    expect(screen.getByTestId('card')).toHaveStyle({ borderWidth: 1 });
  });

  test('rejeita título ou subtítulo vazios quando fornecidos', async () => {
    await expect(render(<ThemeProvider><Card title=" " /></ThemeProvider>)).rejects.toThrow();
    await expect(render(<ThemeProvider><Card subtitle=" " /></ThemeProvider>)).rejects.toThrow();
  });
});
