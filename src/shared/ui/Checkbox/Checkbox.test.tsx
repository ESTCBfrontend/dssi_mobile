import { describe, expect, jest, test } from '@jest/globals';
import { useState } from 'react';
import { fireEvent, render, screen, userEvent } from '@testing-library/react-native';
import { View } from 'react-native';
import { Checkbox } from './Checkbox';
import { lightTheme, ThemeProvider } from '../theme';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

describe('Checkbox', () => {
  test('comunica alterações e apresenta o estado controlado', async () => {
    function Example() {
      const [checked, setChecked] = useState(false);
      return <Checkbox label="Equipamento verificado" checked={checked} onChange={setChecked} />;
    }
    await render(<ThemeProvider><Example /></ThemeProvider>);
    const control = screen.getByRole('checkbox', { name: 'Equipamento verificado' });
    expect(control).not.toBeChecked();
    await userEvent.press(control);
    expect(control).toBeChecked();
    await userEvent.press(control);
    expect(control).not.toBeChecked();
  });

  test('estado misto é anunciado e ativação pede seleção', async () => {
    const onChange = jest.fn();
    await render(<ThemeProvider><Checkbox label="Selecionar todos" checked={false} indeterminate onChange={onChange} /></ThemeProvider>);
    const control = screen.getByRole('checkbox', { name: 'Selecionar todos' });
    expect(control.props.accessibilityState.checked).toBe('mixed');
    await userEvent.press(control);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  test('desativado não altera a seleção e comunica o estado', async () => {
    const onChange = jest.fn();
    await render(<ThemeProvider><Checkbox label="Confirmado" checked disabled onChange={onChange} /></ThemeProvider>);
    const control = screen.getByRole('checkbox', { name: 'Confirmado' });
    expect(control).toBeDisabled();
    expect(control).toBeChecked();
    await userEvent.press(control);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('a descrição acompanha o nome como ajuda acessível', async () => {
    await render(<ThemeProvider><Checkbox label="Aceitar" description="Confirma antes de continuar" checked={false} onChange={jest.fn()} /></ThemeProvider>);
    const control = screen.getByRole('checkbox', { name: 'Aceitar' });
    expect(screen.getByHintText('Confirma antes de continuar')).toBe(control);
    expect(screen.getByText('Confirma antes de continuar', { includeHiddenElements: true })).toBeTruthy();
  });

  test('rejeita uma etiqueta vazia', async () => {
    await expect(render(<ThemeProvider><Checkbox label="  " checked={false} onChange={jest.fn()} /></ThemeProvider>))
      .rejects.toThrow('Checkbox requer uma label não vazia.');
  });

  test('preserva callbacks de foco e personalização do tema', async () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const customTheme = { ...lightTheme, checkbox: { ...lightTheme.checkbox, label: '#123456' } };
    await render(<ThemeProvider themes={{ light: customTheme }}><Checkbox label="Enviar relatório" checked={false}
      onChange={jest.fn()} onFocus={onFocus} onBlur={onBlur} /></ThemeProvider>);
    const control = screen.getByRole('checkbox', { name: 'Enviar relatório' });
    expect(screen.getByText('Enviar relatório', { includeHiddenElements: true })).toHaveStyle({ color: '#123456' });
    await fireEvent(control, 'focus', { nativeEvent: {} });
    await fireEvent(control, 'blur', { nativeEvent: {} });
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  test('mantém etiqueta e descrição longas num contentor estreito', async () => {
    const label = 'Confirmar a verificação completa do equipamento instalado';
    const description = 'A confirmação é efetuada depois de consultar os elementos necessários.';
    await render(<ThemeProvider><View style={{ width: 160 }}><Checkbox label={label} description={description}
      checked={false} onChange={jest.fn()} /></View></ThemeProvider>);
    expect(screen.getByRole('checkbox', { name: label })).toBeVisible();
    expect(screen.getByHintText(description)).toBeVisible();
  });
});
