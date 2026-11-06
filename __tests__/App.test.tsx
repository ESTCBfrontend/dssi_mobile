import { expect, jest, test } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import App from '../App';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

test('apresenta a página inicial da aplicação', async () => {
  await render(<App />);
  expect(screen.getByRole('header', { name: 'DSSI Mobile' })).toBeTruthy();
});
