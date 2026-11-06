/** Modelo fictício provisório, sujeito ao contrato com o Backend. */
export type Intervention = {
  id: string
  workOrderId: string
  technician: { id: string; name: string }
  startedAt: string | null
  endedAt: string | null
  description: string
  status: string
  materials: string[]
  observations: string | null
  pendingReason: string | null
  nextStep: string | null
}
