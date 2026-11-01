import { describe, expect, jest, test } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { StatusBadge, type StatusBadgeIconProps } from './StatusBadge';
import { lightTheme, ThemeProvider } from '../theme';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

describe('StatusBadge', () => {
  test('apresenta um estado livre como informação, sem criar uma ação', async () => {
    await render(<ThemeProvider><StatusBadge label="A aguardar confirmação do fornecedor" /></ThemeProvider>);
    expect(screen.getByRole('text', { name: 'A aguardar confirmação do fornecedor' })).toBeVisible();
    expect(screen.queryByRole('button')).toBeNull();
  });

  test('atualiza texto e apresentação quando o consumidor altera o estado', async () => {
    const view = await render(<ThemeProvider><StatusBadge label="Em preparação" tone="info" /></ThemeProvider>);
    await view.rerender(<ThemeProvider><StatusBadge label="Concluído" tone="success" variant="solid" /></ThemeProvider>);
    expect(screen.queryByRole('text', { name: 'Em preparação' })).toBeNull();
    expect(screen.getByRole('text', { name: 'Concluído' })).toHaveStyle({ backgroundColor: lightTheme.statusBadge.tones.success.solid.background });
    expect(screen.getByText('Concluído')).toHaveStyle({ color: lightTheme.statusBadge.tones.success.solid.text });
  });

  test('ponto e ícone são decorativos e não alteram o nome anunciado', async () => {
    const icon = jest.fn(({ color, size }: StatusBadgeIconProps) => <Text style={{ color, fontSize: size }}>✓</Text>);
    const view = await render(<ThemeProvider><StatusBadge label="Verificado" tone="success" showDot /></ThemeProvider>);
    expect(screen.getByRole('text', { name: 'Verificado' })).toBeVisible();
    await view.rerender(<ThemeProvider><StatusBadge label="Verificado" tone="success" showDot icon={icon} accessibilityLabel="Equipamento verificado" /></ThemeProvider>);
    expect(screen.getByRole('text', { name: 'Equipamento verificado' })).toBeVisible();
    expect(screen.queryByText('✓')).toBeNull();
    expect(icon).toHaveBeenCalledWith({ color: lightTheme.statusBadge.tones.success.soft.text, size: lightTheme.statusBadge.sizes.medium.iconSize });
    expect(screen.queryByRole('button')).toBeNull();
  });

  test('usa a paleta fornecida pelo tema e aceita personalização local', async () => {
    const customTheme = {
      ...lightTheme,
      statusBadge: {
        ...lightTheme.statusBadge,
        tones: {
          ...lightTheme.statusBadge.tones,
          info: { ...lightTheme.statusBadge.tones.info, soft: { background: '#102030', text: '#ffffff' } },
        },
      },
    };
    await render(
      <ThemeProvider themes={{ light: lightTheme, dark: customTheme }} mode="dark">
        <StatusBadge label="Agendado" tone="info" style={{ marginTop: 8 }} textStyle={{ fontSize: 16 }} />
      </ThemeProvider>,
    );
    expect(screen.getByRole('text', { name: 'Agendado' })).toHaveStyle({ backgroundColor: '#102030', marginTop: 8 });
    expect(screen.getByText('Agendado')).toHaveStyle({ color: '#ffffff', fontSize: 16 });
  });

  test('conserva todo o rótulo numa composição estreita com conteúdo variável', async () => {
    const label = 'Intervenção concluída e a aguardar revisão do responsável técnico';
    await render(<ThemeProvider><View style={{ width: 160 }}><StatusBadge label={label} size="small" showDot /></View></ThemeProvider>);
    expect(screen.getByRole('text', { name: label })).toBeVisible();
    expect(screen.getByText(label)).toHaveTextContent(label);
  });

  test('rejeita um rótulo vazio para não comunicar o estado apenas pela cor', async () => {
    await expect(render(<ThemeProvider><StatusBadge label="  " tone="danger" /></ThemeProvider>))
      .rejects.toThrow('StatusBadge requer uma label não vazia.');
  });

  test('as dez paletas iniciais mantêm contraste mínimo de 4,5:1 para o texto', () => {
    const luminance = (hex: string) => {
      const rgb = [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16) / 255)
        .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
      return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    };
    for (const palettes of Object.values(lightTheme.statusBadge.tones)) {
      for (const palette of Object.values(palettes)) {
        const values = [luminance(palette.background), luminance(palette.text)].sort((a, b) => b - a);
        expect((values[0] + 0.05) / (values[1] + 0.05)).toBeGreaterThanOrEqual(4.5);
      }
    }
  });
});
