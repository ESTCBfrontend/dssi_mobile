import { describe, expect, jest, test } from '@jest/globals';
import { useState } from 'react';
import { fireEvent, render, screen, userEvent } from '@testing-library/react-native';
import { RadioGroup, type RadioGroupOption } from './RadioGroup';
import { lightTheme, ThemeProvider } from '../theme';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

const options: RadioGroupOption[] = [
  { value: 'low', label: 'Baixa' }, { value: 'normal', label: 'Normal', description: 'Prioridade habitual' },
  { value: 'high', label: 'Alta' }, { value: 'urgent', label: 'Urgente', disabled: true },
];

describe('RadioGroup', () => {
  test('admite valor ausente e permite selecionar apenas uma opção', async () => {
    function Example() {
      const [value, setValue] = useState<string | null>(null);
      return <RadioGroup label="Prioridade" options={options} value={value} onChange={setValue} />;
    }
    await render(<ThemeProvider><Example /></ThemeProvider>);
    const low = screen.getByRole('radio', { name: 'Baixa, Prioridade' });
    const normal = screen.getByRole('radio', { name: 'Normal, Prioridade' });
    expect(low).not.toBeChecked();
    expect(normal).not.toBeChecked();
    await userEvent.press(low);
    expect(low).toBeChecked();
    await userEvent.press(normal);
    expect(normal).toBeChecked();
    expect(low).not.toBeChecked();
    expect(screen.getByHintText('Prioridade habitual')).toBe(normal);
  });

  test('erro é texto visível e está disponível na ajuda acessível das opções', async () => {
    const view = await render(<ThemeProvider><RadioGroup label="Prioridade" options={options} value={null}
      error="Seleciona uma prioridade" onChange={jest.fn()} /></ThemeProvider>);
    expect(screen.getByText('Seleciona uma prioridade')).toBeVisible();
    expect(screen.getAllByHintText('Seleciona uma prioridade')).toContain(screen.getByRole('radio', { name: 'Baixa, Prioridade' }));
    await view.rerender(<ThemeProvider><RadioGroup label="Prioridade" options={options} value="low" onChange={jest.fn()} /></ThemeProvider>);
    expect(screen.queryByText('Seleciona uma prioridade')).toBeNull();
  });

  test('desativa opções individuais e todo o grupo sem comunicar alterações', async () => {
    const onChange = jest.fn();
    const view = await render(<ThemeProvider><RadioGroup label="Prioridade" options={options} value={null} onChange={onChange} /></ThemeProvider>);
    const urgent = screen.getByRole('radio', { name: 'Urgente, Prioridade' });
    expect(urgent).toBeDisabled();
    await userEvent.press(urgent);
    await view.rerender(<ThemeProvider><RadioGroup label="Prioridade" options={options} value={null} onChange={onChange} disabled /></ThemeProvider>);
    const low = screen.getByRole('radio', { name: 'Baixa, Prioridade' });
    expect(low).toBeDisabled();
    await userEvent.press(low);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('twoColumns adapta-se à largura real do contentor', async () => {
    await render(<ThemeProvider><RadioGroup testID="priority" label="Prioridade" layout="twoColumns"
      options={options} value={null} onChange={jest.fn()} /></ThemeProvider>);
    const group = screen.getByTestId('priority');
    const layout = () => group.queryAll(node => node.props.accessibilityRole === 'radiogroup')[0];
    await fireEvent.layout(group, { width: 320 });
    expect(layout()).toHaveStyle({ flexDirection: 'column' });
    await fireEvent.layout(group, { width: 600 });
    expect(layout()).toHaveStyle({ flexDirection: 'row' });
    expect(screen.getAllByRole('radio')).toHaveLength(4);
  });

  test('valores duplicados, etiqueta vazia e erro vazio são rejeitados', async () => {
    const repeated = [{ value: 'same', label: 'Um' }, { value: 'same', label: 'Dois' }];
    await expect(render(<ThemeProvider><RadioGroup label="Grupo" options={repeated} value={null} onChange={jest.fn()} /></ThemeProvider>))
      .rejects.toThrow('RadioGroup requer valores de opção únicos.');
    await expect(render(<ThemeProvider><RadioGroup label=" " options={[]} value={null} onChange={jest.fn()} /></ThemeProvider>))
      .rejects.toThrow('RadioGroup requer uma label não vazia.');
    await expect(render(<ThemeProvider><RadioGroup label="Grupo" options={[]} value={null} onChange={jest.fn()} error=" " /></ThemeProvider>))
      .rejects.toThrow('RadioGroup requer uma mensagem de erro não vazia.');
  });

  test('aceita lista vazia, personalização do tema e dados diferentes', async () => {
    const theme = { ...lightTheme, radioGroup: { ...lightTheme.radioGroup, background: '#f0f4f8' } };
    const view = await render(<ThemeProvider themes={{ light: theme }}><RadioGroup testID="group" label="Equipa"
      options={[]} value={null} onChange={jest.fn()} /></ThemeProvider>);
    expect(screen.getByTestId('group')).toHaveStyle({ backgroundColor: '#f0f4f8' });
    expect(screen.queryAllByRole('radio')).toHaveLength(0);
    await view.rerender(<ThemeProvider themes={{ light: theme }}><RadioGroup testID="group" label="Equipa"
      options={[{ value: 'a', label: 'Técnica de instalações' }]} value="a" onChange={jest.fn()} /></ThemeProvider>);
    expect(screen.getByRole('radio', { name: 'Técnica de instalações, Equipa' })).toBeChecked();
  });
});
