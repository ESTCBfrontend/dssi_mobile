import { describe, expect, jest, test } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { StyleSheet, View } from 'react-native';
import { ProgressBar } from './ProgressBar';
import { lightTheme, ThemeProvider } from '../theme';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

describe('ProgressBar', () => {
  test('usa a mesma percentagem para texto, preenchimento e acessibilidade', async () => {
    const view = await render(<ThemeProvider><ProgressBar label="Sincronização" value={5} min={2} max={8} /></ThemeProvider>);
    const progress = screen.getByRole('progressbar', { name: 'Sincronização' });
    expect(progress.props.accessibilityValue).toEqual({ min: 0, max: 100, now: 50, text: '50%' });
    expect(screen.getByText('50%', { includeHiddenElements: true })).toBeTruthy();
    expect(progress.queryAll(node => StyleSheet.flatten(node.props.style)?.width === '50%')).toHaveLength(1);
    await view.rerender(<ThemeProvider><ProgressBar label="Sincronização" value={8} min={2} max={8} status="complete" /></ThemeProvider>);
    const completed = screen.getByRole('progressbar', { name: 'Sincronização. Concluído' });
    expect(completed.props.accessibilityValue.now).toBe(100);
    expect(screen.getByText('100%', { includeHiddenElements: true })).toBeTruthy();
    expect(completed.queryAll(node => StyleSheet.flatten(node.props.style)?.width === '100%')).toHaveLength(1);
  });

  test('limita valores fora do intervalo sem apresentar percentagens impossíveis', async () => {
    const view = await render(<ThemeProvider><ProgressBar label="Envio" value={-5} /></ThemeProvider>);
    expect(screen.getByRole('progressbar', { name: 'Envio' }).props.accessibilityValue.now).toBe(0);
    await view.rerender(<ThemeProvider><ProgressBar label="Envio" value={150} /></ThemeProvider>);
    expect(screen.getByRole('progressbar', { name: 'Envio' }).props.accessibilityValue.now).toBe(100);
  });

  test('erro é comunicado em texto e pode ser localizado pelo consumidor', async () => {
    await render(<ThemeProvider><ProgressBar label="Envio" value={35} status="error" statusText="Falhou" /></ThemeProvider>);
    expect(screen.getByRole('progressbar', { name: 'Envio. Falhou' })).toBeVisible();
    expect(screen.getByText('Envio · Falhou', { includeHiddenElements: true })).toBeTruthy();
  });

  test('sem texto visível de percentagem continua acessível e não anuncia alterações por omissão', async () => {
    await render(<ThemeProvider><ProgressBar accessibilityLabel="Transferência" value={32} showValue={false} /></ThemeProvider>);
    const progress = screen.getByRole('progressbar', { name: 'Transferência' });
    expect(progress.props.accessibilityValue.now).toBe(32);
    expect(progress.props.accessibilityLiveRegion).toBe('none');
    expect(screen.queryByText('32%', { includeHiddenElements: true })).toBeNull();
  });

  test('rejeita intervalos inválidos, nome vazio e conclusão inconsistente', async () => {
    for (const input of [{ value: NaN }, { value: 10, min: 1, max: 1 }, { value: 10, min: 5, max: 2 }]) {
      await expect(render(<ThemeProvider><ProgressBar label="Envio" {...input} /></ThemeProvider>))
        .rejects.toThrow('ProgressBar requer valores finitos e max maior que min.');
    }
    await expect(render(<ThemeProvider><ProgressBar accessibilityLabel=" " value={0} /></ThemeProvider>))
      .rejects.toThrow('ProgressBar requer uma label ou accessibilityLabel não vazia.');
    await expect(render(<ThemeProvider><ProgressBar label="Envio" value={50} status="complete" /></ThemeProvider>))
      .rejects.toThrow('ProgressBar complete requer o valor máximo.');
  });

  test('respeita o tema e mantém texto longo num contentor estreito', async () => {
    const label = 'Enviar todos os relatórios pendentes desta intervenção';
    const theme = { ...lightTheme, progressBar: { ...lightTheme.progressBar, background: '#f0f4f8' } };
    await render(<ThemeProvider themes={{ light: theme }}><View style={{ width: 150 }}>
      <ProgressBar label={label} value={45} />
    </View></ThemeProvider>);
    const progress = screen.getByRole('progressbar', { name: label });
    expect(progress).toHaveStyle({ backgroundColor: '#f0f4f8' });
    expect(screen.getByText(label, { includeHiddenElements: true })).toBeTruthy();
  });
});
