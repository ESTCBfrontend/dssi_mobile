export interface FormTokens {
  background: string; border: string; primary: string; secondary: string; danger: string;
  regularFont: string; semiboldFont: string; radius: number; padding: number; widePadding: number;
  gap: number; wideBreakpoint: number;
}
/** Medidas de MDS/Form (48:198) e MDS/DateRangePicker (178:3220). */
export const lightFormTokens: FormTokens = {
  background: '#ffffff', border: '#dee3eb', primary: '#1f2938', secondary: '#667385', danger: '#b42318',
  regularFont: 'Inter-Regular', semiboldFont: 'Inter-SemiBold', radius: 14, padding: 18, widePadding: 24,
  gap: 20, wideBreakpoint: 640,
};
