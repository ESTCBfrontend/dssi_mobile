import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Checklist } from './Checklist';
import { ThemeProvider } from '../theme';
import type { ChecklistEntry } from '../ChecklistItem';
jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));
const items: ChecklistEntry[] = [{ id: '1', title: 'Sensor', result: 'pass' }, { id: '2', title: 'Comando', result: 'fail' }];

describe('Checklist', () => {
  test('calcula progresso da lista e da regra fornecida e encaminha ações', async () => {
    const change = jest.fn(); const save = jest.fn(); const submit = jest.fn();
    const view = await render(<ThemeProvider><Checklist title="Manutenção" items={items} isCompleted={item => item.result === 'pass'}
      onItemChange={change} onSave={save} onSubmit={submit} /></ThemeProvider>);
    expect(screen.getByText('1 de 2')).toBeTruthy(); expect(screen.getByText('2 pontos')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Editar: Comando' }));
    await fireEvent.press(screen.getByRole('radio', { name: 'Conforme, Resultado: Comando' }));
    expect(change).toHaveBeenCalledWith('2', 'pass');
    await fireEvent.press(screen.getByRole('button', { name: 'Guardar rascunho' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Submeter checklist' }));
    expect(save).toHaveBeenCalledTimes(1); expect(submit).toHaveBeenCalledTimes(1);
    await view.rerender(<ThemeProvider><Checklist title="Manutenção" items={items} isCompleted={item => item.result !== 'pending'} /></ThemeProvider>);
    expect(screen.getByText('2 de 2')).toBeTruthy();
  });
  test('mostra lista vazia e rejeita identificadores duplicados', async () => {
    await render(<ThemeProvider><Checklist title="Manutenção" items={[]} isCompleted={() => false} /></ThemeProvider>);
    expect(screen.getByText('Sem pontos de verificação.')).toBeTruthy();
    await expect(render(<ThemeProvider><Checklist title="Manutenção" items={[items[0], items[0]]} isCompleted={() => false} /></ThemeProvider>)).rejects.toThrow();
  });
});
