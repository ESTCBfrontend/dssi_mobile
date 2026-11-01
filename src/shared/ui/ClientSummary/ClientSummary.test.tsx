import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ClientSummary, type ClientSummaryData } from './ClientSummary';
import { ThemeProvider } from '../theme';
jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));
const client: ClientSummaryData = { id: 'c1', name: 'Clínica Central' };
describe('ClientSummary', () => {
  test('apresenta os dados disponíveis sem inventar contactos ou ações', async () => {
    await render(<ThemeProvider><ClientSummary client={client} state="active" /></ThemeProvider>);
    expect(screen.getByText('Clínica Central')).toBeTruthy(); expect(screen.getByText('Ativo')).toBeTruthy();
    expect(screen.queryByText('Contacto')).toBeNull(); expect(screen.queryByRole('button')).toBeNull();
  });
  test('expõe campos acessíveis e encaminha o cliente na ação', async () => {
    const open = jest.fn(); const input = { ...client, contact: 'rececao@exemplo.pt', pending: 'Confirmar local' };
    await render(<ThemeProvider><ClientSummary client={input} state="review" onOpen={open} /></ThemeProvider>);
    expect(screen.getByLabelText('Contacto: rececao@exemplo.pt')).toBeTruthy(); expect(screen.getByText('Por validar')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Rever dados: Clínica Central' })); expect(open).toHaveBeenCalledWith(input);
  });
  test('permite personalizar campos, estado e texto', async () => {
    await render(<ThemeProvider><ClientSummary client={client} state="active" status={{ label: 'Validado', tone: 'info' }}
      extraFields={[{ label: 'Zona', value: 'Norte' }]} /></ThemeProvider>);
    expect(screen.getByText('Validado')).toBeTruthy(); expect(screen.getByLabelText('Zona: Norte')).toBeTruthy();
  });
});
