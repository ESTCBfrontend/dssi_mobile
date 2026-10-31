import { describe, expect, jest, test } from '@jest/globals';
import { useState } from 'react';
import { fireEvent, render, screen, userEvent } from '@testing-library/react-native';
import { CheckboxGroup, type CheckboxGroupOption } from './CheckboxGroup';
import { lightTheme, ThemeProvider } from '../theme';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

const options: CheckboxGroupOption[] = [
  { value: 'visual', label: 'Inspeção visual' },
  { value: 'cables', label: 'Ligações elétricas', description: 'Confirma os conectores' },
  { value: 'filters', label: 'Filtros limpos' },
  { value: 'test', label: 'Teste funcional', disabled: true },
];

describe('CheckboxGroup', () => {
  test('permite várias escolhas independentes e preserva opções selecionadas', async () => {
    function Example() {
      const [values, setValues] = useState<string[]>([]);
      return <CheckboxGroup label="Verificações" options={options} values={values} onChange={setValues} />;
    }
    await render(<ThemeProvider><Example /></ThemeProvider>);
    const visual = screen.getByRole('checkbox', { name: 'Inspeção visual, Verificações' });
    const cables = screen.getByRole('checkbox', { name: 'Ligações elétricas, Verificações' });
    await userEvent.press(visual);
    await userEvent.press(cables);
    expect(visual).toBeChecked();
    expect(cables).toBeChecked();
    expect(screen.getByHintText('Confirma os conectores')).toBe(cables);
    await userEvent.press(visual);
    expect(visual).not.toBeChecked();
    expect(cables).toBeChecked();
  });

  test('preserva valores não presentes na lista ao mudar uma opção visível', async () => {
    const onChange = jest.fn();
    await render(<ThemeProvider><CheckboxGroup label="Verificações" options={options} values={['remoto']} onChange={onChange} /></ThemeProvider>);
    await userEvent.press(screen.getByRole('checkbox', { name: 'Inspeção visual, Verificações' }));
    expect(onChange).toHaveBeenCalledWith(['remoto', 'visual']);
  });

  test('erro substitui ajuda e é disponibilizado no texto e nas opções', async () => {
    const renderGroup = (error?: string) => <ThemeProvider><CheckboxGroup label="Verificações" options={options}
      values={[]} onChange={jest.fn()} helperText="Escolhe as opções aplicáveis" error={error} /></ThemeProvider>;
    const view = await render(renderGroup());
    expect(screen.getByText('Escolhe as opções aplicáveis')).toBeVisible();
    await view.rerender(renderGroup('Escolhe pelo menos uma opção'));
    expect(screen.queryByText('Escolhe as opções aplicáveis')).toBeNull();
    expect(screen.getByText('Escolhe pelo menos uma opção')).toBeVisible();
    expect(screen.getAllByHintText('Escolhe pelo menos uma opção')).toContain(screen.getByRole('checkbox', { name: 'Inspeção visual, Verificações' }));
    await view.rerender(renderGroup());
    expect(screen.queryByText('Escolhe pelo menos uma opção')).toBeNull();
  });

  test('opções individuais e grupo desativados não emitem alterações', async () => {
    const onChange = jest.fn();
    const view = await render(<ThemeProvider><CheckboxGroup label="Verificações" options={options} values={[]} onChange={onChange} /></ThemeProvider>);
    const disabledOption = screen.getByRole('checkbox', { name: 'Teste funcional, Verificações' });
    expect(disabledOption).toBeDisabled();
    await userEvent.press(disabledOption);
    await view.rerender(<ThemeProvider><CheckboxGroup label="Verificações" options={options} values={[]} onChange={onChange} disabled /></ThemeProvider>);
    const visual = screen.getByRole('checkbox', { name: 'Inspeção visual, Verificações' });
    expect(visual).toBeDisabled();
    await userEvent.press(visual);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('duas colunas dependem da largura real disponível', async () => {
    await render(<ThemeProvider><CheckboxGroup testID="group" label="Verificações" layout="twoColumns"
      options={options} values={[]} onChange={jest.fn()} /></ThemeProvider>);
    const group = screen.getByTestId('group');
    await fireEvent.layout(group, { width: 320 });
    expect(screen.getByTestId('group-options')).toHaveStyle({ flexDirection: 'column' });
    await fireEvent.layout(group, { width: 600 });
    expect(screen.getByTestId('group-options')).toHaveStyle({ flexDirection: 'row' });
    expect(screen.getAllByRole('checkbox')).toHaveLength(4);
  });

  test('rejeita identificadores duplicados e mensagens inválidas', async () => {
    const repeated = [{ value: 'x', label: 'Um' }, { value: 'x', label: 'Dois' }];
    await expect(render(<ThemeProvider><CheckboxGroup label="Grupo" options={repeated} values={[]} onChange={jest.fn()} /></ThemeProvider>))
      .rejects.toThrow('CheckboxGroup requer valores de opção únicos.');
    await expect(render(<ThemeProvider><CheckboxGroup label="Grupo" options={[]} values={['x', 'x']} onChange={jest.fn()} /></ThemeProvider>))
      .rejects.toThrow('CheckboxGroup requer valores selecionados únicos.');
    await expect(render(<ThemeProvider><CheckboxGroup label=" " options={[]} values={[]} onChange={jest.fn()} /></ThemeProvider>))
      .rejects.toThrow('CheckboxGroup requer uma label não vazia.');
    await expect(render(<ThemeProvider><CheckboxGroup label="Grupo" options={[]} values={[]} error=" " onChange={jest.fn()} /></ThemeProvider>))
      .rejects.toThrow('CheckboxGroup requer uma mensagem de erro não vazia.');
  });

  test('aceita lista vazia e personalização do tema', async () => {
    const theme = { ...lightTheme, checkboxGroup: { ...lightTheme.checkboxGroup, background: '#f0f4f8' } };
    await render(<ThemeProvider themes={{ light: theme }}><CheckboxGroup testID="group" label="Equipa"
      options={[]} values={[]} onChange={jest.fn()} /></ThemeProvider>);
    expect(screen.getByTestId('group')).toHaveStyle({ backgroundColor: '#f0f4f8' });
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
  });
});
