import { expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { useState } from 'react';
import { TextInput } from 'react-native';
import { ThemeProvider } from '../theme';
import { PageLayout } from './PageLayout';
jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));
function Field() {
  const [value, setValue] = useState('');
  return <TextInput accessibilityLabel="Pesquisa" value={value} onChangeText={setValue} />;
}
test('aceita margens seguras e mantém o mesmo campo quando a largura muda', async () => {
  await render(<ThemeProvider><PageLayout title="Ordens" breadcrumbs="Gestão / Ordens" layout="wide" testID="page"
    safeAreaInsets={{ top: 10, bottom: 12 }}><Field /></PageLayout></ThemeProvider>);
  expect(screen.getByText('Gestão / Ordens')).toBeTruthy();
  expect(screen.getByTestId('page-content')).toHaveStyle({ paddingTop: 28, paddingBottom: 30 });
  await fireEvent.changeText(screen.getByLabelText('Pesquisa'), 'texto preservado');
  await fireEvent(screen.getByTestId('page'), 'layout', { nativeEvent: { layout: { width: 800, height: 600, x: 0, y: 0 } } });
  expect(screen.getByTestId('page-content')).toHaveStyle({ paddingTop: 38, paddingBottom: 40 });
  expect(screen.getByLabelText('Pesquisa').props.value).toBe('texto preservado');
});
test('apresenta texto simples nos espaços opcionais', async () => {
  await render(<ThemeProvider><PageLayout title="Página" scrollable={false} footer="Rodapé">Conteúdo</PageLayout></ThemeProvider>);
  expect(screen.getByText('Conteúdo')).toBeTruthy(); expect(screen.getByText('Rodapé')).toBeTruthy();
});
