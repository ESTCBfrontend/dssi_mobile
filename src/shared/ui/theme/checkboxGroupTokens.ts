export interface CheckboxGroupTokens {
  background: string; border: string; errorBorder: string; title: string; description: string; errorText: string; helperText: string;
  titleFamily: string; bodyFamily: string; titleSize: number; titleLineHeight: number;
  descriptionSize: number; messageSize: number; messageLineHeight: number;
  borderWidth: number; radius: number; paddingStacked: number; paddingWide: number;
  sectionGap: number; headerGap: number; optionGap: number; columnGap: number; minColumnWidth: number;
}

/** MDS/CheckboxGroup (69:667); minColumnWidth adapta a grelha à largura disponível. */
export const lightCheckboxGroupTokens: CheckboxGroupTokens = {
  background: '#ffffff', border: '#dee3eb', errorBorder: '#b42318', title: '#1f2938', description: '#667385', errorText: '#b42318', helperText: '#667385',
  titleFamily: 'Inter-SemiBold', bodyFamily: 'Inter-Regular', titleSize: 18, titleLineHeight: 26,
  descriptionSize: 13, messageSize: 12, messageLineHeight: 18, borderWidth: 1, radius: 14,
  paddingStacked: 18, paddingWide: 24, sectionGap: 18, headerGap: 5, optionGap: 8, columnGap: 16, minColumnWidth: 180,
};
