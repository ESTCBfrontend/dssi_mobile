import { afterEach, describe, expect, jest, test } from '@jest/globals';
import { logger } from './logger';
import { traceApiRequest } from './traceApiRequest';

afterEach(() => { jest.restoreAllMocks(); jest.useRealTimers(); });

describe('diagnóstico de pedidos API', () => {
  test('preserva a resposta e associa início e fim de pedidos concorrentes', async () => {
    jest.useFakeTimers();
    const log = jest.spyOn(logger, 'apiRequest').mockImplementation(() => {});
    const response = { status: 200, json: { token: 'privado' } };
    const first = traceApiRequest('GET', () => new Promise<typeof response>(resolve => setTimeout(() => resolve(response), 50)));
    const second = traceApiRequest('POST', async () => ({ status: 201 }));
    await second;
    await jest.advanceTimersByTimeAsync(50);
    expect(await first).toBe(response);
    const events = log.mock.calls.map(call => call[0]);
    expect(events[0].result).toBe('iniciada');
    expect(events[1].result).toBe('iniciada');
    expect(events[0].correlation).not.toBe(events[1].correlation);
    expect(events[2]).toMatchObject({ correlation: events[1].correlation, result: 'concluida', status: 201 });
    expect(events[3]).toMatchObject({ correlation: events[0].correlation, result: 'concluida', status: 200, durationMs: 50 });
    expect(JSON.stringify(events)).not.toContain('privado');
  });

  test('regista erros HTTP sem alterar a resposta', async () => {
    const log = jest.spyOn(logger, 'apiRequest').mockImplementation(() => {});
    const response = { status: 404, body: 'informação privada' };
    expect(await traceApiRequest('GET', async () => response)).toBe(response);
    expect(log.mock.calls[1][0]).toMatchObject({ result: 'erro-http', status: 404 });
    expect(JSON.stringify(log.mock.calls)).not.toContain('informação privada');
  });

  test.each([['AbortError', 'cancelada'], ['TimeoutError', 'tempo-limite'], ['Error', 'erro-rede']] as const)(
    'propaga a falha %s sem registar a mensagem', async (name, result) => {
      const log = jest.spyOn(logger, 'apiRequest').mockImplementation(() => {});
      const error = Object.assign(new Error('endereço e dados privados'), { name });
      await expect(traceApiRequest('GET', async () => { throw error; })).rejects.toBe(error);
      expect(log.mock.calls[1][0].result).toBe(result);
      expect(JSON.stringify(log.mock.calls)).not.toContain('dados privados');
    },
  );

  test('não altera o resultado quando a consola ou a leitura do estado falha', async () => {
    jest.spyOn(console, 'log').mockImplementation(() => { throw new Error('indisponível'); });
    const response = { get status(): number { throw new Error('privado'); } };
    expect(await traceApiRequest('GET', async () => response)).toBe(response);
  });
});
