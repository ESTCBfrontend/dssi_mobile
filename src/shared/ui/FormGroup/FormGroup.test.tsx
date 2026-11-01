import { describe, expect, jest, test } from '@jest/globals';
import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { FormGroup } from './FormGroup';
import { FormField } from '../FormField';
import { TextField } from '../TextField';
import { Button } from '../Button';
import { lightTheme, ThemeProvider } from '../theme';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

describe('FormGroup', () => {
  test('compõe campos e ações independentes sem conteúdo de exemplo', async () => {
    const onPress = jest.fn();
    await render(<ThemeProvider><FormGroup title="Detalhes" description="Dados necessários" actions={<Button label="Continuar" onPress={onPress} />}
      secondary={<Text>Outro bloco</Text>}><FormField label="Cliente">{props => <TextField {...props} value="Ana" onChange={jest.fn()} />}</FormField></FormGroup></ThemeProvider>);
    expect(screen.getByRole('header', { name: 'Detalhes' })).toBeTruthy();
    expect(screen.getByLabelText('Cliente')).toHaveDisplayValue('Ana');
    expect(screen.getByText('Outro bloco')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('mantém a instância e valor dos campos ao mudar entre uma e duas colunas', async () => {
    const onLayout = jest.fn();
    function Fields() {
      const [value, setValue] = useState('');
      return <FormGroup testID="grupo" layout="twoColumns" onLayout={onLayout} secondary={<Text>Segundo bloco</Text>}>
        <TextField accessibilityLabel="Cliente" value={value} onChange={setValue} />
      </FormGroup>;
    }
    await render(<ThemeProvider><Fields /></ThemeProvider>);
    const field = screen.getByLabelText('Cliente');
    await fireEvent.changeText(field, 'Ana');
    await fireEvent(screen.getByTestId('grupo'), 'layout', { nativeEvent: { layout: { width: 700, height: 300, x: 0, y: 0 } } });
    expect(screen.getByLabelText('Cliente')).toBe(field);
    expect(field).toHaveDisplayValue('Ana');
    expect(field.parent?.parent?.parent).toHaveStyle({ flexDirection: 'row' });
    await fireEvent(screen.getByTestId('grupo'), 'layout', { nativeEvent: { layout: { width: 320, height: 300, x: 0, y: 0 } } });
    expect(field.parent?.parent?.parent).not.toHaveStyle({ flexDirection: 'row' });
    expect(field).toHaveDisplayValue('Ana');
    expect(onLayout).toHaveBeenCalledTimes(2);
  });

  test('respeita o tema e rejeita textos vazios quando fornecidos', async () => {
    const theme = { ...lightTheme, formGroup: { ...lightTheme.formGroup, background: '#abcdef' } };
    await render(<ThemeProvider themes={{ light: theme }}><FormGroup testID="grupo" /></ThemeProvider>);
    expect(screen.getByTestId('grupo')).toHaveStyle({ backgroundColor: '#abcdef' });
    await expect(render(<ThemeProvider><FormGroup title=" " /></ThemeProvider>)).rejects.toThrow();
    await expect(render(<ThemeProvider><FormGroup description=" " /></ThemeProvider>)).rejects.toThrow();
  });
});
