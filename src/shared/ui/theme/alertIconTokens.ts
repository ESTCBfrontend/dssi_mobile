export type AlertIconTone = 'info' | 'success' | 'warning' | 'danger';

export interface AlertIconColors { background: string; symbol: string }
export interface AlertIconTokens {
  size: number;
  tones: Record<AlertIconTone, AlertIconColors>;
}

/** MDS/AlertIcon (89:901): color/bg/status-*-solid e color/text/on-brand. */
export const lightAlertIconTokens: AlertIconTokens = {
  size: 30,
  tones: {
    info: { background: '#175cd3', symbol: '#ffffff' },
    success: { background: '#166534', symbol: '#ffffff' },
    warning: { background: '#92400e', symbol: '#ffffff' },
    danger: { background: '#b42318', symbol: '#ffffff' },
  },
};
