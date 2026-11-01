import { describe, expect, jest, test } from '@jest/globals';
import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Tabs, type TabsItem } from './Tabs';
import { TextField } from '../TextField';
import { ThemeProvider } from '../theme';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

const items: TabsItem[] = [
  { id: 'geral', label: 'Geral', content: <Text>Conteúdo geral</Text> },
  { id: 'equipa', label: 'Equipa', content: <Text>Conteúdo da equipa</Text>, count: 3 },
  { id: 'bloqueado', label: 'Bloqueado', content: <Text>Conteúdo bloqueado</Text>, disabled: true },
];

describe('Tabs', () => {
  test('seleção é controlada e só o painel correspondente fica visível', async () => {
    const onChange = jest.fn();
    const view = await render(<ThemeProvider><Tabs items={items} value="geral" onChange={onChange} /></ThemeProvider>);
    expect(screen.getByText('Conteúdo geral')).toBeTruthy(); expect(screen.queryByText('Conteúdo da equipa')).toBeNull();
    expect(screen.getByRole('tab', { name: 'Geral' }).props.accessibilityState.selected).toBe(true);
    await fireEvent.press(screen.getByRole('tab', { name: 'Equipa, 3' })); expect(onChange).toHaveBeenCalledWith('equipa');
    expect(screen.getByText('Conteúdo geral')).toBeTruthy();
    await fireEvent.press(screen.getByRole('tab', { name: 'Bloqueado' })); expect(onChange).toHaveBeenCalledTimes(1);
    await view.rerender(<ThemeProvider><Tabs items={items} value="equipa" onChange={onChange} /></ThemeProvider>);
    expect(screen.getByText('Conteúdo da equipa')).toBeTruthy(); expect(screen.queryByText('Conteúdo geral')).toBeNull();
    expect(screen.getByRole('tab', { name: 'Equipa, 3' }).props.accessibilityState.selected).toBe(true);
  });

  test('mantém o estado dos painéis quando keepMounted está ativo', async () => {
    function Editor() { const [value, setValue] = useState(''); return <TextField accessibilityLabel="Nota" value={value} onChange={setValue} />; }
    const localItems: TabsItem[] = [{ id: 'editor', label: 'Editor', content: <Editor /> }, { id: 'outro', label: 'Outro', content: <Text>Outro conteúdo</Text> }];
    const view = await render(<ThemeProvider><Tabs items={localItems} value="editor" onChange={jest.fn()} keepMounted /></ThemeProvider>);
    await fireEvent.changeText(screen.getByLabelText('Nota'), 'Guardado');
    await view.rerender(<ThemeProvider><Tabs items={localItems} value="outro" onChange={jest.fn()} keepMounted /></ThemeProvider>);
    expect(screen.queryByLabelText('Nota')).toBeNull(); expect(screen.getByText('Outro conteúdo')).toBeTruthy();
    await view.rerender(<ThemeProvider><Tabs items={localItems} value="editor" onChange={jest.fn()} keepMounted /></ThemeProvider>);
    expect(screen.getByLabelText('Nota')).toHaveDisplayValue('Guardado');
  });

  test('desmonta o painel inativo por omissão e volta a criar o estado local', async () => {
    function Editor() { const [value, setValue] = useState(''); return <TextField accessibilityLabel="Nota" value={value} onChange={setValue} />; }
    const localItems: TabsItem[] = [{ id: 'editor', label: 'Editor', content: <Editor /> }, { id: 'outro', label: 'Outro', content: <Text>Outro conteúdo</Text> }];
    const view = await render(<ThemeProvider><Tabs items={localItems} value="editor" onChange={jest.fn()} /></ThemeProvider>);
    await fireEvent.changeText(screen.getByLabelText('Nota'), 'Temporário');
    await view.rerender(<ThemeProvider><Tabs items={localItems} value="outro" onChange={jest.fn()} /></ThemeProvider>);
    await view.rerender(<ThemeProvider><Tabs items={localItems} value="editor" onChange={jest.fn()} /></ThemeProvider>);
    expect(screen.getByLabelText('Nota')).toHaveDisplayValue('');
  });

  test('os identificadores da associação são únicos entre conjuntos', async () => {
    await render(<ThemeProvider><Tabs items={items} value="geral" onChange={jest.fn()} /><Tabs items={items} value="geral" onChange={jest.fn()} /></ThemeProvider>);
    const tabs = screen.getAllByRole('tab', { name: 'Geral' });
    const panels = screen.getAllByText('Conteúdo geral').map(content => {
      let node: typeof content | null = content;
      while (node && node.props.role !== 'tabpanel') node = node.parent;
      return node;
    });
    expect(tabs[0].props.nativeID).not.toBe(tabs[1].props.nativeID);
    expect(panels).toHaveLength(2);
    expect(panels[0]?.props.accessibilityLabelledBy).toBe(tabs[0].props.nativeID);
    expect(panels[1]?.props.accessibilityLabelledBy).toBe(tabs[1].props.nativeID);
  });

  test('rejeita identificadores duplicados e valor inexistente', async () => {
    await expect(render(<ThemeProvider><Tabs items={[items[0], items[0]]} value="geral" onChange={jest.fn()} /></ThemeProvider>)).rejects.toThrow();
    await expect(render(<ThemeProvider><Tabs items={items} value="ausente" onChange={jest.fn()} /></ThemeProvider>)).rejects.toThrow();
  });
});
