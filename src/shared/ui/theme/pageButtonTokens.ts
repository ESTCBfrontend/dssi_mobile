export interface PageButtonPalette { background: string; border: string; text: string }
export interface PageButtonTokens {
  states: Record<'default' | 'current' | 'disabled', PageButtonPalette>;
  sizes: Record<'compact' | 'comfortable', number>;
  minTouchSize: number; radius: number; focus: string; fontFamily: string; fontSize: number;
  paddingHorizontal: number; paddingVertical: number;
}

/** MDS/PageButton (123:1726); compact preserva área tátil mínima de 44 pontos. */
export const lightPageButtonTokens: PageButtonTokens = {
  states: {
    default: { background: '#ffffff', border: '#dee3eb', text: '#1f2938' },
    current: { background: '#2159b8', border: '#2159b8', text: '#ffffff' },
    disabled: { background: '#f5f7fa', border: '#dee3eb', text: '#667385' },
  },
  sizes: { compact: 40, comfortable: 44 }, minTouchSize: 44, radius: 10, focus: '#2159b8',
  fontFamily: 'Inter-SemiBold', fontSize: 13, paddingHorizontal: 8, paddingVertical: 8,
};
