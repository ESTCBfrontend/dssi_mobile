export interface FormFieldTokens {
  label: string; labelDisabled: string; required: string; helper: string; error: string;
  labelFamily: string; labelSize: number; labelLineHeight: number;
  messageFamily: string; messageSize: number; messageLineHeight: number; gap: number;
}

/** MDS/FormField (38:144): label/default, caption/default e cores semânticas claras. */
export const lightFormFieldTokens: FormFieldTokens = {
  label: '#1f2938', labelDisabled: '#667385', required: '#b42318', helper: '#667385', error: '#b42318',
  labelFamily: 'Inter-Medium', labelSize: 14, labelLineHeight: 20,
  messageFamily: 'Inter-Regular', messageSize: 12, messageLineHeight: 18, gap: 8,
};
