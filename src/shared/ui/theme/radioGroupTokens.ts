export interface RadioGroupTokens {
  background: string; border: string; errorBorder: string; title: string; description: string; errorText: string;
  titleFamily: string; bodyFamily: string; titleSize: number; titleLineHeight: number;
  descriptionSize: number; errorSize: number; errorLineHeight: number;
  borderWidth: number; radius: number; paddingStacked: number; paddingWide: number;
  sectionGap: number; headerGap: number; optionGap: number; columnGap: number; minColumnWidth: number;
}

/** MDS/RadioGroup (77:827); minColumnWidth adapta a grelha à largura disponível. */
export const lightRadioGroupTokens: RadioGroupTokens = {
  background: '#ffffff', border: '#dee3eb', errorBorder: '#b42318', title: '#1f2938', description: '#667385', errorText: '#b42318',
  titleFamily: 'Inter-SemiBold', bodyFamily: 'Inter-Regular', titleSize: 18, titleLineHeight: 26,
  descriptionSize: 13, errorSize: 12, errorLineHeight: 18, borderWidth: 1, radius: 14,
  paddingStacked: 18, paddingWide: 24, sectionGap: 18, headerGap: 5, optionGap: 8, columnGap: 16, minColumnWidth: 180,
};
