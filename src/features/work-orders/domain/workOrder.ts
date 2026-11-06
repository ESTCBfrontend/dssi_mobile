/** Modelo provisório para os primeiros ecrãs; o formato HTTP será acordado com o Backend. */
export type WorkOrderStatus =
  | 'NOVA'
  | 'ATRIBUIDA'
  | 'EM_EXECUCAO'
  | 'CONCLUIDA_TECNICAMENTE'
  | 'VALIDADA'
  | 'PENDENTE'
  | 'CANCELADA'

export type WorkOrderClient = { id: string; name: string }
export type WorkOrderSite = { id: string; name: string; address?: string }
export type WorkOrderTechnician = { id: string; name: string }

export type WorkOrder = {
  id: string
  code: string
  client: WorkOrderClient
  site: WorkOrderSite
  serviceType: string
  description: string
  status: WorkOrderStatus
  priority: string
  scheduledDate: string | null
  assignedTechnician: WorkOrderTechnician | null
  instructions: string | null
}

export type CreateWorkOrder = {
  code: string
  client: WorkOrderClient
  site: WorkOrderSite
  serviceType: string
  description: string
  priority?: string
  scheduledDate?: string | null
  instructions?: string | null
}

/** Campos editáveis provisórios, sujeitos a confirmação com o PO e Backend. */
export type UpdateWorkOrder = Pick<WorkOrder, 'serviceType' | 'description' | 'priority' | 'scheduledDate' | 'instructions'>
