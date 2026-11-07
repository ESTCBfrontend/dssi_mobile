import { describe, expect, it, jest } from '@jest/globals';
import { createConfiguredDataSource } from './configuredDataSource';

describe('origem de dados', () => {
  it('usa API por defeito e rejeita configurações inválidas', () => {
    expect(createConfiguredDataSource({ development: true, debugLayerEnabled: true }).source).toBe('api');
    expect(() => createConfiguredDataSource({ configuredSource: 'inválida', development: true, debugLayerEnabled: true })).toThrow('Origem de dados inválida');
  });

  it('notifica alterações temporárias apenas em desenvolvimento com a flag ativa', () => {
    const selection = createConfiguredDataSource({ development: true, debugLayerEnabled: true });
    const listener = jest.fn();
    const unsubscribe = selection.subscribe(listener);
    selection.select('mock');
    selection.select('mock');
    expect(selection.getSnapshot()).toBe('mock');
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    selection.select('api');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it.each([[false, true], [true, false], [false, false]])('impede a seleção com desenvolvimento=%s e flag=%s', (development, debugLayerEnabled) => {
    const selection = createConfiguredDataSource({ configuredSource: 'mock', development, debugLayerEnabled });
    expect(selection.source).toBe('mock');
    expect(selection.canSelect).toBe(false);
    expect(() => selection.select('api')).toThrow('não está disponível');
  });
});
