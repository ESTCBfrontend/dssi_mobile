export interface PaginationTokens {
  background: string; border: string; text: string; secondary: string;
  totalFamily: string; rangeFamily: string; pageFamily: string; fontSize: number;
  radius: number; padding: number; gap: number; navigationGap: number; narrowBreakpoint: number;
}

/** Medidas e cores da variante mobile de MDS/Pagination (124:1823). */
export const lightPaginationTokens: PaginationTokens = {
  background: '#ffffff', border: '#dee3eb', text: '#1f2938', secondary: '#667385',
  totalFamily: 'Inter-Medium', rangeFamily: 'Inter-Regular', pageFamily: 'Inter-SemiBold', fontSize: 12,
  radius: 12, padding: 12, gap: 10, navigationGap: 8, narrowBreakpoint: 300,
};
