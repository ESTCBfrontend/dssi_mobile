export interface ContentPanelTokens {
  background: { surface: string; muted: string };
  border: string; titleColor: string; descriptionColor: string;
  titleFamily: string; descriptionFamily: string; titleSize: number; titleLineHeight: number;
  descriptionSize: number; descriptionLineHeight: number;
  radius: number; headerGap: number; headingGap: number; actionsGap: number; footerGap: number; wideBreakpoint: number;
  layouts: { stacked: { padding: number; gap: number }; wide: { padding: number; gap: number } };
}

/** Medidas e cores de MDS/ContentPanel (94:1081). */
export const lightContentPanelTokens: ContentPanelTokens = {
  background: { surface: '#ffffff', muted: '#fafbfd' }, border: '#dee3eb', titleColor: '#1f2938',
  descriptionColor: '#667385', titleFamily: 'Inter-SemiBold', descriptionFamily: 'Inter-Regular',
  titleSize: 18, titleLineHeight: 26, descriptionSize: 14, descriptionLineHeight: 21,
  radius: 14, headerGap: 12, headingGap: 6, actionsGap: 8, footerGap: 8, wideBreakpoint: 480,
  layouts: { stacked: { padding: 16, gap: 14 }, wide: { padding: 24, gap: 18 } },
};
