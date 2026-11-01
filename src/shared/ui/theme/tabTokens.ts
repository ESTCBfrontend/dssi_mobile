export interface TabPalette { text: string; counterBackground: string; counterText: string }
export interface TabTokens {
  states: Record<'default' | 'selected' | 'focused' | 'disabled', TabPalette>;
  sizes: Record<'compact' | 'comfortable', { minHeight: number; fontSize: number }>;
  minTouchSize: number; paddingHorizontal: number; paddingVertical: number; gap: number;
  labelFamily: string; activeFamily: string; focus: string; focusBackground: string; focusRadius: number;
  counterWidth: number; counterHeight: number; counterRadius: number; counterFontSize: number;
  indicator: string; indicatorHeight: number;
}

/** Cores e medidas de MDS/Tab (130:1883). */
export const lightTabTokens: TabTokens = {
  states: {
    default: { text: '#667385', counterBackground: '#fafbfd', counterText: '#667385' },
    selected: { text: '#194a9d', counterBackground: '#2159b8', counterText: '#ffffff' },
    focused: { text: '#194a9d', counterBackground: '#fafbfd', counterText: '#667385' },
    disabled: { text: '#667385', counterBackground: '#e9edf3', counterText: '#667385' },
  },
  sizes: { compact: { minHeight: 44, fontSize: 12 }, comfortable: { minHeight: 48, fontSize: 13 } },
  minTouchSize: 44, paddingHorizontal: 16, paddingVertical: 6, gap: 6,
  labelFamily: 'Inter-Medium', activeFamily: 'Inter-SemiBold', focus: '#2159b8', focusBackground: '#eff8ff', focusRadius: 9,
  counterWidth: 24, counterHeight: 19, counterRadius: 9, counterFontSize: 10, indicator: '#2159b8', indicatorHeight: 3,
};
