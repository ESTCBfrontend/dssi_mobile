export interface TextareaTokens {
  minHeight: { compact: number; comfortable: number };
  paddingHorizontal: number; paddingVertical: number; gap: number;
  fontSize: number; lineHeight: number; counterSize: number; counterColor: string;
}

/** Medidas de MDS/Textarea (59:519); cores e tipografia do campo partilhadas com TextField. */
export const lightTextareaTokens: TextareaTokens = {
  minHeight: { compact: 112, comfortable: 156 }, paddingHorizontal: 16, paddingVertical: 14, gap: 8,
  fontSize: 14, lineHeight: 21, counterSize: 11, counterColor: '#667385',
};
