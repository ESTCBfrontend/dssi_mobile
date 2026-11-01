export interface FormGroupTokens {
  background: string; border: string; titleColor: string; descriptionColor: string;
  titleFamily: string; descriptionFamily: string; titleSize: number; titleLineHeight: number; descriptionSize: number;
  radius: number; stackedPadding: number; columnsPadding: number; sectionGap: number; headingGap: number;
  fieldGap: number; columnGap: number; actionsGap: number; columnsBreakpoint: number;
}

/** Cores e medidas de MDS/FormGroup (42:204). */
export const lightFormGroupTokens: FormGroupTokens = {
  background: '#ffffff', border: '#dee3eb', titleColor: '#1f2938', descriptionColor: '#667385',
  titleFamily: 'Inter-SemiBold', descriptionFamily: 'Inter-Regular', titleSize: 18, titleLineHeight: 26, descriptionSize: 13,
  radius: 14, stackedPadding: 20, columnsPadding: 24, sectionGap: 20, headingGap: 5,
  fieldGap: 12, columnGap: 18, actionsGap: 8, columnsBreakpoint: 640,
};
