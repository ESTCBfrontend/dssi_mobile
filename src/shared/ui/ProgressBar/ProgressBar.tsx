import { StyleSheet, Text, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';

export type ProgressBarSize = 'compact' | 'regular';
export type ProgressBarStatus = 'active' | 'complete' | 'error';
type ProgressBarName = { label: string; accessibilityLabel?: string } | { label?: never; accessibilityLabel: string };
type NativeProgressBarProps = Pick<ViewProps, 'accessibilityHint' | 'accessibilityLiveRegion' | 'testID' | 'nativeID' | 'onLayout'>;

export type ProgressBarProps = NativeProgressBarProps & ProgressBarName & {
  value: number;
  min?: number;
  max?: number;
  size?: ProgressBarSize;
  status?: ProgressBarStatus;
  /** Substitui o texto de estado visível e acessível em complete/error. */
  statusText?: string;
  showValue?: boolean;
  /** Omite o estado visual, mantendo-o no nome acessivel. */
  showStatusText?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ProgressBar({ value, min = 0, max = 100, label, accessibilityLabel, size = 'regular', status = 'active',
  statusText, showValue = true, showStatusText = true, style, accessibilityLiveRegion = 'none', ...nativeProps }: ProgressBarProps) {
  const { progressBar: tokens } = useTheme();
  const name = accessibilityLabel?.trim() || label?.trim();
  if (!name) throw new Error('ProgressBar requer uma label ou accessibilityLabel não vazia.');
  if (![value, min, max].every(Number.isFinite) || max <= min || !Number.isFinite(max - min)) {
    throw new Error('ProgressBar requer valores finitos e max maior que min.');
  }
  const boundedValue = Math.min(max, Math.max(min, value));
  if (status === 'complete' && boundedValue !== max) {
    throw new Error('ProgressBar complete requer o valor máximo.');
  }
  if (statusText !== undefined && !statusText.trim()) throw new Error('ProgressBar requer um texto de estado não vazio.');
  const percent = Math.round(((boundedValue - min) / (max - min)) * 100);
  const stateText = status === 'active' ? undefined : statusText?.trim() || (status === 'complete' ? 'Concluído' : 'Erro');
  const metrics = tokens.sizes[size];
  const palette = tokens.states[status];
  const visibleLabel = [label?.trim(), showStatusText ? stateText : undefined].filter(Boolean).join(' · ');
  const accessibleName = [name, stateText].filter(Boolean).join('. ');

  return <View {...nativeProps} accessible accessibilityRole="progressbar" accessibilityLabel={accessibleName}
    accessibilityValue={{ min: 0, max: 100, now: percent, text: `${percent}%` }}
    accessibilityLiveRegion={accessibilityLiveRegion}
    style={[styles.container, { borderColor: tokens.border, borderRadius: tokens.radius, backgroundColor: tokens.background,
      padding: metrics.padding, gap: tokens.gap }, style]}>
    {(visibleLabel || showValue) ? <View style={styles.heading}>
      {visibleLabel ? <Text accessible={false} allowFontScaling style={[styles.label, {
        color: palette.label, fontFamily: tokens.labelFamily, fontSize: metrics.fontSize,
      }]}>{visibleLabel}</Text> : null}
      {showValue ? <Text accessible={false} allowFontScaling style={{ color: palette.value, fontFamily: tokens.valueFamily,
        fontSize: metrics.fontSize, textAlign: 'right' }}>{percent}%</Text> : null}
    </View> : null}
    <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
      style={[styles.track, { height: metrics.trackHeight, borderRadius: metrics.trackHeight / 2, backgroundColor: tokens.track }]}>
      <View style={{ width: `${percent}%`, height: '100%', borderRadius: metrics.trackHeight / 2, backgroundColor: palette.fill }} />
    </View>
  </View>;
}

const styles = StyleSheet.create({
  container: { alignSelf: 'stretch', maxWidth: '100%', borderWidth: 1 },
  heading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  label: { flex: 1, minWidth: 0 },
  track: { alignSelf: 'stretch', overflow: 'hidden', flexDirection: 'row' },
});
