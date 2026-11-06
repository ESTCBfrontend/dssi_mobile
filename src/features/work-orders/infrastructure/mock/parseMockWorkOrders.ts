import type { WorkOrder, WorkOrderStatus } from '../../domain/workOrder'

const statuses: readonly WorkOrderStatus[] = [
  'NOVA', 'ATRIBUIDA', 'EM_EXECUCAO', 'CONCLUIDA_TECNICAMENTE', 'VALIDADA', 'PENDENTE', 'CANCELADA',
]

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isReference(value: unknown): boolean {
  return isRecord(value) && isText(value.id) && isText(value.name)
}

function isOrder(value: unknown): value is WorkOrder {
  if (!isRecord(value) || !isRecord(value.site)) return false
  return isText(value.id) && isText(value.code) && isReference(value.client) && isReference(value.site)
    && (value.site.address === undefined || typeof value.site.address === 'string')
    && isText(value.serviceType) && isText(value.description)
    && typeof value.status === 'string' && statuses.some(status => status === value.status)
    && isText(value.priority) && (value.scheduledDate === null || typeof value.scheduledDate === 'string')
    && (value.assignedTechnician === null || isReference(value.assignedTechnician))
    && (value.instructions === null || typeof value.instructions === 'string')
}

/** Interpreta texto JSON e rejeita dados incompatíveis com o modelo local provisório. */
export function parseMockWorkOrders(jsonText: string): WorkOrder[] {
  let parsed: unknown
  try {
    parsed = JSON.parse(jsonText)
  } catch {
    throw new Error('O ficheiro de ordens fictícias não contém JSON válido.')
  }
  const orders: unknown[] = Array.isArray(parsed) ? parsed : [parsed]
  if (!orders.every(isOrder)) {
    throw new Error('O JSON de ordens fictícias não corresponde ao modelo provisório.')
  }
  if (new Set(orders.map(order => order.id)).size !== orders.length) {
    throw new Error('As ordens fictícias devem ter identificadores únicos.')
  }
  return orders
}
