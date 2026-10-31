import type { AlertIconTone } from './alertIconTokens';

export interface AlertTokens {
  background: Record<AlertIconTone, string>;
  border: string; text: string;
  titleFamily: string; messageFamily: string; titleSize: number; messageSize: number;
  radius: number; padding: number; gap: number; contentGap: number;
}

/** Cores e medidas de MDS/Alert (89:1030). */
export const lightAlertTokens: AlertTokens = {
  background: { info: '#eff8ff', success: '#def2e5', warning: '#fff1d6', danger: '#fee4e2' },
  border: '#dee3eb', text: '#1f2938',
  titleFamily: 'Inter-SemiBold', messageFamily: 'Inter-Regular', titleSize: 14, messageSize: 13,
  radius: 14, padding: 16, gap: 12, contentGap: 7,
};
