export interface LayoutInsets { top: number; right: number; bottom: number; left: number }
/** Os insets são fornecidos pela composição, sem depender de um provider global. */
export function resolveInsets(value?: Partial<LayoutInsets>): LayoutInsets {
  const insets = { top: 0, right: 0, bottom: 0, left: 0, ...value };
  if (Object.values(insets).some(item => typeof item !== 'number' || !Number.isFinite(item) || item < 0))
    throw new Error('As margens seguras devem ser números finitos e não negativos.');
  return insets;
}
