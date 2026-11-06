import { afterEach, expect, it, jest } from '@jest/globals';
import { createLogger } from './logger';

const event = { area: 'origem-dados', operation: 'selecionar', result: 'sucesso', source: 'mock', previousSource: 'api' } as const;

afterEach(() => { jest.restoreAllMocks(); });

it('regista eventos informativos em desenvolvimento sem propriedades adicionais', () => {
  const output = jest.spyOn(console, 'log').mockImplementation(() => {});
  createLogger(true).log('info', { ...event, secret: 'privado' } as typeof event);
  expect(output).toHaveBeenCalledWith('[DSSI] [INFO] [origem-dados] selecionar | sucesso | API → MOCK');
});

it('omite info em produção e mantém avisos e erros', () => {
  const output = jest.spyOn(console, 'log').mockImplementation(() => {});
  const log = createLogger(false);
  log.log('info', event);
  log.log('warn', event);
  log.log('error', event);
  expect(output).toHaveBeenCalledTimes(2);
  expect(output.mock.calls[0][0]).toContain('[WARN]');
  expect(output.mock.calls[1][0]).toContain('[ERROR]');
});

it('apresenta apenas metadados permitidos dos pedidos mock', () => {
  const output = jest.spyOn(console, 'log').mockImplementation(() => {});
  createLogger(true).log('info', { area: 'ordens-mock', operation: 'listar', result: 'sucesso', correlation: 2,
    durationMs: 1200, count: 3, payload: 'conteúdo privado' } as Parameters<ReturnType<typeof createLogger>['log']>[1]);
  expect(String(output.mock.calls[0][0])).toContain('listar #2 | sucesso | total: 3 | duração: 1200 ms');
  expect(String(output.mock.calls[0][0])).not.toContain('conteúdo privado');
});

it('não interrompe a operação quando a consola falha', () => {
  jest.spyOn(console, 'log').mockImplementation(() => { throw new Error('indisponível'); });
  expect(() => createLogger(true).log('error', event)).not.toThrow();
});

it('mostra JSON de exemplo em desenvolvimento e omite-o em produção', () => {
  const output = jest.spyOn(console, 'log').mockImplementation(() => {});
  const fixture = { id: 'ficticio', estado: 'NOVA' };
  createLogger(true).mockExample('ordens', fixture);
  expect(output).toHaveBeenCalledWith('[DSSI] [INFO] [ordens-mock] exemplo adicionado:\n{\n  "id": "ficticio",\n  "estado": "NOVA"\n}');
  output.mockClear();
  createLogger(false).mockExample('ordens', fixture);
  expect(output).not.toHaveBeenCalled();
});

it('não interrompe a operação quando o exemplo não pode ser serializado', () => {
  const cyclic: { self?: unknown } = {}; cyclic.self = cyclic;
  expect(() => createLogger(true).mockExample('ordens', cyclic)).not.toThrow();
});

it('filtra uma resposta API pelos campos numéricos explicitamente autorizados', () => {
  const output = jest.spyOn(console, 'log').mockImplementation(() => {});
  const response = { total: 12, count: 3, page: 2, pageSize: 20, email: 'privado@example.com',
    token: 'segredo', dados: [{ nome: 'privado' }] };
  createLogger(true).apiResponse(response, ['total', 'page']);
  expect(output).toHaveBeenCalledWith('[DSSI] [INFO] [API] resposta JSON:\n{\n  "total": 12,\n  "page": 2\n}');
  expect(JSON.stringify(output.mock.calls)).not.toContain('privado');
  expect(JSON.stringify(output.mock.calls)).not.toContain('segredo');
  expect(response.count).toBe(3);
});

it('omite respostas sem autorização, campos inválidos e corpos em produção', () => {
  const output = jest.spyOn(console, 'log').mockImplementation(() => {});
  const log = createLogger(true);
  log.apiResponse({ total: 5, token: 'segredo' });
  log.apiResponse({ total: '5', count: -1, page: NaN, pageSize: Infinity }, ['total', 'count', 'page', 'pageSize']);
  log.apiResponse([{ total: 5 }], ['total']);
  expect(output).toHaveBeenCalledTimes(3);
  expect(output.mock.calls.every(call => call[0] === '[DSSI] [INFO] [API] resposta JSON:\n[omitido]')).toBe(true);
  output.mockClear();
  createLogger(false).apiResponse({ total: 5 }, ['total']);
  expect(output).not.toHaveBeenCalled();
});

it('não avalia getters nem interrompe a operação se a filtragem ou consola falhar', () => {
  const output = jest.spyOn(console, 'log').mockImplementation(() => {});
  const body = { get total(): number { throw new Error('não executar'); }, count: 2 };
  expect(() => createLogger(true).apiResponse(body, ['total', 'count'])).not.toThrow();
  expect(output).toHaveBeenCalledWith('[DSSI] [INFO] [API] resposta JSON:\n{\n  "count": 2\n}');
  output.mockImplementation(() => { throw new Error('consola indisponível'); });
  expect(() => createLogger(true).apiResponse({ total: 2 }, ['total'])).not.toThrow();
});

it('regista metadados HTTP permitidos e omite propriedades não autorizadas', () => {
  const output = jest.spyOn(console, 'log').mockImplementation(() => {});
  const event = { method: 'GET', correlation: 7, result: 'erro-http', status: 404, durationMs: 42,
    url: 'https://exemplo.local/privado?token=segredo' } as const;
  createLogger(true).apiRequest(event);
  expect(output).toHaveBeenCalledWith('[DSSI] [ERROR] [API] pedido #7 | GET | erro-http | HTTP 404 | duração: 42 ms');
  expect(String(output.mock.calls[0][0])).not.toContain('segredo');
  output.mockClear();
  createLogger(false).apiRequest({ method: 'GET', correlation: 8, result: 'iniciada' });
  createLogger(false).apiRequest(event);
  expect(output).toHaveBeenCalledTimes(1);
});

it('rejeita método ou identificador inválidos e não apresenta metadados numéricos inválidos', () => {
  const output = jest.spyOn(console, 'log').mockImplementation(() => {});
  const log = createLogger(true);
  log.apiRequest({ method: 'token-secreto' as 'GET', correlation: 1, result: 'iniciada' });
  log.apiRequest({ method: 'GET', correlation: NaN, result: 'iniciada' });
  expect(output).not.toHaveBeenCalled();
  log.apiRequest({ method: 'GET', correlation: 1, result: 'concluida', status: 900, durationMs: -1 });
  expect(output).toHaveBeenCalledWith('[DSSI] [INFO] [API] pedido #1 | GET | concluida');
});
