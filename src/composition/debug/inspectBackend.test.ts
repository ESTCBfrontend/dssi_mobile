import { afterEach, expect, jest, test } from '@jest/globals';
import { debugOptions } from './debugOptions';
import { inspectFetch } from './inspectBackend';

afterEach(() => { debugOptions.update({ inspect: false, tokens: false }); jest.restoreAllMocks(); });

test('oculta palavra-passe e token por defeito, permitindo tokens quando ativados', async () => {
  const log = jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(globalThis, 'fetch').mockResolvedValue({ status: 200, clone: () => ({ json: async () => ({ accessToken: 'token-teste', nested: { password: 'segredo', message: 'eco segredo' } }) }) } as Response);
  const url = 'https://alarmeon-backend-962ded164ecf.herokuapp.com/api/v1/auth/login';
  debugOptions.update({ inspect: true, tokens: false });
  await inspectFetch(url, { method: 'POST', headers: { Authorization: 'Bearer token-teste' }, body: JSON.stringify({ password: 'segredo' }) });
  await Promise.resolve();
  expect(JSON.stringify(log.mock.calls)).not.toContain('segredo');
  expect(JSON.stringify(log.mock.calls)).not.toContain('token-teste');
  debugOptions.update({ tokens: true });
  await inspectFetch(url, { method: 'POST', body: JSON.stringify({ password: 'segredo' }) });
  await Promise.resolve();
  expect(JSON.stringify(log.mock.calls)).toContain('token-teste');
  expect(JSON.stringify(log.mock.calls)).not.toContain('segredo');
});

test('não inspeciona outros servidores ou quando a ferramenta está desligada', async () => {
  const log = jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(globalThis, 'fetch').mockResolvedValue({ status: 200 } as Response);
  debugOptions.update({ inspect: true });
  await inspectFetch('https://outro.example/api', {});
  jest.spyOn(debugOptions, 'enabled').mockReturnValue(false);
  await inspectFetch('https://alarmeon-backend-962ded164ecf.herokuapp.com/api', {});
  expect(log).not.toHaveBeenCalled();
});

test('apresenta pedido e resposta em secções com o mesmo identificador e oculta cabeçalhos sensíveis', async () => {
  const log = jest.spyOn(console, 'log').mockImplementation(() => {});
  const original = { status: 200, headers: new Headers({ 'Content-Type': 'application/json', 'Cache-Control': 'no-cache', 'X-Request-Id': 'teste-123', 'Set-Cookie': 'sessao=privada' }),
    clone: () => ({ json: async () => ({ items: [{ code: 'OS-1' }] }) }) } as Response;
  jest.spyOn(globalThis, 'fetch').mockResolvedValue(original);
  debugOptions.update({ inspect: true });
  const result = await inspectFetch('https://alarmeon-backend-962ded164ecf.herokuapp.com/api?page=1', {
    method: 'POST', headers: [['Authorization', 'Bearer privado'], ['Content-Type', 'application/json']],
    body: JSON.stringify({ password: 'segredo', nested: { quantity: 2 } }),
  });
  await Promise.resolve();
  expect(result).toBe(original);
  const output = log.mock.calls.map(call => String(call[0]));
  const request = output.find(line => line.includes('PEDIDO')) ?? '';
  const response = output.find(line => line.includes('RESPOSTA')) ?? '';
  expect(request.match(/INSPEÇÃO #(\d+)/)?.[1]).toBe(response.match(/INSPEÇÃO #(\d+)/)?.[1]);
  expect(request).toContain('Método: POST');
  expect(request).toContain('Parâmetros:');
  expect(request).toContain('Cabeçalhos:');
  expect(request).toContain('Corpo JSON:');
  expect(request).toContain('"quantity": 2');
  expect(response).toContain('Estado: HTTP 200');
  expect(response).toContain('teste-123');
  expect(response).not.toMatch(/content-type|cache-control|no-cache/i);
  expect(response).toContain('"code": "OS-1"');
  expect(output.join('\n')).not.toMatch(/segredo|privado|sessao=privada/);
});

test('omite a secção de cabeçalhos da resposta quando todos são irrelevantes', async () => {
  const log = jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(globalThis, 'fetch').mockResolvedValue({ status: 200, headers: new Headers({ 'Date': 'hoje', 'Server': 'teste' }),
    clone: () => ({ json: async () => ({ ok: true }) }) } as Response);
  debugOptions.update({ inspect: true });
  await inspectFetch('https://alarmeon-backend-962ded164ecf.herokuapp.com/api', {});
  await Promise.resolve();
  const response = log.mock.calls.map(call => String(call[0])).find(line => line.includes('RESPOSTA')) ?? '';
  expect(response).not.toContain('Cabeçalhos:');
  expect(response).toContain('"ok": true');
});

test('apresenta resposta sem JSON sem interromper o pedido', async () => {
  const log = jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(globalThis, 'fetch').mockResolvedValue({ status: 204, clone: () => ({ json: async () => { throw new Error('sem JSON'); } }) } as unknown as Response);
  debugOptions.update({ inspect: true });
  await inspectFetch('https://alarmeon-backend-962ded164ecf.herokuapp.com/api', {});
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(log.mock.calls.some(call => String(call[0]).includes('corpo JSON indisponível'))).toBe(true);
});
