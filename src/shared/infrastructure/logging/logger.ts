export type LogLevel = 'info' | 'warn' | 'error';
export type ApiResponseLogField = 'total' | 'count' | 'page' | 'pageSize';
export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
export type ApiRequestLogEvent = {
  method: ApiMethod; correlation: number;
  result: 'iniciada' | 'concluida' | 'erro-http' | 'erro-rede' | 'cancelada' | 'tempo-limite';
  status?: number; durationMs?: number;
};
const apiResponseLogFields: readonly ApiResponseLogField[] = ['total', 'count', 'page', 'pageSize'];
const apiMethods: readonly ApiMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
const apiResults: readonly ApiRequestLogEvent['result'][] = ['iniciada', 'concluida', 'erro-http', 'erro-rede', 'cancelada', 'tempo-limite'];

export type DataSourceLogEvent = {
  area: 'origem-dados';
  operation: 'selecionar';
  result: 'sucesso';
  source: 'api' | 'mock';
  previousSource: 'api' | 'mock';
};

type MockLogEvent = {
  area: 'ordens-mock'; operation: 'cenario' | 'adicionar' | 'limpar' | 'repor' | 'listar';
  result: 'iniciada' | 'sucesso' | 'erro' | 'existente'; count?: number;
  scenario?: 'normal' | 'empty' | 'error' | 'slow';
  correlation?: number; durationMs?: number; added?: number; skipped?: number;
};
type InterventionLogEvent = { area: 'intervencoes-mock'; operation: 'adicionar' | 'limpar' | 'listar'; result: 'added' | 'existing' | 'missing-order' | 'success'; count: number };

/** Eventos estruturados e saídas de JSON sujeitas às restrições de cada método. */
export function createLogger(development: boolean) {
  return {
    /** Apenas metadados conhecidos; nunca recebe URLs, cabeçalhos ou erros externos. */
    apiRequest(event: ApiRequestLogEvent): void {
      try {
        if (!apiMethods.includes(event.method) || !apiResults.includes(event.result)
          || !Number.isSafeInteger(event.correlation) || event.correlation < 1) return;
        const level: LogLevel = event.result === 'cancelada' ? 'warn'
          : event.result === 'erro-http' || event.result === 'erro-rede' || event.result === 'tempo-limite' ? 'error' : 'info';
        if (!development && level === 'info') return;
        const status = Number.isInteger(event.status) && event.status! >= 100 && event.status! <= 599 ? ` | HTTP ${event.status}` : '';
        const duration = Number.isSafeInteger(event.durationMs) && event.durationMs! >= 0 ? ` | duração: ${event.durationMs} ms` : '';
        console.log(`[DSSI] [${level.toUpperCase()}] [API] pedido #${event.correlation} | ${event.method} | ${event.result}${status}${duration}`);
      } catch {
        // Uma falha no diagnóstico não deve alterar o pedido.
      }
    },
    /** Recebe JSON já interpretado; o consumidor autoriza explicitamente os campos de cada operação. */
    apiResponse(body: unknown, allowedFields: readonly ApiResponseLogField[] = []): void {
      if (!development) return;
      try {
        const filtered: Partial<Record<ApiResponseLogField, number>> = {};
        if (body !== null && typeof body === 'object' && !Array.isArray(body)) {
          for (const field of apiResponseLogFields) {
            if (!allowedFields.includes(field)) continue;
            const descriptor = Object.getOwnPropertyDescriptor(body, field);
            const value = descriptor && 'value' in descriptor ? descriptor.value : undefined;
            if (typeof value === 'number' && Number.isSafeInteger(value) && value >= 0) filtered[field] = value;
          }
        }
        const json = Object.keys(filtered).length ? JSON.stringify(filtered, null, 2) : '[omitido]';
        console.log(`[DSSI] [INFO] [API] resposta JSON:\n${json}`);
      } catch {
        // A filtragem e a consola não devem interferir com a resposta da API.
      }
    },
    /** Apenas exemplos fictícios carregados dos ficheiros JSON do projeto. */
    mockExample(area: 'ordens' | 'intervencoes', example: unknown): void {
      if (!development) return;
      try {
        const json = JSON.stringify(example, null, 2);
        if (json !== undefined) console.log(`[DSSI] [INFO] [${area}-mock] exemplo adicionado:\n${json}`);
      } catch {
        // Uma falha no diagnóstico não deve interromper a aplicação.
      }
    },
    log(level: LogLevel, event: DataSourceLogEvent | MockLogEvent | InterventionLogEvent): void {
      if (!development && level === 'info') return;
      try {
        if (event.area === 'origem-dados') {
          console.log(`[DSSI] [${level.toUpperCase()}] [${event.area}] ${event.operation} | ${event.result} | ${event.previousSource.toUpperCase()} → ${event.source.toUpperCase()}`);
        } else {
          const trace = event.area === 'ordens-mock' && event.correlation !== undefined ? ` #${event.correlation}` : '';
          const scenario = event.area === 'ordens-mock' && event.scenario ? ` | cenário: ${event.scenario}` : '';
          const count = event.count === undefined ? '' : ` | total: ${event.count}`;
          const added = event.area === 'ordens-mock' && event.added !== undefined ? ` | adicionadas: ${event.added}` : '';
          const skipped = event.area === 'ordens-mock' && event.skipped !== undefined ? ` | existentes: ${event.skipped}` : '';
          const duration = event.area === 'ordens-mock' && event.durationMs !== undefined ? ` | duração: ${event.durationMs} ms` : '';
          console.log(`[DSSI] [${level.toUpperCase()}] [${event.area}] ${event.operation}${trace} | ${event.result}${scenario}${count}${added}${skipped}${duration}`);
        }
      } catch {
        // Uma falha no diagnóstico não deve interromper a aplicação.
      }
    },
  };
}

export const logger = createLogger(__DEV__);
