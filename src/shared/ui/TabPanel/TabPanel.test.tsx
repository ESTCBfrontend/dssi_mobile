import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { TabPanel } from './TabPanel';
import { Button } from '../Button';
import { ThemeProvider } from '../theme';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

describe('TabPanel', () => {
  test('apresenta conteúdo e ações independentes e associa o identificador do separador', async () => {
    const onPress = jest.fn();
    await render(<ThemeProvider><TabPanel id="painel-1" labelledBy="tab-1" title="Detalhes" description="Informação adicional"
      actions={<Button label="Editar" onPress={onPress} />} testID="painel"><Text>Conteúdo real</Text></TabPanel></ThemeProvider>);
    expect(screen.getByTestId('painel').props.accessibilityLabelledBy).toBe('tab-1');
    expect(screen.getByRole('header', { name: 'Detalhes' })).toBeTruthy();
    expect(screen.getByText('Conteúdo real')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Editar' })); expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('oculta conteúdo e ações quando inativo e pode desmontar o painel', async () => {
    const view = await render(<ThemeProvider><TabPanel id="p" testID="painel" active={false} keepMounted><Text>Oculto</Text></TabPanel></ThemeProvider>);
    expect(screen.queryByText('Oculto')).toBeNull();
    const hidden = screen.getByTestId('painel', { includeHiddenElements: true });
    expect(hidden).toHaveStyle({ display: 'none' });
    expect(hidden.props.importantForAccessibility).toBe('no-hide-descendants');
    expect(hidden.props.pointerEvents).toBe('none');
    await view.rerender(<ThemeProvider><TabPanel id="p"><Text>Visível</Text></TabPanel></ThemeProvider>);
    expect(screen.getByText('Visível')).toBeTruthy();
    await view.rerender(<ThemeProvider><TabPanel id="p" active={false}><Text>Desmontado</Text></TabPanel></ThemeProvider>);
    expect(screen.queryByText('Desmontado', { includeHiddenElements: true })).toBeNull();
  });
});
