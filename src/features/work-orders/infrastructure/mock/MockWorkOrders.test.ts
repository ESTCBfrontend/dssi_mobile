import { afterEach, describe, expect, jest, test } from '@jest/globals';
import { MockWorkOrders } from './MockWorkOrders';
import { parseMockWorkOrders } from './parseMockWorkOrders';

afterEach(() => { jest.restoreAllMocks(); });

describe('ordens fictícias', () => {
  test('limita lista e detalhe ao técnico e conserva os dados de gestão e as outras consultas', async () => {
    const mock = new MockWorkOrders();
    const all = mock.getSnapshot().service;
    const reset = jest.fn(); mock.subscribeReset(reset);
    const technicians = mock.listTechnicians();
    expect(technicians.map(item => item.id)).toEqual(['mock-tech-1', 'TEC-1002']);
    technicians[0].name = 'alteração exterior';
    mock.selectTechnician('mock-tech-1');
    const first = mock.getSnapshot().service;
    expect(mock.getSnapshot().technicianLabel).toBe('João Almeida');
    expect((await first.list()).map(order => order.id)).toEqual(['mock-os-2', 'mock-os-5']);
    expect(await first.getById('mock-os-1')).toBeNull();
    expect(await first.getById('mock-os-4')).toBeNull();
    expect((await first.getById('mock-os-2'))?.id).toBe('mock-os-2');
    expect(() => mock.selectTechnician('desconhecido')).toThrow('desconhecido');
    expect(mock.getSnapshot().technicianId).toBe('mock-tech-1');
    mock.selectTechnician('TEC-1002');
    expect((await mock.getSnapshot().service.list()).map(order => order.id)).toEqual(['mock-os-4', 'mock-os-6']);
    expect(await mock.getSnapshot().service.getById('mock-os-2')).toBeNull();
    expect((await first.list()).map(order => order.id)).toEqual(['mock-os-2', 'mock-os-5']);
    expect(await all.list()).toHaveLength(7);
    expect(mock.listExamples()).toHaveLength(7);
    expect(mock.hasWorkOrder('mock-os-2')).toBe(true);
    expect(reset).not.toHaveBeenCalled();
    mock.selectTechnician(null);
    expect(await mock.getSnapshot().service.list()).toHaveLength(7);
    expect(new MockWorkOrders().getSnapshot().technicianId).toBeNull();
  });

  test('preserva o contexto nos cenários e isola respostas lentas entre técnicos', async () => {
    jest.useFakeTimers();
    try {
      const mock = new MockWorkOrders();
      mock.selectTechnician('mock-tech-1');
      mock.selectScenario('empty');
      expect(await mock.getSnapshot().service.list()).toEqual([]);
      mock.selectScenario('error');
      await expect(mock.getSnapshot().service.list()).rejects.toThrow('Erro simulado');
      mock.selectScenario('slow');
      const first = mock.getSnapshot().service.list();
      mock.selectTechnician('TEC-1002');
      const second = mock.getSnapshot().service.list();
      await jest.advanceTimersByTimeAsync(1200);
      expect((await first).map(order => order.id)).toEqual(['mock-os-2', 'mock-os-5']);
      expect((await second).map(order => order.id)).toEqual(['mock-os-4', 'mock-os-6']);
      mock.selectScenario('normal'); mock.clear(); mock.reset();
      expect(mock.getSnapshot().technicianId).toBe('TEC-1002');
      expect(await mock.getSnapshot().service.list()).toHaveLength(2);
    } finally { jest.useRealTimers(); }
  });

  test('consulta por identificador, devolve null para inexistente e isola os dados', async () => {
    const mock = new MockWorkOrders();
    const order = await mock.getById('mock-os-1');
    expect(order?.id).toBe('mock-os-1');
    if (order) order.client.name = 'alteração exterior';
    expect((await mock.getById('mock-os-1'))?.client.name).not.toBe('alteração exterior');
    expect(await mock.getById('inexistente')).toBeNull();
    mock.selectScenario('error');
    await expect(mock.getById('mock-os-1')).rejects.toThrow('Erro simulado');
  });
  test('adiciona um exemplo apenas uma vez e rejeita identificadores desconhecidos', async () => {
    const mock = new MockWorkOrders();
    mock.selectScenario('empty');
    const listener = jest.fn(); mock.subscribe(listener);
    const examples = mock.listExamples();
    examples[0].client.name = 'alteração exterior';
    expect(mock.addExample(examples[0].id)).toBe('added');
    expect(mock.addExample(examples[0].id)).toBe('existing');
    expect(listener).toHaveBeenCalledTimes(1);
    expect((await mock.list())[0].client.name).not.toBe('alteração exterior');
    expect(() => mock.addExample('desconhecida')).toThrow('não encontrado');
    expect(await mock.list()).toHaveLength(1);
  });
  test('evita duplicados, limpa e repõe dados isolados', async () => {
    const mock = new MockWorkOrders();
    const original = await mock.list();
    expect(original.length).toBeGreaterThan(0);
    original[0].client.name = 'alteração exterior';
    expect((await mock.list())[0].client.name).not.toBe('alteração exterior');
    expect(mock.addAll()).toEqual({ added: 0, skipped: original.length });
    mock.clear();
    expect(await mock.list()).toEqual([]);
    expect(mock.addAll()).toEqual({ added: original.length, skipped: 0 });
    mock.clear(); mock.reset();
    expect(await mock.list()).toHaveLength(original.length);
  });

  test('altera os cenários e notifica os consumidores', async () => {
    const mock = new MockWorkOrders();
    const listener = jest.fn(); const unsubscribe = mock.subscribe(listener);
    mock.selectScenario('empty'); expect(await mock.list()).toEqual([]);
    mock.selectScenario('error'); await expect(mock.list()).rejects.toThrow('Erro simulado');
    mock.selectScenario('normal'); expect((await mock.list()).length).toBeGreaterThan(0);
    expect(listener).toHaveBeenCalledTimes(3);
    unsubscribe(); mock.clear(); expect(listener).toHaveBeenCalledTimes(3);
  });

  test('simula latência e valida os exemplos', async () => {
    jest.useFakeTimers();
    try {
      const mock = new MockWorkOrders(); mock.selectScenario('slow');
      let finished = false; const pending = mock.list().then(() => { finished = true; });
      await jest.advanceTimersByTimeAsync(1199); expect(finished).toBe(false);
      await jest.advanceTimersByTimeAsync(1); await pending; expect(finished).toBe(true);
      expect(() => parseMockWorkOrders('{}')).toThrow('modelo provisório');
      expect(() => parseMockWorkOrders('inválido')).toThrow('JSON válido');
    } finally { jest.useRealTimers(); }
  });

  test('associa início e fim de pedidos concorrentes e regista a duração sem dados das ordens', async () => {
    jest.useFakeTimers();
    const output = jest.spyOn(console, 'log').mockImplementation(() => {});
    try {
      const mock = new MockWorkOrders(); mock.selectScenario('slow'); output.mockClear();
      const first = mock.list(); const second = mock.list();
      const starts = output.mock.calls.map(call => String(call[0]));
      const firstId = starts[0].match(/listar #(\d+)/)?.[1];
      const secondId = starts[1].match(/listar #(\d+)/)?.[1];
      expect(firstId).toBeDefined(); expect(secondId).toBeDefined(); expect(secondId).not.toBe(firstId);
      await jest.advanceTimersByTimeAsync(1200); await Promise.all([first, second]);
      const messages = output.mock.calls.map(call => String(call[0]));
      expect(messages[2]).toContain(`listar #${firstId} | sucesso`);
      expect(messages[3]).toContain(`listar #${secondId} | sucesso`);
      expect(messages[2]).toContain('duração: 1200 ms');
      expect(messages.join(' ')).not.toContain('Horizonte Azul');
    } finally { jest.useRealTimers(); }
  });

  test('regista o resultado da adição em conjunto e erro sem mensagens externas', async () => {
    const output = jest.spyOn(console, 'log').mockImplementation(() => {});
    const mock = new MockWorkOrders(); mock.clear(); output.mockClear();
    mock.addAll(); mock.addAll();
    const lines = output.mock.calls.map(call => String(call[0]));
    expect(lines.some(line => line.includes('adicionadas: 7 | existentes: 0'))).toBe(true);
    expect(lines.some(line => line.includes('adicionadas: 0 | existentes: 7'))).toBe(true);
    expect(lines.filter(line => line.includes('exemplo adicionado:'))).toHaveLength(7);
    mock.selectScenario('error'); output.mockClear();
    await expect(mock.list()).rejects.toThrow('Erro simulado');
    const messages = output.mock.calls.map(call => String(call[0]));
    expect(messages[0]).toMatch(/listar #\d+ \| iniciada/);
    expect(messages[1]).toMatch(/\[ERROR\].*listar #\d+ \| erro.*duração: \d+ ms/);
    expect(messages[1]).not.toContain('Erro simulado');
  });

  test('regista apenas o exemplo versionado efetivamente adicionado', () => {
    const output = jest.spyOn(console, 'log').mockImplementation(() => {});
    const mock = new MockWorkOrders(); mock.clear(); output.mockClear();
    const example = mock.listExamples()[0];
    example.description = 'alteração fornecida pelo consumidor';
    mock.addExample(example.id); mock.addExample(example.id);
    const fixtures = output.mock.calls.map(call => String(call[0])).filter(line => line.includes('exemplo adicionado:'));
    expect(fixtures).toHaveLength(1);
    expect(fixtures[0]).toContain(example.id);
    expect(fixtures[0]).not.toContain('alteração fornecida pelo consumidor');
  });
});
