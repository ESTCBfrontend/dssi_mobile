export type ActivityType = 'status' | 'assignment' | 'comment' | 'completion';
export interface ActivityItemTokens {
  types: Record<ActivityType, { background: string; text: string; symbol: string }>;
  background: string; border: string; titleColor: string; secondary: string; focus: string;
  titleFamily: string; bodyFamily: string; metaFamily: string; symbolFamily: string;
  titleSize: number; bodySize: number; metaSize: number; symbolFontSize: number;
  radius: number; paddingHorizontal: number; paddingVertical: number; gap: number; contentGap: number; metaGap: number;
  symbolSize: number; symbolRadius: number;
}
/** MDS/ActivityItem mobile (179:3317). */
export const lightActivityItemTokens: ActivityItemTokens = {
  types: {
    status: { background: '#eff8ff', text: '#194a9d', symbol: '↻' },
    assignment: { background: '#eff8ff', text: '#194a9d', symbol: '+' },
    comment: { background: '#eff8ff', text: '#194a9d', symbol: '…' },
    completion: { background: '#def2e5', text: '#166534', symbol: '✓' },
  },
  background: '#ffffff', border: '#dee3eb', titleColor: '#1f2938', secondary: '#667385', focus: '#2159b8',
  titleFamily: 'Inter-SemiBold', bodyFamily: 'Inter-Regular', metaFamily: 'Inter-Medium', symbolFamily: 'Inter-SemiBold',
  titleSize: 13, bodySize: 12, metaSize: 11, symbolFontSize: 20,
  radius: 12, paddingHorizontal: 12, paddingVertical: 14, gap: 12, contentGap: 7, metaGap: 3, symbolSize: 44, symbolRadius: 12,
};
