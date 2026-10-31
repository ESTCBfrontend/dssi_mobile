import { lightStatusBadgeTokens, type StatusBadgeTokens } from './statusBadgeTokens';

/** Tokens dos componentes partilhados. Correspondência documentada em docs/components/. */
export interface AppTheme {
  statusBadge: StatusBadgeTokens;
  colors: {
    actionPrimary: string;
    actionSecondary: string;
    actionDanger: string;
    actionDisabled: string;
    surface: string;
    textPrimary: string;
    textOnPrimary: string;
    textOnDanger: string;
    textBrand: string;
    textDisabled: string;
    borderFocus: string;
    borderDisabled: string;
  };
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number };
  radius: { control: number };
  typography: {
    buttonFamily: string;
    buttonWeight: 'normal' | 'bold' | '400' | '500' | '600' | '700';
    buttonSize: { small: number; medium: number; large: number };
  };
  controls: { minTouchSize: number; mediumHeight: number; largeHeight: number };
}

/** Paleta clara consultada nos componentes MDS do Figma. Não existe paleta escura publicada. */
export const lightTheme: AppTheme = {
  statusBadge: lightStatusBadgeTokens,
  colors: {
    actionPrimary: '#2159b8',
    actionSecondary: '#e9edf3',
    actionDanger: '#b42318',
    actionDisabled: '#e9edf3',
    surface: '#ffffff',
    textPrimary: '#1f2938',
    textOnPrimary: '#ffffff',
    textOnDanger: '#ffffff',
    textBrand: '#194a9d',
    textDisabled: '#667385',
    borderFocus: '#2159b8',
    borderDisabled: '#dee3eb',
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20 },
  radius: { control: 10 },
  typography: {
    buttonFamily: 'Inter-Medium',
    buttonWeight: '500',
    buttonSize: { small: 13, medium: 14, large: 15 },
  },
  controls: { minTouchSize: 44, mediumHeight: 44, largeHeight: 52 },
};

export type ThemeMode = 'system' | 'light' | 'dark';
export interface ThemeSet {
  light: AppTheme;
  dark?: AppTheme;
}

export const defaultThemes: ThemeSet = { light: lightTheme };
