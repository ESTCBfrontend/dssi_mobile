import { debugOptions } from './debugOptions';

const testOrigin = 'https://alarmeon-backend-962ded164ecf.herokuapp.com';
const omittedResponseHeaders = new Set([
  'cache-control', 'content-type', 'date', 'expires', 'nel', 'pragma', 'report-to',
  'reporting-endpoints', 'server', 'strict-transport-security', 'vary', 'via',
  'x-content-type-options', 'x-frame-options', 'x-xss-protection', 'content-length',
]);
let nextInspection = 0;

function sanitize(value: unknown, showTokens: boolean, password = ''): unknown {
  if (typeof value === 'string' && password) return value.split(password).join('[ocultado]');
  if (Array.isArray(value)) return value.map(item => sanitize(item, showTokens, password));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => {
    const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normalized.includes('password') || normalized.includes('palavrapasse')) return [key, '[ocultado]'];
    if (!showTokens && (normalized.includes('token') || normalized.includes('authorization') || normalized.includes('cookie'))) return [key, '[ocultado]'];
    return [key, sanitize(item, showTokens, password)];
  }));
  return value;
}

function headersObject(headers: HeadersInit | undefined): Record<string, string> {
  const result: Record<string, string> = {};
  if (!headers) return result;
  if (Array.isArray(headers)) {
    for (const [key, value] of headers) result[key] = value;
  } else if ('forEach' in headers && typeof headers.forEach === 'function') {
    headers.forEach((value, key) => { result[key] = value; });
  } else {
    Object.assign(result, headers);
  }
  return result;
}

function format(value: unknown): string {
  if (value === undefined) return '  (sem conteúdo)';
  return (JSON.stringify(value, null, 2) ?? '(sem conteúdo)').split('\n').map(line => `  ${line}`).join('\n');
}

function writeInspection(message: string): void {
  try { console.log(message); } catch { /* A consola não deve afetar o pedido. */ }
}

/** Inspeciona exclusivamente o backend de teste, sem consumir a resposta original. */
export async function inspectFetch(url: string, init: RequestInit): Promise<Response> {
  const settings = debugOptions.getSnapshot();
  let inspect = false;
  let inspection = 0;
  let password = '';
  if (typeof init.body === 'string') {
    try { const body: unknown = JSON.parse(init.body); if (body && typeof body === 'object' && 'password' in body && typeof body.password === 'string') password = body.password; } catch { /* Sem corpo JSON. */ }
  }
  try { inspect = debugOptions.enabled() && settings.inspect && new URL(url).origin === testOrigin; } catch { /* URL inválido é tratado pelo fetch. */ }
  if (inspect) {
    inspection = ++nextInspection;
    try {
      const parsed = new URL(url);
      const query: Record<string, string | string[]> = {};
      parsed.searchParams.forEach((value, key) => {
        const previous = query[key];
        query[key] = previous === undefined ? value : Array.isArray(previous) ? [...previous, value] : [previous, value];
      });
      parsed.search = '';
      let body: unknown;
      if (typeof init.body === 'string') {
        try { body = JSON.parse(init.body); } catch { body = '[corpo não JSON omitido]'; }
      }
      writeInspection(`[DSSI] [INSPEÇÃO #${inspection}] PEDIDO\n  Método: ${init.method ?? 'GET'}\n  URL: ${parsed.toString()}\nParâmetros:\n${format(sanitize(query, settings.tokens, password))}\nCabeçalhos:\n${format(sanitize(headersObject(init.headers), settings.tokens, password))}\nCorpo JSON:\n${format(sanitize(body, settings.tokens, password))}`);
    } catch { writeInspection(`[DSSI] [INSPEÇÃO #${inspection}] Pedido: detalhes indisponíveis`); }
  }
  const response = await fetch(url, init);
  if (inspect && typeof response.clone === 'function') {
    try {
      const headers = Object.fromEntries(Object.entries(headersObject(response.headers))
        .filter(([name]) => !omittedResponseHeaders.has(name.toLowerCase())));
      const headerSection = Object.keys(headers).length ? `\nCabeçalhos:\n${format(sanitize(headers, settings.tokens, password))}` : '';
      const prefix = `[DSSI] [INSPEÇÃO #${inspection}] RESPOSTA\n  Estado: HTTP ${response.status}${headerSection}\nCorpo JSON:\n`;
      void response.clone().json().then((body: unknown) => {
        writeInspection(prefix + format(sanitize(body, settings.tokens, password)));
      }).catch(() => { writeInspection(prefix + '  (corpo JSON indisponível)'); });
    } catch { /* O diagnóstico não deve afetar a resposta. */ }
  }
  return response;
}
