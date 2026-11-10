import { afterEach, expect, it, jest } from '@jest/globals';
import { ApiWorkOrderService } from './ApiWorkOrderService';

const order = { id: '1', code: 'OS-1', client: { id: 'c', name: 'Cliente' }, site: { id: 's', name: 'Local' },
  serviceType: 'MANUTENCAO', description: 'Descrição', status: 'ATRIBUIDA', priority: 'NORMAL',
  scheduledDate: null, assignedTechnician: null, instructions: null };
const page = (items: unknown[], current: number, totalPages: number) => ({ ok: true, status: 200,
  json: async () => ({ items, page: current, totalPages }) }) as Response;

afterEach(() => { jest.restoreAllMocks(); });

it('consulta todas as páginas e adapta o tipo de serviço', async () => {
  const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce(page([order], 0, 2))
    .mockResolvedValueOnce(page([{ ...order, id: '2' }], 1, 2));
  const service = new ApiWorkOrderService('https://example.test', 'test-token', jest.fn());
  const result = await service.list();
  expect(result.map(item => item.id)).toEqual(['1', '2']);
  expect(result[0].serviceType).toBe('Manutenção');
  expect(fetchSpy).toHaveBeenCalledTimes(2);
  expect(fetchSpy.mock.calls[1][0]).toContain('page=1');
});

it('consulta o detalhe diretamente com autenticação', async () => {
  const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true, status: 200, json: async () => order } as Response);
  const service = new ApiWorkOrderService('https://example.test', 'test-token', jest.fn());
  await expect(service.getById('1')).resolves.toMatchObject({ id: '1' });
  expect(fetchSpy).toHaveBeenCalledWith('https://example.test/api/v1/work-orders/1', expect.objectContaining({
    headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
  }));
});

it('distingue detalhe inexistente de acesso recusado', async () => {
  jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: false, status: 404 } as Response)
    .mockResolvedValueOnce({ ok: false, status: 403 } as Response);
  const service = new ApiWorkOrderService('https://example.test', 'test-token', jest.fn());
  await expect(service.getById('outra')).resolves.toBeNull();
  await expect(service.getById('restrita')).rejects.toThrow();
});

it('termina a sessão se o detalhe devolver 401', async () => {
  jest.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 401 } as Response);
  const onUnauthorized = jest.fn();
  await expect(new ApiWorkOrderService('https://example.test', 'test-token', onUnauthorized).getById('1')).rejects.toThrow();
  expect(onUnauthorized).toHaveBeenCalledTimes(1);
});

it('termina a sessão em resposta 401', async () => {
  jest.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 401 } as Response);
  const onUnauthorized = jest.fn();
  await expect(new ApiWorkOrderService('https://example.test', 'test-token', onUnauthorized).list()).rejects.toThrow();
  expect(onUnauthorized).toHaveBeenCalledTimes(1);
});

it('rejeita respostas incompatíveis sem as apresentar', async () => {
  jest.spyOn(globalThis, 'fetch').mockResolvedValue(page([{ ...order, status: 'DESCONHECIDO' }], 0, 1));
  await expect(new ApiWorkOrderService('https://example.test', 'test-token', jest.fn()).list()).rejects.toThrow('Resposta de ordem inválida.');
});
