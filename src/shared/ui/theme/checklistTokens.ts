/** Medidas e cores das variantes mobile MDS/ChecklistItem, TaskProgress e Checklist. */
export const lightChecklistTokens = {
  background: '#ffffff', border: '#dee3eb', subtle: '#fafbfd', primary: '#1f2938', secondary: '#667385',
  brand: '#194a9d', error: '#b42318', success: '#166534', radius: 14, padding: 16, gap: 14,
  regularFont: 'Inter-Regular', semiboldFont: 'Inter-SemiBold',
};
export type ChecklistTokens = { [K in keyof typeof lightChecklistTokens]: typeof lightChecklistTokens[K] extends number ? number : string };
