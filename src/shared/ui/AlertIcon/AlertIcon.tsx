import { Image, StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { useTheme, type AlertIconTone } from '../theme';

export type { AlertIconTone } from '../theme';

type AlertIconBaseProps = Pick<ViewProps, 'testID' | 'nativeID' | 'onLayout'> & {
  tone?: AlertIconTone;
  /** Diâmetro em pontos; por omissão usa o tema (30 no Figma). */
  size?: number;
  /** Substitui apenas a cor do círculo nesta utilização. */
  colorOverride?: string;
  style?: StyleProp<ViewStyle>;
};

export type AlertIconProps = AlertIconBaseProps & (
  | { decorative?: true; accessibilityLabel?: never }
  | { decorative: false; accessibilityLabel: string }
);

// Símbolos exportados do Figma a 4x; o círculo continua a ser uma primitiva nativa.
const symbols = {
  info: { source: require('./assets/info.png'), width: 5 },
  success: { source: require('./assets/success.png'), width: 15 },
  warning: { source: require('./assets/warning.png'), width: 5 },
  danger: { source: require('./assets/danger.png'), width: 11 },
} as const;

export function AlertIcon({
  tone = 'info', size, colorOverride, decorative = true, accessibilityLabel, style, ...nativeProps
}: AlertIconProps) {
  const { alertIcon: tokens } = useTheme();
  const diameter = size ?? tokens.size;
  if (!Number.isFinite(diameter) || diameter <= 0) {
    throw new Error('AlertIcon requer um tamanho finito maior que zero.');
  }
  const label = accessibilityLabel?.trim();
  if (!decorative && !label) {
    throw new Error('AlertIcon não decorativo requer uma accessibilityLabel não vazia.');
  }
  const palette = tokens.tones[tone];
  const symbol = symbols[tone];

  return (
    <View
      {...nativeProps}
      accessible={!decorative}
      accessibilityRole={decorative ? undefined : 'image'}
      accessibilityLabel={decorative ? undefined : label}
      accessibilityElementsHidden={decorative}
      importantForAccessibility={decorative ? 'no-hide-descendants' : 'yes'}
      pointerEvents="none"
      style={[
        styles.circle,
        { width: diameter, height: diameter, borderRadius: diameter / 2, backgroundColor: colorOverride ?? palette.background },
        style,
      ]}
    >
      <Image
        source={symbol.source}
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no"
        resizeMode="contain"
        fadeDuration={0}
        style={{ width: symbol.width * diameter / 30, height: 19 * diameter / 30, tintColor: palette.symbol }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { flexShrink: 0, alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center' },
});
