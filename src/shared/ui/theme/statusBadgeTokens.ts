export type StatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface StatusBadgeColors { background: string; text: string }
export interface StatusBadgeSizeTokens {
  minHeight: number;
  paddingHorizontal: number;
  paddingVertical: number;
  fontSize: number;
  dotSize: number;
  iconSize: number;
}

export interface StatusBadgeTokens {
  tones: Record<StatusTone, { soft: StatusBadgeColors; solid: StatusBadgeColors }>;
  fontFamily: string;
  fontWeight: 'normal' | 'bold' | '400' | '500' | '600' | '700';
  radius: number;
  gap: number;
  sizes: { small: StatusBadgeSizeTokens; medium: StatusBadgeSizeTokens };
}

/** Valores consultados no Figma MDS/StatusBadge (86:958). */
export const lightStatusBadgeTokens: StatusBadgeTokens = {
  tones: {
    neutral: {
      soft: { background: '#e9edf3', text: '#1f2938' },
      solid: { background: '#475569', text: '#ffffff' },
    },
    info: {
      soft: { background: '#eff8ff', text: '#175cd3' },
      solid: { background: '#175cd3', text: '#ffffff' },
    },
    success: {
      soft: { background: '#def2e5', text: '#166534' },
      solid: { background: '#166534', text: '#ffffff' },
    },
    warning: {
      soft: { background: '#fff1d6', text: '#92400e' },
      solid: { background: '#92400e', text: '#ffffff' },
    },
    danger: {
      soft: { background: '#fee4e2', text: '#b42318' },
      solid: { background: '#b42318', text: '#ffffff' },
    },
  },
  fontFamily: 'Inter-Medium',
  fontWeight: '500',
  radius: 999,
  gap: 6,
  sizes: {
    small: { minHeight: 24, paddingHorizontal: 9, paddingVertical: 4, fontSize: 11, dotSize: 6, iconSize: 12 },
    medium: { minHeight: 30, paddingHorizontal: 12, paddingVertical: 6, fontSize: 12, dotSize: 7, iconSize: 14 },
  },
};
