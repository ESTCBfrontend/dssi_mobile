import type { ViewStyle } from 'react-native';

export interface CardTokens {
  background: string; border: string; titleColor: string; subtitleColor: string;
  titleFamily: string; subtitleFamily: string; subtitleSize: number; subtitleLineHeight: number;
  radius: number; headerGap: number; headingGap: number; footerGap: number; actionsGap: number;
  shadow: ViewStyle['boxShadow'];
  densities: Record<'compact' | 'comfortable', { padding: number; gap: number; titleSize: number; titleLineHeight?: number }>;
}

/** Medidas e cores de MDS/Card (92:1026). */
export const lightCardTokens: CardTokens = {
  background: '#ffffff', border: '#dee3eb', titleColor: '#1f2938', subtitleColor: '#667385',
  titleFamily: 'Inter-SemiBold', subtitleFamily: 'Inter-Regular', subtitleSize: 14, subtitleLineHeight: 21,
  radius: 14, headerGap: 12, headingGap: 5, footerGap: 10, actionsGap: 8,
  shadow: '0px 4px 8px rgba(15, 28, 51, 0.09)',
  densities: { compact: { padding: 16, gap: 12, titleSize: 15 }, comfortable: { padding: 24, gap: 16, titleSize: 18, titleLineHeight: 26 } },
};
