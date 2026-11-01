import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ServiceOrderCard, type ServiceOrderCardData } from './ServiceOrderCard';
import { ThemeProvider } from '../theme';
jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));
const order: ServiceOrderCardData = { id: 'o1', reference: 'OS-42', scheduledAt: '12/11/2026 · 09:30', clientName: 'Clínica Central' };
describe('ServiceOrderCard', () => {
  test('apresenta a data fornecida sem a interpretar e não inventa dados', async () => {
    await render(<ThemeProvider><ServiceOrderCard order={order} state="planned" /></ThemeProvider>);
    expect(screen.getByText('Planeada')).toBeTruthy(); expect(screen.getByLabelText('Agendamento: 12/11/2026 · 09:30')).toBeTruthy();
    expect(screen.queryByText('Equipa')).toBeNull(); expect(screen.queryByRole('button')).toBeNull();
  });
  test('mostra variante ativa e delega a ação ao consumidor', async () => {
    const open = jest.fn();
    await render(<ThemeProvider><ServiceOrderCard order={order} state="active" onOpen={open} /></ThemeProvider>);
    expect(screen.getByText('Em execução')).toBeTruthy(); await fireEvent.press(screen.getByRole('button', { name: 'Acompanhar: OS-42' }));
    expect(open).toHaveBeenCalledWith(order);
  });
  test('rejeita identificação em falta', async () => {
    await expect(render(<ThemeProvider><ServiceOrderCard order={{ ...order, id: ' ' }} state="planned" /></ThemeProvider>)).rejects.toThrow();
  });
  test('reflete alterações dos dados e entrega a versão atualizada no callback', async () => {
    const open = jest.fn();
    const view = await render(<ThemeProvider><ServiceOrderCard order={order} state="planned" onOpen={open} /></ThemeProvider>);
    const updated = { ...order, clientName: 'Outro cliente', responsible: 'Ana' };
    await view.rerender(<ThemeProvider><ServiceOrderCard order={updated} state="active" onOpen={open} /></ThemeProvider>);
    expect(screen.getByLabelText('Cliente: Outro cliente')).toBeTruthy();
    expect(screen.getByLabelText('Responsável: Ana')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Acompanhar: OS-42' })); expect(open).toHaveBeenCalledWith(updated);
  });
});
