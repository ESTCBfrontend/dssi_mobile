import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Alert } from './Alert';
import { lightTheme, ThemeProvider } from '../theme';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

describe('Alert', () => {
  test('expõe o tipo e a mensagem num único alerta e mantém os botões independentes', async () => {
    const action = jest.fn(); const dismiss = jest.fn();
    await render(<ThemeProvider><Alert tone="danger" layout="detailed" title="Envio falhou" message="Tenta novamente."
      action={{ label: 'Repetir', onPress: action }} onDismiss={dismiss} /></ThemeProvider>);
    expect(screen.getByRole('alert', { name: 'Erro. Envio falhou. Tenta novamente.' })).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Repetir' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Fechar alerta' }));
    expect(action).toHaveBeenCalledTimes(1); expect(dismiss).toHaveBeenCalledTimes(1);
  });

  test('permite localizar nomes acessíveis e configurar anúncios', async () => {
    await render(<ThemeProvider><Alert tone="warning" title="Verificar" toneLabel="Attention" onDismiss={jest.fn()}
      dismissLabel="Dismiss" accessibilityLiveRegion="polite" /></ThemeProvider>);
    expect(screen.getByRole('alert', { name: 'Attention. Verificar' }).props.accessibilityLiveRegion).toBe('polite');
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeTruthy();
  });

  test('adapta o tema e apresenta texto extenso sem o ocultar', async () => {
    const theme = { ...lightTheme, alert: { ...lightTheme.alert, background: { ...lightTheme.alert.background, info: '#abcdef' } } };
    const title = 'A operação foi interrompida durante a sincronização de todos os relatórios pendentes';
    const view = await render(<ThemeProvider themes={{ light: theme }}><Alert title={title} testID="alerta" /></ThemeProvider>);
    expect(screen.getByTestId('alerta')).toHaveStyle({ backgroundColor: '#abcdef' });
    expect(screen.getByRole('alert', { name: `Informação. ${title}` })).toBeTruthy();
    expect(screen.getByText(title, { includeHiddenElements: true })).toBeTruthy();
    await view.unmount();
  });

  test('rejeita títulos ou mensagens incompatíveis com o layout', async () => {
    await expect(render(<ThemeProvider><Alert title=" " /></ThemeProvider>)).rejects.toThrow();
    await expect(render(<ThemeProvider><Alert title="Aviso" layout="detailed" /></ThemeProvider>)).rejects.toThrow();
    await expect(render(<ThemeProvider><Alert title="Aviso" message="Não ocultar" /></ThemeProvider>)).rejects.toThrow();
  });
});
