import type { WorkOrderStatus } from '../domain/workOrder';

export const workOrderStatus: Record<WorkOrderStatus, { label: string; tone: 'neutral' | 'info' | 'success' | 'warning' | 'danger' }> = {
  NOVA: { label: 'Nova', tone: 'info' }, ATRIBUIDA: { label: 'Atribuída', tone: 'info' },
  EM_EXECUCAO: { label: 'Em execução', tone: 'warning' }, PENDENTE: { label: 'Pendente', tone: 'warning' },
  CONCLUIDA_TECNICAMENTE: { label: 'Concluída tecnicamente', tone: 'success' },
  VALIDADA: { label: 'Validada', tone: 'success' }, CANCELADA: { label: 'Cancelada', tone: 'danger' },
};

export function formatWorkOrderDate(value: string | null): string {
  if (!value) return 'Por agendar';
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : value;
}
