import { describe, expect, jest, test } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { createConfiguredDataSource } from '../data-source/configuredDataSource';
import { DebugLayer } from './DebugLayer';
import { mockWorkOrders } from '../work-orders/mockWorkOrders';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

describe('Debug Menu', () => {
  test('abre, seleciona a origem e mantém a seleção após fechar', async () => {
    const selection = createConfiguredDataSource({ development: true, debugLayerEnabled: true });
    await render(<DebugLayer selection={selection} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Abrir ferramentas de desenvolvimento' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Origem de dados: API' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Ajuda sobre origem de dados' }));
    expect(screen.getByText(/API real ainda está indisponível/)).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'API, Origem de dados' }).props.accessibilityState.checked).toBe(true);
    await fireEvent.press(screen.getByRole('radio', { name: 'Mock, Origem de dados' }));
    expect(selection.source).toBe('mock');
    expect(screen.getByRole('radio', { name: 'Mock, Origem de dados' }).props.accessibilityState.checked).toBe(true);
    await fireEvent.press(screen.getByTestId('debug-sheet-backdrop', { includeHiddenElements: true }));
    expect(screen.getByRole('button', { name: 'Origem de dados: Mock' })).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Fechar ferramentas de desenvolvimento' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Abrir ferramentas de desenvolvimento' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Origem de dados: Mock' }));
    expect(screen.getByRole('radio', { name: 'Mock, Origem de dados' }).props.accessibilityState.checked).toBe(true);
  });

  test.each([[false, true], [true, false]])('não apresenta controlos com desenvolvimento=%s e flag=%s', async (development, debugLayerEnabled) => {
    const selection = createConfiguredDataSource({ development, debugLayerEnabled });
    await render(<DebugLayer selection={selection} />);
    expect(screen.queryByRole('button', { name: 'Abrir ferramentas de desenvolvimento' })).toBeNull();
  });

  test('disponibiliza controlos mock apenas na origem mock', async () => {
    mockWorkOrders.selectScenario('normal');
    const selection = createConfiguredDataSource({ development: true, debugLayerEnabled: true });
    await render(<DebugLayer selection={selection} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Abrir ferramentas de desenvolvimento' }));
    expect(screen.queryByRole('button', { name: 'Limpar ordens fictícias' })).toBeNull();
    await fireEvent.press(screen.getByRole('button', { name: 'Origem de dados: API' }));
    await fireEvent.press(screen.getByRole('radio', { name: 'Mock, Origem de dados' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Voltar' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Mocks de ordens' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Limpar ordens fictícias' }));
    expect(screen.getByText('Ordens fictícias removidas.')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Adicionar todos os exemplos' }));
    expect(screen.getByText(/Adicionadas: 7/)).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Cenário: Normal' }));
    await fireEvent.press(screen.getByRole('radio', { name: 'Vazio, Cenário de ordens' }));
    await fireEvent.press(screen.getByTestId('debug-sheet-backdrop', { includeHiddenElements: true }));
    expect(screen.getByText('Cenário alterado; dados repostos.')).toBeTruthy();
    await fireEvent.press(screen.getByTestId('debug-sheet-backdrop', { includeHiddenElements: true }));
    expect(screen.getByRole('button', { name: 'Mocks de ordens' })).toBeTruthy();
  }, 15000);

  test('substitui o toast imediatamente e reinicia os três segundos, mesmo para a mesma ação', async () => {
    const selection = createConfiguredDataSource({ development: true, debugLayerEnabled: true });
    await render(<DebugLayer selection={selection} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Abrir ferramentas de desenvolvimento' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Origem de dados: API' }));
    jest.useFakeTimers();
    try {
      await fireEvent.press(screen.getByRole('button', { name: 'Ajuda sobre origem de dados' }));
      expect(screen.getByText(/API real ainda está indisponível/)).toBeTruthy();
      await act(async () => { await jest.advanceTimersByTimeAsync(2000); });
      await fireEvent.press(screen.getByRole('radio', { name: 'Mock, Origem de dados' }));
      expect(screen.queryByText(/API real ainda está indisponível/)).toBeNull();
      expect(screen.getByText('Origem selecionada: Mock.')).toBeTruthy();
      await act(async () => { await jest.advanceTimersByTimeAsync(2000); });
      await fireEvent.press(screen.getByRole('radio', { name: 'Mock, Origem de dados' }));
      await fireEvent.press(screen.getByRole('button', { name: 'Voltar' }));
      await fireEvent.press(screen.getByRole('button', { name: 'Fechar ferramentas de desenvolvimento' }));
      expect(screen.getByText('Origem selecionada: Mock.')).toBeTruthy();
      await act(async () => { await jest.advanceTimersByTimeAsync(2999); });
      expect(screen.getByText('Origem selecionada: Mock.')).toBeTruthy();
      await act(async () => { await jest.advanceTimersByTimeAsync(1); });
      expect(screen.queryByText('Origem selecionada: Mock.')).toBeNull();
    } finally { jest.useRealTimers(); }
  }, 15000);

  test('gere intervenções no grupo próprio e mantém a navegação por níveis', async () => {
    mockWorkOrders.selectScenario('normal');
    const selection = createConfiguredDataSource({ configuredSource: 'mock', development: true, debugLayerEnabled: true });
    await render(<DebugLayer selection={selection} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Abrir ferramentas de desenvolvimento' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Mocks de intervenções' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Adicionar todas as intervenções' }));
    expect(screen.getByText('Adicionadas: 3. Existentes: 0. Sem ordem: 0.')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Adicionar todas as intervenções' }));
    expect(screen.getByText('Adicionadas: 0. Existentes: 3. Sem ordem: 0.')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Limpar intervenções fictícias' }));
    expect(screen.getByText('Intervenções removidas: 3.')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Adicionar intervenção' }));
    expect(screen.getByRole('header', { name: 'Adicionar intervenção' })).toBeTruthy();
    await fireEvent.press(screen.getByTestId('debug-sheet-backdrop', { includeHiddenElements: true }));
    expect(screen.getByRole('button', { name: 'Adicionar todas as intervenções' })).toBeTruthy();
  }, 15000);

  test('adiciona um exemplo de ordem e informa quando já existe', async () => {
    mockWorkOrders.selectScenario('empty');
    const selection = createConfiguredDataSource({ configuredSource: 'mock', development: true, debugLayerEnabled: true });
    await render(<DebugLayer selection={selection} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Abrir ferramentas de desenvolvimento' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Mocks de ordens' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Adicionar ordem' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Em execução · OS-EXEMPLO-004' }));
    expect(screen.getByText('Ordem adicionada.')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Em execução · OS-EXEMPLO-004' }));
    expect(screen.getByText('Esta ordem já existe.')).toBeTruthy();
    await fireEvent.press(screen.getByTestId('debug-sheet-backdrop', { includeHiddenElements: true }));
    expect(screen.getByRole('button', { name: 'Adicionar ordem' })).toBeTruthy();
  }, 15000);
});
