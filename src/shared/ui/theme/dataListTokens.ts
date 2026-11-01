/** Valores claros consultados em MDS/TableRow, SortableHeader e DataTable. */
export interface DataListTokens {
  background: string; border: string; primary: string; secondary: string; brand: string; selectedBackground: string;
  focus: string; subtle: string; regularFont: string; mediumFont: string; semiboldFont: string;
  radius: number; padding: number; gap: number; rowGap: number; sortRadius: number;
}
export const lightDataListTokens: DataListTokens = {
  background: '#ffffff', border: '#dee3eb', primary: '#1f2938', secondary: '#667385', brand: '#194a9d',
  selectedBackground: '#eff8ff', focus: '#2159b8', subtle: '#fafbfd', regularFont: 'Inter-Regular',
  mediumFont: 'Inter-Medium', semiboldFont: 'Inter-SemiBold', radius: 14, padding: 16, gap: 16, rowGap: 8, sortRadius: 9,
};
