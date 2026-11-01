import { expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ThemeProvider } from '../theme';
import { UserSelector } from './UserSelector';
jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

test('filtra por equipa explícita e preserva nome do valor que ficou fora da lista', async () => {
  const change = jest.fn();
  await render(<ThemeProvider><UserSelector users={[
    { id: 'u1', name: 'Ana', teamIds: ['a'], statusLabel: 'Disponível' },
    { id: 'u2', name: 'Bruno', teamIds: ['b'] },
    { id: 'u3', name: 'Carla' },
  ]} teamId="a" value="u2" onChange={change} /></ThemeProvider>);
  expect(screen.getByRole('button', { name: 'Técnico' }).props.accessibilityValue.text).toBe('Bruno');
  await fireEvent.press(screen.getByRole('button', { name: 'Técnico' }));
  expect(screen.getByRole('radio', { name: 'Ana' })).toBeTruthy();
  expect(screen.queryByRole('radio', { name: 'Bruno' })).toBeNull();
  expect(screen.queryByRole('radio', { name: 'Carla' })).toBeNull();
  expect(change).not.toHaveBeenCalled();
  await fireEvent.press(screen.getByRole('radio', { name: 'Ana' }));
  expect(change).toHaveBeenCalledWith('u1');
});
