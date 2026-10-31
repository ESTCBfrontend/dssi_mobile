import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen, userEvent } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { Button, type ButtonIconProps } from './Button';
import { lightTheme, ThemeProvider } from '../theme';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

describe('Button', () => {
  test('rejeita um rótulo vazio para evitar ações sem identificação', async () => {
    await expect(render(<ThemeProvider><Button label="   " onPress={jest.fn()} /></ThemeProvider>))
      .rejects.toThrow('Button requer uma label não vazia.');
  });

  test('duas utilizações recebem dados e ações independentes', async () => {
    const onOpen = jest.fn();
    const onSave = jest.fn();
    await render(
      <ThemeProvider>
        <View>
          <Button label="Abrir equipamento EQ-84" variant="outline" onPress={onOpen} />
          <Button label="Guardar rascunho" onPress={onSave} />
        </View>
      </ThemeProvider>,
    );
    await userEvent.press(screen.getByRole('button', { name: 'Guardar rascunho' }));
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onOpen).not.toHaveBeenCalled();
  });

  test('disabled impede a ação e comunica o estado acessível', async () => {
    const onPress = jest.fn();
    await render(<ThemeProvider><Button label="Eliminar" variant="danger" disabled onPress={onPress} /></ThemeProvider>);
    const button = screen.getByRole('button', { name: 'Eliminar' });
    expect(button).toBeDisabled();
    await userEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  test('loading bloqueia novas ações, conserva o nome e volta a permitir interação', async () => {
    const onPress = jest.fn();
    const element = (loading: boolean) => (
      <ThemeProvider><Button label="Enviar relatório" loadingLabel="A enviar…" loading={loading} onPress={onPress} /></ThemeProvider>
    );
    const view = await render(element(false));
    await userEvent.press(screen.getByRole('button', { name: 'Enviar relatório' }));
    await view.rerender(element(true));
    const button = screen.getByRole('button', { name: 'Enviar relatório' });
    expect(button).toBeBusy();
    expect(button).toBeDisabled();
    expect(screen.getByText('A enviar…')).toBeVisible();
    await userEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
    await view.rerender(element(false));
    expect(screen.getByRole('button', { name: 'Enviar relatório' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Enviar relatório' })).not.toBeBusy();
    await userEvent.press(screen.getByRole('button', { name: 'Enviar relatório' }));
    expect(onPress).toHaveBeenCalledTimes(2);
  });

  test('aceita ícones nos dois lados sem criar nomes ou ações acessíveis adicionais', async () => {
    const onPress = jest.fn();
    const iconStart = jest.fn(({ color }: ButtonIconProps) => <Text style={{ color }}>+</Text>);
    await render(
      <ThemeProvider>
        <Button label="Nova ordem" accessibilityLabel="Criar ordem de serviço" onPress={onPress}
          iconStart={iconStart} iconEnd={<Text>→</Text>} />
      </ThemeProvider>,
    );
    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Criar ordem de serviço' })).toBeEnabled();
    expect(screen.queryByText('+')).toBeNull();
    expect(iconStart).toHaveBeenCalledWith({ color: lightTheme.colors.textOnPrimary, size: 24 });
    await userEvent.press(screen.getByRole('button', { name: 'Criar ordem de serviço' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('aplica alterações de tema e overrides locais sem mudar a ação', async () => {
    const onPress = jest.fn();
    const customTheme = {
      ...lightTheme,
      colors: { ...lightTheme.colors, actionPrimary: '#166534' },
      radius: { control: 20 },
    };
    const element = (custom: boolean) => (
      <ThemeProvider themes={{ light: custom ? customTheme : lightTheme }}>
        <Button label="Guardar" onPress={onPress} style={{ marginTop: 8 }} textStyle={{ fontSize: 18 }} />
      </ThemeProvider>
    );
    const view = await render(element(false));
    await view.rerender(element(true));
    expect(screen.getByRole('button', { name: 'Guardar' })).toHaveStyle({ backgroundColor: '#166534', borderRadius: 20, marginTop: 8 });
    expect(screen.getByText('Guardar')).toHaveStyle({ fontSize: 18 });
    await userEvent.press(screen.getByRole('button', { name: 'Guardar' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('mostra foco visível e preserva callbacks nativos', async () => {
    const onFocus = jest.fn();
    await render(<ThemeProvider><Button label="Continuar" onPress={jest.fn()} onFocus={onFocus} /></ThemeProvider>);
    const button = screen.getByRole('button', { name: 'Continuar' });
    await fireEvent(button, 'focus', { nativeEvent: {} });
    expect(screen.getByRole('button', { name: 'Continuar' })).toHaveStyle({ outlineWidth: 2 });
    expect(onFocus).toHaveBeenCalledTimes(1);
    await fireEvent(button, 'blur', { nativeEvent: {} });
    expect(screen.getByRole('button', { name: 'Continuar' })).toHaveStyle({ outlineWidth: 0 });
  });

  test('texto variável mantém o nome completo numa composição estreita', async () => {
    const label = 'Guardar o relatório desta intervenção e continuar a trabalhar no equipamento';
    const view = await render(<ThemeProvider><View style={{ width: 180 }}><Button label="Guardar" fullWidth onPress={jest.fn()} /></View></ThemeProvider>);
    await view.rerender(<ThemeProvider><View style={{ width: 180 }}><Button label={label} fullWidth onPress={jest.fn()} /></View></ThemeProvider>);
    expect(screen.getByRole('button', { name: label })).toBeEnabled();
    expect(screen.getByText(label)).toHaveTextContent(label);
  });
});
