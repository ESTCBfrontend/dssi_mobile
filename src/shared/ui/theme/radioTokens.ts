export type RadioImageStates = Record<'default' | 'focused' | 'disabled', Record<'unselected' | 'selected', number>>;
export interface RadioTokens {
  /** Recursos locais de 28×28; um tema alternativo pode fornecer os seus próprios SVGs. */
  images: Record<'compact' | 'comfortable', RadioImageStates>;
  label: string; disabledText: string; description: string;
  labelFamily: string; descriptionFamily: string;
  labelSize: number; labelLineHeight: number; descriptionSize: number; descriptionLineHeight: number;
  minTouchSize: number; gap: number; pressedOpacity: number;
}

/** MDS/Radio (76:767), matriz de recursos Figma e medidas de texto. */
export const lightRadioTokens: RadioTokens = {
  images: {
    compact: {
      default: { unselected: require('../Radio/assets/compact-default-unselected.svg'), selected: require('../Radio/assets/compact-default-selected.svg') },
      focused: { unselected: require('../Radio/assets/compact-focused-unselected.svg'), selected: require('../Radio/assets/compact-focused-selected.svg') },
      disabled: { unselected: require('../Radio/assets/compact-disabled-unselected.svg'), selected: require('../Radio/assets/compact-disabled-selected.svg') },
    },
    comfortable: {
      default: { unselected: require('../Radio/assets/comfortable-default-unselected.svg'), selected: require('../Radio/assets/comfortable-default-selected.svg') },
      focused: { unselected: require('../Radio/assets/comfortable-focused-unselected.svg'), selected: require('../Radio/assets/comfortable-focused-selected.svg') },
      disabled: { unselected: require('../Radio/assets/comfortable-disabled-unselected.svg'), selected: require('../Radio/assets/comfortable-disabled-selected.svg') },
    },
  },
  label: '#1f2938', disabledText: '#667385', description: '#667385',
  labelFamily: 'Inter-Medium', descriptionFamily: 'Inter-Regular',
  labelSize: 14, labelLineHeight: 20, descriptionSize: 12, descriptionLineHeight: 18,
  minTouchSize: 44, gap: 8, pressedOpacity: 0.9,
};
