import { afterEach, describe, expect, jest, test } from '@jest/globals';
import { MockWorkOrders } from '../../../work-orders/infrastructure/mock/MockWorkOrders';
import { MockInterventions } from './MockInterventions';
import { parseMockInterventions } from './parseMockInterventions';

afterEach(() => { jest.restoreAllMocks(); });

function setup() {
  const orders = new MockWorkOrders();
  const interventions = new MockInterventions(id => orders.hasWorkOrder(id));
  orders.subscribeReset(() => interventions.clear());
  return { orders, interventions };
}

describe('intervenções fictícias', () => {
  test('valida ordem associada e evita duplicados', () => {
    const { orders, interventions } = setup();
    orders.selectScenario('empty');
    expect(interventions.addAll()).toEqual({ added: 0, existing: 0, missingOrder: 3 });
    orders.addAll();
    expect(interventions.addAll()).toEqual({ added: 3, existing: 0, missingOrder: 0 });
    expect(interventions.addAll()).toEqual({ added: 0, existing: 3, missingOrder: 0 });
    expect(() => interventions.addExample('desconhecida')).toThrow('não encontrado');
  });

  test('uma ordem adicionada individualmente permite apenas as intervenções associadas', async () => {
    const { orders, interventions } = setup();
    orders.selectScenario('empty');
    expect(orders.addExample('mock-os-4')).toBe('added');
    expect(interventions.addAll()).toEqual({ added: 2, existing: 0, missingOrder: 1 });
    expect(await interventions.listByWorkOrder('mock-os-4')).toHaveLength(2);
    expect(orders.addExample('mock-os-3')).toBe('added');
    expect(interventions.addAll()).toEqual({ added: 1, existing: 2, missingOrder: 0 });
    expect(await interventions.listByWorkOrder('mock-os-4')).toHaveLength(2);
  });

  test('só regista o JSON do exemplo depois de ser adicionado', () => {
    const output = jest.spyOn(console, 'log').mockImplementation(() => {});
    const { orders, interventions } = setup(); orders.selectScenario('empty'); output.mockClear();
    const example = interventions.listExamples()[0];
    expect(interventions.addExample(example.id)).toBe('missing-order');
    expect(output.mock.calls.some(call => String(call[0]).includes('exemplo adicionado:'))).toBe(false);
    orders.addExample(example.workOrderId); output.mockClear();
    expect(interventions.addExample(example.id)).toBe('added');
    expect(interventions.addExample(example.id)).toBe('existing');
    const fixtures = output.mock.calls.map(call => String(call[0])).filter(line => line.includes('exemplo adicionado:'));
    expect(fixtures).toHaveLength(1);
    expect(fixtures[0]).toContain(example.id);
  });

  test('repor, limpar ou trocar cenário elimina as intervenções, mas adicionar ordens não elimina', async () => {
    const { orders, interventions } = setup();
    interventions.addAll(); orders.addAll();
    expect(await interventions.listByWorkOrder('mock-os-4')).toHaveLength(2);
    for (const reset of [() => orders.clear(), () => orders.reset(), () => orders.selectScenario('normal')]) {
      orders.selectScenario('normal'); interventions.addAll(); reset();
      expect(await interventions.listByWorkOrder('mock-os-4')).toEqual([]);
    }
  });

  test('devolve cópias, notifica apenas alterações e rejeita exemplos inválidos', async () => {
    const { interventions } = setup(); const listener = jest.fn();
    const unsubscribe = interventions.subscribe(listener);
    const example = interventions.listExamples()[0];
    expect(interventions.addExample(example.id)).toBe('added');
    expect(interventions.addExample(example.id)).toBe('existing');
    const first = (await interventions.listByWorkOrder(example.workOrderId))[0];
    first.technician.name = 'alterado'; first.materials.push('alterado');
    const again = (await interventions.listByWorkOrder(example.workOrderId))[0];
    expect(again.technician.name).not.toBe('alterado');
    expect(again.materials).not.toContain('alterado');
    expect(listener).toHaveBeenCalledTimes(1);
    interventions.clear(); interventions.clear(); expect(listener).toHaveBeenCalledTimes(2);
    unsubscribe(); interventions.addExample(example.id); expect(listener).toHaveBeenCalledTimes(2);
    expect(() => parseMockInterventions('{')).toThrow('JSON válido');
    expect(() => parseMockInterventions('{}')).toThrow('modelo provisório');
    expect(() => parseMockInterventions(JSON.stringify([example, example]))).toThrow('IDs únicos');
  });
});
