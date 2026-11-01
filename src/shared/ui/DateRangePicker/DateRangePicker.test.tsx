import { expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ThemeProvider } from '../theme';
import { DateRangePicker } from './DateRangePicker';
import { formatDate } from '../PickerControl/dateTime';
jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));
jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react'); const { View } = require('react-native');
  return { __esModule: true, default: (props: object) => React.createElement(View, props) };
});
test('restringe cada extremo usando o outro sem alterar o valor fornecido', async () => {
  const change = jest.fn();
  await render(<ThemeProvider><DateRangePicker title="Período" value={{ start: '2026-11-12', end: '2026-11-14' }}
    onChange={change} testID="range" minDate="2026-01-01" maxDate="2026-12-31" /></ThemeProvider>);
  await fireEvent.press(screen.getByRole('button', { name: 'Data inicial' }));
  expect(formatDate(screen.getByTestId('range-start-native').props.maximumDate)).toBe('2026-11-14');
  expect(change).not.toHaveBeenCalled();
});
test('limpa o intervalo de uma vez e apresenta ordem inválida sem perder os valores', async () => {
  const change = jest.fn();
  await render(<ThemeProvider><DateRangePicker title="Período" value={{ start: '2026-11-12', end: '2026-11-14' }} onChange={change} /></ThemeProvider>);
  await fireEvent.press(screen.getByRole('button', { name: 'Limpar período' }));
  expect(change).toHaveBeenCalledWith({ start: null, end: null });
  await render(<ThemeProvider><DateRangePicker title="Outro período" value={{ start: '2026-11-14', end: '2026-11-12' }} onChange={change} /></ThemeProvider>);
  expect(screen.getByText('A data final deve ser igual ou posterior à data inicial.')).toBeTruthy();
});
