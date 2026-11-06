import type { Intervention } from '../../domain/intervention'

const text = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0
const optionalText = (value: unknown) => value === null || text(value)
const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)

function valid(value: unknown): value is Intervention {
  if (!record(value) || !record(value.technician)) return false
  return text(value.id) && text(value.workOrderId) && text(value.technician.id) && text(value.technician.name)
    && optionalText(value.startedAt) && optionalText(value.endedAt) && text(value.description) && text(value.status)
    && Array.isArray(value.materials) && value.materials.every(text) && optionalText(value.observations)
    && optionalText(value.pendingReason) && optionalText(value.nextStep)
}

export function parseMockInterventions(json: string): Intervention[] {
  let parsed: unknown
  try { parsed = JSON.parse(json) } catch { throw new Error('O ficheiro de intervenções não contém JSON válido.') }
  const items: unknown[] = Array.isArray(parsed) ? parsed : [parsed]
  if (!items.every(valid)) throw new Error('O JSON de intervenções não corresponde ao modelo provisório.')
  if (new Set(items.map(item => item.id)).size !== items.length) throw new Error('As intervenções devem ter IDs únicos.')
  return items
}
