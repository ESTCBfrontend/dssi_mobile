import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ChecklistItem, type ChecklistEntry } from './ChecklistItem';
import { ThemeProvider } from '../theme';
jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));
const item: ChecklistEntry = { id: 'a', title: 'Verificar sensor', result: 'pending' };

describe('ChecklistItem', () => {
  test('permite escolha exclusiva sem alterar o resultado controlado', async () => {
    const change = jest.fn();
    await render(<ThemeProvider><ChecklistItem item={item} step="01" onChange={change} /></ThemeProvider>);
    await fireEvent.press(screen.getByRole('button', { name: 'Registar: Verificar sensor' }));
    expect(screen.getByRole('radio', { name: 'Por verificar, Resultado: Verificar sensor' }).props.accessibilityState.checked).toBe(true);
    await fireEvent.press(screen.getByRole('radio', { name: 'Não testado, Resultado: Verificar sensor' }));
    expect(change).toHaveBeenCalledWith('notTested'); expect(screen.getByText('Por verificar')).toBeTruthy();
  });
  test('distingue resultados e apresenta evidências fornecidas', async () => {
    const add = jest.fn();
    const view = await render(<ThemeProvider><ChecklistItem item={{ ...item, result: 'fail', note: 'Sensor avariado' }}
      step="01" evidence={<Text>Fotografia</Text>} onAddEvidence={add} /></ThemeProvider>);
    expect(screen.getByText('Não conforme')).toBeTruthy(); expect(screen.getByText('Sensor avariado')).toBeTruthy();
    expect(screen.getByText('Fotografia')).toBeTruthy(); await fireEvent.press(screen.getByRole('button', { name: 'Adicionar evidência' }));
    expect(add).toHaveBeenCalledTimes(1);
    await view.rerender(<ThemeProvider><ChecklistItem item={{ ...item, result: 'notTested' }} step="01" /></ThemeProvider>);
    expect(screen.getByText('Não testado')).toBeTruthy(); expect(screen.queryByText('Não conforme')).toBeNull();
  });
});
