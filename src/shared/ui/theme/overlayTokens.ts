/** Valores das superfícies MDS/Dialog (139:2141) e MDS/DrawerSheet (141:2148). */
export interface OverlayTokens {
  background: string; border: string; backdrop: string; primary: string; secondary: string; danger: string;
  closeBackground: string; focus: string; handle: string; regularFont: string; semiboldFont: string;
  dialogRadius: number; sheetRadius: number; fullscreenRadius: number; gapDialog: number; gapSheet: number;
  compactPadding: number; widePadding: number; bottomPadding: number; fullscreenPadding: number;
  compactWidth: number; wideWidth: number; sheetMaxWidth: number; viewportPadding: number; swipeThreshold: number;
}
export const lightOverlayTokens: OverlayTokens = {
  background: '#ffffff', border: '#dee3eb', backdrop: 'rgba(15, 28, 51, 0.45)', primary: '#1f2938',
  secondary: '#667385', danger: '#b42318', closeBackground: '#fafbfd', focus: '#2159b8', handle: '#667385',
  regularFont: 'Inter-Regular', semiboldFont: 'Inter-SemiBold', dialogRadius: 20, sheetRadius: 20, fullscreenRadius: 14,
  gapDialog: 16, gapSheet: 14, compactPadding: 24, widePadding: 28, bottomPadding: 18, fullscreenPadding: 20,
  compactWidth: 456, wideWidth: 720, sheetMaxWidth: 720, viewportPadding: 16, swipeThreshold: 60,
};
