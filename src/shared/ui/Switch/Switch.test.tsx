import { describe, expect, jest, test } from '@jest/globals';
import { useState } from 'react';
import { fireEvent, render, screen, userEvent } from '@testing-library/react-native';
import { View } from 'react-native';
import { Switch } from './Switch';
import { lightTheme, ThemeProvider } from '../theme';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

describe('Switch', () => {
  test('alterna imediatamente o valor controlado e o estado acessível', async () => {
    function Example() {
      const [value, setValue] = useState(false);
      return <Switch label="Receber notificações" value={value} onValueChange={setValue} />;
    }
    await render(<ThemeProvider><Example /></ThemeProvider>);
    const control = screen.getByRole('switch', { name: 'Receber notificações' });
    expect(control).not.toBeChecked();
    await userEvent.press(control);
    expect(control).toBeChecked();
    await userEvent.press(control);
    expect(control).not.toBeChecked();
  });

  test('desativado preserva o valor e bloqueia o callback', async () => {
    const onValueChange = jest.fn();
    const view = await render(<ThemeProvider><Switch label="Sincronizar" value disabled onValueChange={onValueChange} /></ThemeProvider>);
    const control = screen.getByRole('switch', { name: 'Sincronizar' });
    expect(control).toBeDisabled();
    expect(control).toBeChecked();
    await userEvent.press(control);
    expect(onValueChange).not.toHaveBeenCalled();
    await view.rerender(<ThemeProvider><Switch label="Sincronizar" value onValueChange={onValueChange} /></ThemeProvider>);
    await userEvent.press(screen.getByRole('switch', { name: 'Sincronizar' }));
    expect(onValueChange).toHaveBeenCalledWith(false);
  });

  test('sem etiqueta visível usa um nome acessível explícito', async () => {
    await render(<ThemeProvider><Switch accessibilityLabel="Modo silencioso" value={false} onValueChange={jest.fn()} /></ThemeProvider>);
    expect(screen.getByRole('switch', { name: 'Modo silencioso' })).toBeVisible();
    await expect(render(<ThemeProvider><Switch accessibilityLabel="  " value={false} onValueChange={jest.fn()} /></ThemeProvider>))
      .rejects.toThrow('Switch requer uma label ou accessibilityLabel não vazia.');
  });

  test('descrição e ajuda são apresentadas como uma única ajuda acessível', async () => {
    await render(<ThemeProvider><Switch label="Alertas" description="Avisar sobre alterações" accessibilityHint="Aplica-se imediatamente"
      value={false} onValueChange={jest.fn()} /></ThemeProvider>);
    expect(screen.getByHintText('Avisar sobre alterações. Aplica-se imediatamente')).toBe(screen.getByRole('switch', { name: 'Alertas' }));
  });

  test('mantém callbacks de foco e aplica o tema configurado', async () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const theme = { ...lightTheme, switch: { ...lightTheme.switch, label: '#123456' } };
    await render(<ThemeProvider themes={{ light: theme }}><Switch label="Ativo" value={false}
      onValueChange={jest.fn()} onFocus={onFocus} onBlur={onBlur} /></ThemeProvider>);
    const control = screen.getByRole('switch', { name: 'Ativo' });
    expect(screen.getByText('Ativo', { includeHiddenElements: true })).toHaveStyle({ color: '#123456' });
    await fireEvent(control, 'focus', { nativeEvent: {} });
    await fireEvent(control, 'blur', { nativeEvent: {} });
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  test('mantém o nome e a descrição num contentor estreito', async () => {
    const label = 'Receber atualizações sobre todas as intervenções atribuídas';
    const description = 'A preferência pode ser alterada a qualquer momento.';
    await render(<ThemeProvider><View style={{ width: 160 }}><Switch label={label} description={description}
      value={false} onValueChange={jest.fn()} /></View></ThemeProvider>);
    expect(screen.getByRole('switch', { name: label })).toBeVisible();
    expect(screen.getByHintText(description)).toBeVisible();
  });
});
