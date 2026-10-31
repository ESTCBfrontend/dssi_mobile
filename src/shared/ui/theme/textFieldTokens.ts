export interface TextFieldColors { background: string; border: string; text: string; placeholder: string }
export interface TextFieldTokens {
  states: Record<'default' | 'focused' | 'error' | 'disabled', TextFieldColors>;
  sizes: Record<'small' | 'medium' | 'large', { minHeight: number; fontSize: number }>;
  fontFamily: string;
  radius: number;
  gap: number;
  paddingHorizontal: number;
  borderWidth: number;
  activeBorderWidth: number;
  iconSize: number;
}

/** Cores e medidas de MDS/TextField (35:19); small usa mínimo tátil de 44 pontos. */
export const lightTextFieldTokens: TextFieldTokens = {
  states: {
    default: { background: '#ffffff', border: '#dee3eb', text: '#1f2938', placeholder: '#667385' },
    focused: { background: '#ffffff', border: '#2159b8', text: '#1f2938', placeholder: '#667385' },
    error: { background: '#ffffff', border: '#b42318', text: '#1f2938', placeholder: '#667385' },
    disabled: { background: '#f5f7fa', border: '#dee3eb', text: '#667385', placeholder: '#667385' },
  },
  sizes: { small: { minHeight: 44, fontSize: 14 }, medium: { minHeight: 44, fontSize: 14 }, large: { minHeight: 52, fontSize: 16 } },
  fontFamily: 'Inter-Regular', radius: 10, gap: 8, paddingHorizontal: 14,
  borderWidth: 1, activeBorderWidth: 2, iconSize: 20,
};
