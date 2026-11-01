export interface TabPanelTokens {
  border: string; titleColor: string; descriptionColor: string; titleFamily: string; descriptionFamily: string;
  titleSize: number; descriptionSize: number; padding: { surface: number; muted: number };
  gap: number; headerGap: number; headingGap: number; actionsGap: number; wideBreakpoint: number;
}
/** Medidas e cores de MDS/TabPanel (132:1939); a superfície é partilhada com ContentPanel. */
export const lightTabPanelTokens: TabPanelTokens = {
  border: '#dee3eb', titleColor: '#1f2938', descriptionColor: '#667385', titleFamily: 'Inter-SemiBold',
  descriptionFamily: 'Inter-Regular', titleSize: 18, descriptionSize: 12, padding: { surface: 24, muted: 20 },
  gap: 16, headerGap: 14, headingGap: 5, actionsGap: 8, wideBreakpoint: 480,
};
