export interface ProgressBarPalette { label: string; value: string; fill: string }
export interface ProgressBarSizeTokens { padding: number; fontSize: number; trackHeight: number }
export interface ProgressBarTokens {
  background: string; border: string; track: string; radius: number; gap: number;
  labelFamily: string; valueFamily: string;
  sizes: Record<'compact' | 'regular', ProgressBarSizeTokens>;
  states: Record<'active' | 'complete' | 'error', ProgressBarPalette>;
}

/** MDS/ProgressBar (148:2379), cores e dimensões claras. */
export const lightProgressBarTokens: ProgressBarTokens = {
  background: '#ffffff', border: '#dee3eb', track: '#e9edf3', radius: 14, gap: 13,
  labelFamily: 'Inter-Medium', valueFamily: 'Inter-SemiBold',
  sizes: { compact: { padding: 16, fontSize: 12, trackHeight: 6 }, regular: { padding: 20, fontSize: 13, trackHeight: 9 } },
  states: {
    active: { label: '#1f2938', value: '#194a9d', fill: '#2159b8' },
    complete: { label: '#1f2938', value: '#166534', fill: '#166534' },
    error: { label: '#b42318', value: '#b42318', fill: '#b42318' },
  },
};
