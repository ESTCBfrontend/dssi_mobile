import { describe, expect, jest, test } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { FormField } from './FormField';
import { TextField } from '../TextField';
import { lightTheme, ThemeProvider } from '../theme';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

describe('FormField', () => {
  test('compõe etiqueta obrigatória, ajuda e controlo acessível', async () => {
    await render(<ThemeProvider><FormField label="Número de ordem" required helperText="Consulta o documento de serviço">
      {props => <TextField {...props} value="" onChange={jest.fn()} />}
    </FormField></ThemeProvider>);
    expect(screen.getByText('Número de ordem', { exact: false })).toBeVisible();
    expect(screen.getByText('Consulta o documento de serviço')).toBeVisible();
    const input = screen.getByLabelText('Número de ordem, Obrigatório');
    expect(screen.getByHintText('Consulta o documento de serviço')).toBe(input);
  });

  test('mostra o erro em texto e encaminha-o para o TextField, substituindo a ajuda', async () => {
    const element = (error?: string) => <ThemeProvider><FormField label="Email" helperText="Usa o endereço profissional" error={error}>
      {props => <TextField {...props} value="a" onChange={jest.fn()} />}
    </FormField></ThemeProvider>;
    const view = await render(element());
    expect(screen.getByText('Usa o endereço profissional')).toBeVisible();
    await view.rerender(element('Introduz um endereço válido'));
    expect(screen.queryByText('Usa o endereço profissional')).toBeNull();
    expect(screen.getByText('Introduz um endereço válido')).toBeVisible();
    expect(screen.getByHintText('Introduz um endereço válido')).toBe(screen.getByLabelText('Email'));
    await view.rerender(element());
    expect(screen.queryByText('Introduz um endereço válido')).toBeNull();
    expect(screen.getByText('Usa o endereço profissional')).toBeVisible();
  });

  test('desativação é encaminhada para o controlo e não depende da cor', async () => {
    await render(<ThemeProvider><FormField label="Equipamento" disabled>
      {props => <TextField {...props} value="EQ-12" onChange={jest.fn()} />}
    </FormField></ThemeProvider>);
    expect(screen.getByLabelText('Equipamento')).toBeDisabled();
  });

  test('rejeita etiqueta e mensagem de erro vazias', async () => {
    const child = () => <View />;
    await expect(render(<ThemeProvider><FormField label=" ">{child}</FormField></ThemeProvider>))
      .rejects.toThrow('FormField requer uma label não vazia.');
    await expect(render(<ThemeProvider><FormField label="Nome" error=" ">{child}</FormField></ThemeProvider>))
      .rejects.toThrow('FormField requer uma mensagem de erro não vazia.');
  });

  test('permite personalização do tema e composição de outro tipo de controlo', async () => {
    const theme = { ...lightTheme, formField: { ...lightTheme.formField, label: '#102030' } };
    await render(<ThemeProvider themes={{ light: theme }}><FormField label="Opção" required requiredLabel="Required">
      {props => <Text accessibilityRole="checkbox" accessibilityLabel={props.accessibilityLabel}>Selecionar</Text>}
    </FormField></ThemeProvider>);
    expect(screen.getByText('Opção', { exact: false })).toHaveStyle({ color: '#102030' });
    expect(screen.getByRole('checkbox', { name: 'Opção, Required' })).toBeVisible();
  });

  test('conserva etiqueta e erro completos em contentor estreito', async () => {
    const label = 'Identificação completa do equipamento a intervencionar';
    const error = 'Confirma a identificação indicada antes de continuar';
    await render(<ThemeProvider><View style={{ width: 160 }}><FormField label={label} error={error}>
      {props => <TextField {...props} value="" onChange={jest.fn()} />}
    </FormField></View></ThemeProvider>);
    expect(screen.getByLabelText(label)).toBeVisible();
    expect(screen.getByText(error)).toBeVisible();
  });
});
