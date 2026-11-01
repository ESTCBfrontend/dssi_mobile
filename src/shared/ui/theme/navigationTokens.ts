export interface NavigationTokens {
  page: string; surface: string; subtle: string; border: string; primary: string; secondary: string;
  brand: string; brandText: string; onBrand: string; indicator: string; activeIndicator: string; focus: string;
  regularFont: string; mediumFont: string; semiboldFont: string;
  headerPadding: number; pagePadding: number; widePadding: number; wideBreakpoint: number;
}
/** MDS/NavItem, AppHeader, PageLayout e AppShell mobile (100:1147, 101:1130, 99:1107, 102:1205). */
export const lightNavigationTokens: NavigationTokens = {
  page: '#f5f7fa', surface: '#ffffff', subtle: '#fafbfd', border: '#dee3eb', primary: '#1f2938', secondary: '#667385',
  brand: '#2159b8', brandText: '#194a9d', onBrand: '#ffffff', indicator: '#dee3eb', activeIndicator: '#2159b8', focus: '#2159b8',
  regularFont: 'Inter-Regular', mediumFont: 'Inter-Medium', semiboldFont: 'Inter-SemiBold',
  headerPadding: 16, pagePadding: 18, widePadding: 28, wideBreakpoint: 640,
};
