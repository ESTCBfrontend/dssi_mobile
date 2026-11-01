import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { EquipmentCard, type EquipmentCardData } from './EquipmentCard';
import { ThemeProvider, lightTheme } from '../theme';
jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));
const equipment: EquipmentCardData = { id: 'e1', reference: 'EQ-42', identifier: 'AVAC-42', location: 'Piso 2' };
describe('EquipmentCard', () => {
  test('apresenta dados recebidos e estado operacional', async () => {
    await render(<ThemeProvider><EquipmentCard equipment={equipment} state="operational" /></ThemeProvider>);
    expect(screen.getByText('Operacional')).toBeTruthy(); expect(screen.getByLabelText('Identificação: AVAC-42')).toBeTruthy();
    expect(screen.queryByText('Última inspeção')).toBeNull(); expect(screen.queryByRole('button')).toBeNull();
  });
  test('encaminha a ação de revisão e aceita tema configurado', async () => {
    const open = jest.fn(); const theme = { ...lightTheme, card: { ...lightTheme.card, background: '#abcdef' } };
    await render(<ThemeProvider themes={{ light: theme }}><EquipmentCard testID="equipment" equipment={{ ...equipment, issue: 'Sensor' }} state="needsService" onOpen={open} /></ThemeProvider>);
    expect(screen.getByTestId('equipment')).toHaveStyle({ backgroundColor: '#abcdef' });
    expect(screen.getByLabelText('Ocorrência: Sensor')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Ver ocorrência: EQ-42' })); expect(open).toHaveBeenCalledWith({ ...equipment, issue: 'Sensor' });
  });
  test('exige uma identificação e não admite strings vazias', async () => {
    await expect(render(<ThemeProvider><EquipmentCard equipment={{ ...equipment, identifier: ' ' }} state="operational" /></ThemeProvider>)).rejects.toThrow();
  });
});
