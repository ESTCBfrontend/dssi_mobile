import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Platform } from 'react-native';
import { ThemeProvider } from '../theme';
import { DatePicker } from './DatePicker';
import { formatDate, parseDate } from '../PickerControl/dateTime';
jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));
jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react'); const { View } = require('react-native');
  return { __esModule: true, default: (props: object) => React.createElement(View, props) };
});

describe('DatePicker', () => {
  test('preserva datas de calendário sem conversão UTC e rejeita datas inválidas', () => {
    expect(formatDate(parseDate('2024-02-29')!)).toBe('2024-02-29');
    expect(parseDate('2023-02-29')).toBeNull();
    expect(parseDate('2024-13-01')).toBeNull();
  });
  test('rejeita datas indisponíveis e não altera o valor controlado', async () => {
    const change = jest.fn();
    await render(<ThemeProvider><DatePicker label="Data" value="2026-11-12" onChange={change}
      disabledDates={['2026-11-13']} testID="date" /></ThemeProvider>);
    await fireEvent.press(screen.getByRole('button', { name: 'Data' }));
    await fireEvent(screen.getByTestId('date-native'), 'change', { type: 'set' }, new Date(2026, 10, 13, 12));
    if (Platform.OS === 'ios') await fireEvent.press(screen.getByRole('button', { name: 'Confirmar' }));
    expect(change).not.toHaveBeenCalled();
    expect(screen.getAllByText('Esta data não está disponível.').length).toBeGreaterThan(0);
  });
  test('limpa o valor por pedido explícito', async () => {
    const change = jest.fn();
    await render(<ThemeProvider><DatePicker label="Data" value="2026-11-12" onChange={change} clearable /></ThemeProvider>);
    await fireEvent.press(screen.getByRole('button', { name: 'Limpar data' }));
    expect(change).toHaveBeenCalledWith(null);
  });
  test('encaminha os limites e aceita uma data válida', async () => {
    const change = jest.fn();
    await render(<ThemeProvider><DatePicker label="Data" value={null} onChange={change}
      minDate="2026-01-01" maxDate="2026-12-31" testID="date" /></ThemeProvider>);
    await fireEvent.press(screen.getByRole('button', { name: 'Data' }));
    const picker = screen.getByTestId('date-native');
    expect(formatDate(picker.props.minimumDate)).toBe('2026-01-01');
    expect(formatDate(picker.props.maximumDate)).toBe('2026-12-31');
    await fireEvent(picker, 'change', { type: 'set' }, new Date(2026, 10, 12, 12));
    if (Platform.OS === 'ios') await fireEvent.press(screen.getByRole('button', { name: 'Confirmar' }));
    expect(change).toHaveBeenCalledWith('2026-11-12');
  });
});
