export interface TimelineTokens {
  background: string; border: string; titleColor: string; secondary: string; accent: string; emptyBackground: string;
  titleFamily: string; bodyFamily: string; titleSize: number; bodySize: number; emptyTitleSize: number; emptySymbolWidth: number; emptySymbolHeight: number;
  radius: number; padding: number; headerGap: number; headingGap: number; sectionGap: number; itemGap: number;
  emptyRadius: number; emptyPadding: number; emptyGap: number;
}
/** MDS/Timeline mobile (180:3305, 180:3356). */
export const lightTimelineTokens: TimelineTokens = {
  background: '#ffffff', border: '#dee3eb', titleColor: '#1f2938', secondary: '#667385', accent: '#194a9d', emptyBackground: '#fafbfd',
  titleFamily: 'Inter-SemiBold', bodyFamily: 'Inter-Regular', titleSize: 16, bodySize: 12, emptyTitleSize: 14, emptySymbolWidth: 22, emptySymbolHeight: 36,
  radius: 14, padding: 16, headerGap: 12, headingGap: 6, sectionGap: 15, itemGap: 12, emptyRadius: 12, emptyPadding: 20, emptyGap: 10,
};
