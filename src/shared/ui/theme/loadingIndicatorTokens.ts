export interface LoadingIndicatorSizeTokens {
  padding: number; spinnerSize: number; fontSize: number; lineHeight: number; lineGap: number;
}
export interface LoadingIndicatorTokens {
  spinners: Record<'compact' | 'comfortable', number>;
  sizes: Record<'compact' | 'comfortable', LoadingIndicatorSizeTokens>;
  background: string; border: string; text: string; skeleton: string; labelFamily: string;
  radius: number; gap: number; minHeight: number; rotationDuration: number;
}

/** MDS/LoadingIndicator (149:2367): recursos e medidas do tema claro. */
export const lightLoadingIndicatorTokens: LoadingIndicatorTokens = {
  spinners: { compact: require('../LoadingIndicator/assets/spinner-compact.svg'), comfortable: require('../LoadingIndicator/assets/spinner-comfortable.svg') },
  sizes: {
    compact: { padding: 14, spinnerSize: 22, fontSize: 12, lineHeight: 10, lineGap: 9 },
    comfortable: { padding: 20, spinnerSize: 34, fontSize: 13, lineHeight: 13, lineGap: 12 },
  },
  background: '#ffffff', border: '#dee3eb', text: '#667385', skeleton: '#e9edf3', labelFamily: 'Inter-Medium',
  radius: 12, gap: 12, minHeight: 72, rotationDuration: 900,
};
