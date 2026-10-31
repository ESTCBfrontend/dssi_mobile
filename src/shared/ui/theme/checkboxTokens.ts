export interface CheckboxTokens {
  background: string; border: string; selectedBackground: string; mark: string; focusBorder: string;
  disabledBackground: string; disabledBorder: string; disabledMark: string; disabledText: string;
  label: string; description: string; labelFamily: string; descriptionFamily: string;
  labelSize: number; labelLineHeight: number; descriptionSize: number; descriptionLineHeight: number;
  sizes: Record<'compact' | 'comfortable', { boxSize: number; radius: number }>;
  minTouchSize: number; haloRadius: number; gap: number; pressedOpacity: number;
}

/** MDS/Checkbox (67:641); ambas as variantes têm área tátil mínima de 44 pontos. */
export const lightCheckboxTokens: CheckboxTokens = {
  background: '#ffffff', border: '#667385', selectedBackground: '#2159b8', mark: '#ffffff', focusBorder: '#2159b8',
  disabledBackground: '#e9edf3', disabledBorder: '#dee3eb', disabledMark: '#475569', disabledText: '#667385',
  label: '#1f2938', description: '#667385', labelFamily: 'Inter-Medium', descriptionFamily: 'Inter-Regular',
  labelSize: 14, labelLineHeight: 20, descriptionSize: 12, descriptionLineHeight: 18,
  sizes: { compact: { boxSize: 18, radius: 5 }, comfortable: { boxSize: 20, radius: 6 } },
  minTouchSize: 44, haloRadius: 8, gap: 8, pressedOpacity: 0.9,
};
