import { describe, expect, jest, test } from '@jest/globals';
import { useState } from 'react';
import { fireEvent, render, screen, userEvent } from '@testing-library/react-native';
import { View } from 'react-native';
import { Radio } from './Radio';
import { lightTheme, ThemeProvider } from '../theme';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

describe('Radio', () => {
  test('opções controladas mantêm uma única seleção ao alterar o valor', async () => {
    function Example() {
      const [value, setValue] = useState('normal');
      return <>{(['normal', 'urgente'] as const).map(option => <Radio key={option} label={option}
        value={option} selected={value === option} onChange={setValue} />)}</>;
    }
    await render(<ThemeProvider><Example /></ThemeProvider>);
    const normal = screen.getByRole('radio', { name: 'normal' });
    const urgente = screen.getByRole('radio', { name: 'urgente' });
    expect(normal).toBeChecked();
    expect(urgente).not.toBeChecked();
    await userEvent.press(urgente);
    expect(urgente).toBeChecked();
    expect(normal).not.toBeChecked();
  });

  test('uma opção já selecionada não comunica uma mudança', async () => {
    const onChange = jest.fn();
    await render(<ThemeProvider><Radio label="Normal" value="normal" selected onChange={onChange} /></ThemeProvider>);
    await userEvent.press(screen.getByRole('radio', { name: 'Normal' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  test('opção desativada não pode ser selecionada e comunica o estado', async () => {
    const onChange = jest.fn();
    await render(<ThemeProvider><Radio label="Urgente" value="urgente" selected={false} disabled onChange={onChange} /></ThemeProvider>);
    const control = screen.getByRole('radio', { name: 'Urgente' });
    expect(control).toBeDisabled();
    await userEvent.press(control);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('a descrição é exposta como ajuda acessível', async () => {
    await render(<ThemeProvider><Radio label="Planeada" value="planeada" selected={false}
      description="Intervenção sem urgência" onChange={jest.fn()} /></ThemeProvider>);
    expect(screen.getByHintText('Intervenção sem urgência')).toBe(screen.getByRole('radio', { name: 'Planeada' }));
  });

  test('rejeita etiqueta vazia', async () => {
    await expect(render(<ThemeProvider><Radio label=" " value="x" selected={false} onChange={jest.fn()} /></ThemeProvider>))
      .rejects.toThrow('Radio requer uma label não vazia.');
  });

  test('mantém callbacks de foco e aceita outro tema', async () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const theme = { ...lightTheme, radio: { ...lightTheme.radio, label: '#123456' } };
    await render(<ThemeProvider themes={{ light: theme }}><Radio label="Normal" value="normal" selected={false}
      onChange={jest.fn()} onFocus={onFocus} onBlur={onBlur} /></ThemeProvider>);
    const control = screen.getByRole('radio', { name: 'Normal' });
    expect(screen.getByText('Normal', { includeHiddenElements: true })).toHaveStyle({ color: '#123456' });
    await fireEvent(control, 'focus', { nativeEvent: {} });
    await fireEvent(control, 'blur', { nativeEvent: {} });
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  test('mantém nome e descrição completos num espaço estreito', async () => {
    const label = 'Intervenção planeada com acompanhamento da equipa técnica';
    const description = 'A prioridade poderá ser ajustada pelo responsável antes do envio.';
    await render(<ThemeProvider><View style={{ width: 160 }}><Radio label={label} value="x" selected={false}
      description={description} onChange={jest.fn()} /></View></ThemeProvider>);
    expect(screen.getByRole('radio', { name: label })).toBeVisible();
    expect(screen.getByHintText(description)).toBeVisible();
  });
});
