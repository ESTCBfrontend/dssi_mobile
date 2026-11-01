import { expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Platform } from 'react-native';
import { ThemeProvider } from '../theme';
import { TimePicker } from './TimePicker';
import { isTime } from '../PickerControl/dateTime';
jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));
jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react'); const { View } = require('react-native');
  return { __esModule: true, default: (props: object) => React.createElement(View, props) };
});
test('apresenta apenas horários fornecidos dentro dos limites e permite escolher', async () => {
  const change = jest.fn();
  await render(<ThemeProvider><TimePicker label="Hora" value={null} onChange={change}
    availableSlots={['08:00', '09:00', '10:00']} minTime="09:00" maxTime="10:00" /></ThemeProvider>);
  await fireEvent.press(screen.getByRole('button', { name: 'Hora' }));
  expect(screen.queryByRole('radio', { name: '08:00' })).toBeNull();
  await fireEvent.press(screen.getByRole('radio', { name: '09:00' }));
  expect(change).toHaveBeenCalledWith('09:00');
  expect(isTime('24:00')).toBe(false);
});
test('recusa uma hora nativa fora dos limites sem alterar o valor', async () => {
  const change = jest.fn();
  await render(<ThemeProvider><TimePicker label="Hora" value="09:00" onChange={change}
    minTime="09:00" maxTime="17:00" testID="time" /></ThemeProvider>);
  await fireEvent.press(screen.getByRole('button', { name: 'Hora' }));
  await fireEvent(screen.getByTestId('time-native'), 'change', { type: 'set' }, new Date(2026, 10, 12, 8, 0));
  if (Platform.OS === 'ios') await fireEvent.press(screen.getByRole('button', { name: 'Confirmar' }));
  expect(change).not.toHaveBeenCalled();
  expect(screen.getAllByText('Esta hora não está disponível.').length).toBeGreaterThan(0);
});
