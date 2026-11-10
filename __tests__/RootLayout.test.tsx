import { expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { focusManager } from '@tanstack/react-query';
import { AppState, type AppStateStatus } from 'react-native';
import RootLayout from '../src/app/_layout';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));
jest.mock('expo-router', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const { useQueryClient } = require('@tanstack/react-query');
  return { Stack: () => React.createElement(Text, null, useQueryClient() ? 'Rota disponível' : 'Sem dados') };
});

test('disponibiliza o cliente de dados à rota e mantém o menu de desenvolvimento acessível', async () => {
  await render(<RootLayout />);
  expect(screen.getByRole('header', { name: 'Aceder à sua conta' })).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Abrir ferramentas de desenvolvimento' }));
  expect(screen.getByText('Ferramentas de desenvolvimento')).toBeTruthy();
});

test('comunica ao gestor de dados a passagem da aplicação para segundo plano e o regresso', async () => {
  let onChange: ((state: AppStateStatus) => void) | undefined;
  const listener = jest.spyOn(AppState, 'addEventListener').mockImplementation((_event, callback) => {
    onChange = callback;
    return { remove: jest.fn() };
  });
  const focus = jest.spyOn(focusManager, 'setFocused');
  try {
    await render(<RootLayout />);
    onChange?.('background');
    onChange?.('active');
    expect(focus).toHaveBeenCalledWith(false);
    expect(focus).toHaveBeenCalledWith(true);
  } finally {
    listener.mockRestore();
    focus.mockRestore();
  }
});
