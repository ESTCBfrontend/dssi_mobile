import { lightActivityItemTokens, type ActivityItemTokens } from './activityItemTokens';
import { lightTimelineTokens, type TimelineTokens } from './timelineTokens';
import { lightTabsTokens, type TabsTokens } from './tabsTokens';
import { lightTabPanelTokens, type TabPanelTokens } from './tabPanelTokens';
import { lightTabTokens, type TabTokens } from './tabTokens';
import { lightPaginationTokens, type PaginationTokens } from './paginationTokens';
import { lightPageButtonTokens, type PageButtonTokens } from './pageButtonTokens';
import { lightFormGroupTokens, type FormGroupTokens } from './formGroupTokens';
import { lightContentPanelTokens, type ContentPanelTokens } from './contentPanelTokens';
import { lightCardTokens, type CardTokens } from './cardTokens';
import { lightAlertTokens, type AlertTokens } from './alertTokens';
import { lightTextareaTokens, type TextareaTokens } from './textareaTokens';
import { lightLoadingIndicatorTokens, type LoadingIndicatorTokens } from './loadingIndicatorTokens';
import { lightProgressBarTokens, type ProgressBarTokens } from './progressBarTokens';
import { lightCheckboxGroupTokens, type CheckboxGroupTokens } from './checkboxGroupTokens';
import { lightSwitchTokens, type SwitchTokens } from './switchTokens';
import { lightRadioGroupTokens, type RadioGroupTokens } from './radioGroupTokens';
import { lightRadioTokens, type RadioTokens } from './radioTokens';
import { lightCheckboxTokens, type CheckboxTokens } from './checkboxTokens';
import { lightFormFieldTokens, type FormFieldTokens } from './formFieldTokens';
import { lightTextFieldTokens, type TextFieldTokens } from './textFieldTokens';
import { lightAlertIconTokens, type AlertIconTokens } from './alertIconTokens';
import { lightStatusBadgeTokens, type StatusBadgeTokens } from './statusBadgeTokens';

/** Tokens dos componentes partilhados. Correspondência documentada em docs/components/. */
export interface AppTheme {
  activityItem: ActivityItemTokens;
  timeline: TimelineTokens;
  tabs: TabsTokens;
  tabPanel: TabPanelTokens;
  tab: TabTokens;
  pagination: PaginationTokens;
  pageButton: PageButtonTokens;
  formGroup: FormGroupTokens;
  contentPanel: ContentPanelTokens;
  card: CardTokens;
  alert: AlertTokens;
  textarea: TextareaTokens;
  loadingIndicator: LoadingIndicatorTokens;
  progressBar: ProgressBarTokens;
  checkboxGroup: CheckboxGroupTokens;
  switch: SwitchTokens;
  radioGroup: RadioGroupTokens;
  radio: RadioTokens;
  checkbox: CheckboxTokens;
  formField: FormFieldTokens;
  textField: TextFieldTokens;
  alertIcon: AlertIconTokens;
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
  activityItem: lightActivityItemTokens,
  timeline: lightTimelineTokens,
  tabs: lightTabsTokens,
  tabPanel: lightTabPanelTokens,
  tab: lightTabTokens,
  pagination: lightPaginationTokens,
  pageButton: lightPageButtonTokens,
  formGroup: lightFormGroupTokens,
  contentPanel: lightContentPanelTokens,
  card: lightCardTokens,
  alert: lightAlertTokens,
  textarea: lightTextareaTokens,
  loadingIndicator: lightLoadingIndicatorTokens,
  progressBar: lightProgressBarTokens,
  checkboxGroup: lightCheckboxGroupTokens,
  switch: lightSwitchTokens,
  radioGroup: lightRadioGroupTokens,
  radio: lightRadioTokens,
  checkbox: lightCheckboxTokens,
  formField: lightFormFieldTokens,
  textField: lightTextFieldTokens,
  alertIcon: lightAlertIconTokens,
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
