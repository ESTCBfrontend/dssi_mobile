import type { WorkOrderService } from '../../application/workOrderService';
import type { WorkOrder, WorkOrderStatus } from '../../domain/workOrder';
import { traceApiRequest } from '../../../../shared/infrastructure/logging/traceApiRequest';
import { logger } from '../../../../shared/infrastructure/logging/logger';

const statuses: WorkOrderStatus[] = ['NOVA', 'ATRIBUIDA', 'EM_EXECUCAO', 'CONCLUIDA_TECNICAMENTE', 'VALIDADA', 'PENDENTE', 'CANCELADA'];
const labels: Record<string, string> = { INSTALACAO: 'Instalação', ASSISTENCIA_TECNICA: 'Assistência técnica', MANUTENCAO: 'Manutenção', OUTRO: 'Outro' };
const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const text = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
const reference = (value: unknown): value is Record<string, unknown> & { id: string; name: string } => record(value) && text(value.id) && text(value.name);

function parseOrder(value: unknown): WorkOrder {
  if (!record(value) || !record(value.site) || !text(value.id) || !text(value.code) || !reference(value.client)
    || !reference(value.site) || !(value.site.address == null || typeof value.site.address === 'string')
    || !text(value.serviceType) || !text(value.description) || typeof value.status !== 'string'
    || !statuses.includes(value.status as WorkOrderStatus) || !text(value.priority)
    || !(value.scheduledDate == null || typeof value.scheduledDate === 'string')
    || !(value.assignedTechnician == null || reference(value.assignedTechnician))
    || !(value.instructions == null || typeof value.instructions === 'string')) throw new Error('Resposta de ordem inválida.');
  return { id: value.id, code: value.code, client: value.client,
    site: { id: value.site.id as string, name: value.site.name as string, ...(typeof value.site.address === 'string' ? { address: value.site.address } : {}) },
    serviceType: labels[value.serviceType] ?? value.serviceType, description: value.description,
    status: value.status as WorkOrderStatus, priority: value.priority, scheduledDate: value.scheduledDate ?? null,
    assignedTechnician: value.assignedTechnician ?? null, instructions: value.instructions ?? null };
}

export class ApiWorkOrderService implements WorkOrderService {
  constructor(private readonly baseUrl: string, private readonly token: string, private readonly onUnauthorized: () => void,
    private readonly request: (url: string, init: RequestInit) => Promise<Response> = fetch) {}

  async list(): Promise<WorkOrder[]> {
    const orders: WorkOrder[] = [];
    let page = 0;
    while (true) {
      const response = await traceApiRequest('GET', () => this.request(`${this.baseUrl}/api/v1/me/work-orders?page=${page}&size=20`, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${this.token}` },
      }));
      if (response.status === 401) this.onUnauthorized();
      if (!response.ok) throw new Error('Não foi possível consultar a API.');
      const body: unknown = await response.json();
      if (!record(body) || !Array.isArray(body.items) || !Number.isSafeInteger(body.page)
        || body.page !== page || !Number.isSafeInteger(body.totalPages) || (body.totalPages as number) < 0
        || (body.totalPages as number) > 1000) throw new Error('Resposta de página inválida.');
      logger.apiResponse(body, ['page']);
      orders.push(...body.items.map(parseOrder));
      page += 1;
      if (page >= (body.totalPages as number)) return orders;
    }
  }

  async getById(id: string): Promise<WorkOrder | null> {
    const response = await traceApiRequest('GET', () => this.request(`${this.baseUrl}/api/v1/work-orders/${encodeURIComponent(id)}`, {
      headers: { Accept: 'application/json', Authorization: `Bearer ${this.token}` },
    }));
    if (response.status === 401) this.onUnauthorized();
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Não foi possível consultar a API.');
    const body: unknown = await response.json();
    return parseOrder(body);
  }
}
