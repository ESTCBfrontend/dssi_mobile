import { describe, expect, jest, test } from '@jest/globals';
import { useState } from 'react';
import { fireEvent, render, screen, userEvent } from '@testing-library/react-native';
import { TextField } from './TextField';
import { lightTheme, ThemeProvider } from '../theme';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

describe('TextField', () => {
  test('atualiza o valor controlado sem perder o foco', async () => {
    const onBlur = jest.fn();
    function Form() {
      const [value, setValue] = useState('');
      return <TextField accessibilityLabel="Número de ordem" value={value} onChange={setValue} onBlur={onBlur} />;
    }
    await render(<ThemeProvider><Form /></ThemeProvider>);
    const input = screen.getByLabelText('Número de ordem');
    await userEvent.type(input, 'OS-42', { skipBlur: true });
    expect(input).toHaveDisplayValue('OS-42');
    expect(onBlur).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Número de ordem')).toBe(input);
  });

  test('campo desativado não recebe edições e pode voltar a ser editado', async () => {
    const onChange = jest.fn();
    const view = await render(<ThemeProvider><TextField accessibilityLabel="Equipamento" value="EQ-1" onChange={onChange} disabled /></ThemeProvider>);
    const input = screen.getByLabelText('Equipamento');
    expect(input).toBeDisabled();
    await fireEvent.changeText(input, 'EQ-2');
    expect(onChange).not.toHaveBeenCalled();
    await view.rerender(<ThemeProvider><TextField accessibilityLabel="Equipamento" value="EQ-1" onChange={onChange} /></ThemeProvider>);
    await fireEvent.changeText(screen.getByLabelText('Equipamento'), 'EQ-2');
    expect(onChange).toHaveBeenCalledWith('EQ-2');
  });

  test('expõe o erro junto da ajuda e rejeita mensagens vazias', async () => {
    await render(<ThemeProvider><TextField accessibilityLabel="Email" value="invalido" onChange={jest.fn()}
      error="Introduz um endereço válido" accessibilityHint="Obrigatório" /></ThemeProvider>);
    expect(screen.getByHintText('Introduz um endereço válido. Obrigatório')).toBe(screen.getByLabelText('Email'));
    await expect(render(<ThemeProvider><TextField accessibilityLabel="Email" value="" onChange={jest.fn()} error=" " /></ThemeProvider>))
      .rejects.toThrow('TextField requer uma mensagem de erro não vazia.');
  });

  test('exige nome acessível independente do placeholder', async () => {
    await expect(render(<ThemeProvider><TextField accessibilityLabel=" " placeholder="Exemplo" value="" onChange={jest.fn()} /></ThemeProvider>))
      .rejects.toThrow('TextField requer uma accessibilityLabel não vazia.');
  });

  test('preserva callbacks e o tipo de teclado fornecidos pelo consumidor', async () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    await render(<ThemeProvider><TextField accessibilityLabel="Email" keyboardType="email-address" autoCapitalize="none"
      value="" onChange={jest.fn()} onFocus={onFocus} onBlur={onBlur} /></ThemeProvider>);
    const input = screen.getByLabelText('Email');
    expect(input.props.keyboardType).toBe('email-address');
    expect(input.props.autoCapitalize).toBe('none');
    await fireEvent(input, 'focus', { nativeEvent: {} });
    await fireEvent(input, 'blur', { nativeEvent: {} });
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  test('respeita o tema e a personalização de texto', async () => {
    const theme = { ...lightTheme, textField: { ...lightTheme.textField, fontFamily: 'Inter-Medium' } };
    await render(<ThemeProvider themes={{ light: theme }}><TextField accessibilityLabel="Nome" value="Ana" onChange={jest.fn()} inputStyle={{ fontSize: 18 }} /></ThemeProvider>);
    expect(screen.getByLabelText('Nome')).toHaveStyle({ fontFamily: 'Inter-Medium', fontSize: 18 });
  });
});
