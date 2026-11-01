/** Cores e medidas consultadas em MDS/AttachmentItem (156:2397) e MDS/PhotoTile (159:2578). */
export const lightMediaTokens = {
  background: '#ffffff', border: '#dee3eb', error: '#b42318', subtle: '#fafbfd',
  primary: '#1f2938', secondary: '#667385', brand: '#2159b8', focus: '#2159b8',
  photoBackground: '#eff8ff', track: '#e9edf3',
  radius: 14, previewRadius: 9, actionRadius: 10,
  regularFont: 'Inter-Regular', semiboldFont: 'Inter-SemiBold',
};
export type MediaTokens = { [K in keyof typeof lightMediaTokens]: typeof lightMediaTokens[K] extends number ? number : string };
