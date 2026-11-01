import { describe, expect, jest, test } from '@jest/globals';
import { useState } from 'react';
import { fireEvent, render, screen, userEvent } from '@testing-library/react-native';
import { Textarea } from './Textarea';
import { FormField } from '../FormField';
import { lightTheme, ThemeProvider } from '../theme';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

describe('Textarea', () => {
  test('atualiza texto multilinha controlado sem perder foco e atualiza contador', async () => {
    const onBlur = jest.fn();
    function Form() {
      const [value, setValue] = useState('');
      return <Textarea accessibilityLabel="Observações" value={value} onChange={setValue} maxLength={20} showCounter onBlur={onBlur} />;
    }
    await render(<ThemeProvider><Form /></ThemeProvider>);
    const input = screen.getByLabelText('Observações');
    await userEvent.type(input, 'Texto', { skipBlur: true });
    expect(input).toHaveDisplayValue('Texto');
    expect(input.props.multiline).toBe(true);
    expect(screen.getByText('5 / 20', { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getByHintText('5 / 20')).toBe(input);
    expect(screen.getByLabelText('Observações')).toBe(input);
    expect(onBlur).not.toHaveBeenCalled();
  });

  test('cresce com o conteúdo e encaminha a notificação nativa', async () => {
    const onContentSizeChange = jest.fn();
    await render(<ThemeProvider><Textarea accessibilityLabel="Descrição" value="Texto" onChange={jest.fn()} onContentSizeChange={onContentSizeChange} /></ThemeProvider>);
    const input = screen.getByLabelText('Descrição');
    await fireEvent(input, 'contentSizeChange', { nativeEvent: { contentSize: { width: 200, height: 260 } } });
    expect(input).toHaveStyle({ minHeight: 260 });
    expect(onContentSizeChange).toHaveBeenCalledTimes(1);
    await fireEvent(input, 'contentSizeChange', { nativeEvent: { contentSize: { width: 200, height: 30 } } });
    expect(input).toHaveStyle({ minHeight: 30 });
  });

  test('compõe com FormField e comunica erro sem permitir edição quando desativado', async () => {
    const onChange = jest.fn();
    await render(<ThemeProvider><FormField label="Observações" error="Descrição obrigatória" disabled>
      {props => <Textarea {...props} value="" onChange={onChange} />}
    </FormField></ThemeProvider>);
    const input = screen.getByLabelText('Observações');
    expect(input).toBeDisabled();
    expect(screen.getByHintText('Descrição obrigatória')).toBe(input);
    expect(screen.getByText('Descrição obrigatória')).toBeTruthy();
    await fireEvent.changeText(input, 'Novo texto');
    expect(onChange).not.toHaveBeenCalled();
  });

  test('encaminha foco e desfoque e permite personalizar o tema', async () => {
    const onFocus = jest.fn(); const onBlur = jest.fn();
    const theme = { ...lightTheme, textarea: { ...lightTheme.textarea, fontSize: 17 } };
    await render(<ThemeProvider themes={{ light: theme }}><Textarea accessibilityLabel="Descrição" value="" onChange={jest.fn()}
      height="comfortable" onFocus={onFocus} onBlur={onBlur} /></ThemeProvider>);
    const input = screen.getByLabelText('Descrição');
    expect(input).toHaveStyle({ fontSize: 17 });
    await fireEvent(input, 'focus', { nativeEvent: {} });
    await fireEvent(input, 'blur', { nativeEvent: {} });
    expect(onFocus).toHaveBeenCalledTimes(1); expect(onBlur).toHaveBeenCalledTimes(1);
  });

  test('rejeita nome, erro e limite inválidos', async () => {
    await expect(render(<ThemeProvider><Textarea accessibilityLabel=" " value="" onChange={jest.fn()} /></ThemeProvider>)).rejects.toThrow();
    await expect(render(<ThemeProvider><Textarea accessibilityLabel="Nota" value="" onChange={jest.fn()} error=" " /></ThemeProvider>)).rejects.toThrow();
    await expect(render(<ThemeProvider><Textarea accessibilityLabel="Nota" value="" onChange={jest.fn()} maxLength={-1} /></ThemeProvider>)).rejects.toThrow();
  });
});
