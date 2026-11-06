import { logger, type ApiMethod } from './logger';

let nextRequest = 0;

/** Instrumenta um pedido fornecido pelo consumidor, sem depender de um cliente HTTP. */
export async function traceApiRequest<T extends { status: number }>(
  method: ApiMethod,
  request: () => Promise<T>,
): Promise<T> {
  const correlation = ++nextRequest;
  const start = Date.now();
  logger.apiRequest({ method, correlation, result: 'iniciada' });
  let response: T;
  try {
    response = await request();
  } catch (error) {
    let result: 'cancelada' | 'tempo-limite' | 'erro-rede' = 'erro-rede';
    try {
      if (typeof error === 'object' && error !== null && 'name' in error) {
        if (error.name === 'AbortError') result = 'cancelada';
        else if (error.name === 'TimeoutError') result = 'tempo-limite';
      }
    } catch { /* Um erro externo não deve alterar o erro original. */ }
    logger.apiRequest({ method, correlation, result, durationMs: Math.max(0, Date.now() - start) });
    throw error;
  }
  let status: number | undefined;
  try { status = response.status; } catch { /* Não interromper a resposta por falha no diagnóstico. */ }
  logger.apiRequest({ method, correlation, result: typeof status === 'number' && status >= 400 && status <= 599 ? 'erro-http' : 'concluida',
    status, durationMs: Math.max(0, Date.now() - start) });
  return response;
}
