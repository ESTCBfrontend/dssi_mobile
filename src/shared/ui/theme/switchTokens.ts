export interface SwitchSizeTokens {
  minHeight: number; targetWidth: number; ringWidth: number; ringHeight: number; trackWidth: number; trackHeight: number;
}
export type SwitchImageStates = Record<'default' | 'disabled', Record<'off' | 'on', number>>;
export interface SwitchTokens {
  /** Recursos locais com a geometria original; um tema alternativo pode fornecê-los. */
  images: Record<'compact' | 'comfortable', SwitchImageStates>;
  sizes: Record<'compact' | 'comfortable', SwitchSizeTokens>;
  label: string; disabledText: string; description: string; focusBorder: string;
  labelFamily: string; descriptionFamily: string;
  labelSize: number; labelLineHeight: number; descriptionSize: number; descriptionLineHeight: number;
  gap: number; pressedOpacity: number;
}

/** MDS/Switch (82:955): recursos originais e medidas dos alvos táteis. */
export const lightSwitchTokens: SwitchTokens = {
  images: {
    compact: {
      default: { off: require('../Switch/assets/compact-default-off.svg'), on: require('../Switch/assets/compact-default-on.svg') },
      disabled: { off: require('../Switch/assets/compact-disabled-off.svg'), on: require('../Switch/assets/compact-disabled-on.svg') },
    },
    comfortable: {
      default: { off: require('../Switch/assets/comfortable-default-off.svg'), on: require('../Switch/assets/comfortable-default-on.svg') },
      disabled: { off: require('../Switch/assets/comfortable-disabled-off.svg'), on: require('../Switch/assets/comfortable-disabled-on.svg') },
    },
  },
  sizes: {
    compact: { minHeight: 44, targetWidth: 48, ringWidth: 44, ringHeight: 28, trackWidth: 36, trackHeight: 20 },
    comfortable: { minHeight: 52, targetWidth: 56, ringWidth: 52, ringHeight: 32, trackWidth: 44, trackHeight: 24 },
  },
  label: '#1f2938', disabledText: '#667385', description: '#667385', focusBorder: '#2159b8',
  labelFamily: 'Inter-Medium', descriptionFamily: 'Inter-Regular',
  labelSize: 14, labelLineHeight: 20, descriptionSize: 12, descriptionLineHeight: 18,
  gap: 16, pressedOpacity: 0.9,
};
