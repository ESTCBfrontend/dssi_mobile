import { type ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewProps, type ViewStyle } from 'react-native';
import { useTheme, type StatusTone } from '../theme';

export type StatusBadgeTone = StatusTone;
export type StatusBadgeVariant = 'soft' | 'solid';
export type StatusBadgeSize = 'small' | 'medium';
export interface StatusBadgeIconProps { color: string; size: number }
export type StatusBadgeIcon = ReactNode | ((props: StatusBadgeIconProps) => ReactNode);

export interface StatusBadgeProps extends Pick<ViewProps,
  'accessibilityLabel' | 'accessibilityHint' | 'accessibilityLiveRegion' | 'testID' | 'nativeID' | 'onLayout'
> {
  label: string;
  tone?: StatusBadgeTone;
  variant?: StatusBadgeVariant;
  size?: StatusBadgeSize;
  showDot?: boolean;
  /** Decoração opcional; quando presente substitui o ponto. */
  icon?: StatusBadgeIcon;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function StatusBadge({
  label, tone = 'neutral', variant = 'soft', size = 'medium', showDot = false,
  icon, style, textStyle, accessibilityLabel, accessibilityLiveRegion = 'none', ...nativeProps
}: StatusBadgeProps) {
  const { statusBadge: tokens } = useTheme();
  if (!label.trim()) throw new Error('StatusBadge requer uma label não vazia.');
  const palette = tokens.tones[tone][variant];
  const metrics = tokens.sizes[size];
  const decoration = typeof icon === 'function' ? icon({ color: palette.text, size: metrics.iconSize }) : icon;

  return (
    <View
      {...nativeProps}
      accessible
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel?.trim() || label}
      accessibilityLiveRegion={accessibilityLiveRegion}
      style={[
        styles.badge,
        {
          backgroundColor: palette.background,
          borderRadius: tokens.radius,
          gap: tokens.gap,
          minHeight: metrics.minHeight,
          paddingHorizontal: metrics.paddingHorizontal,
          paddingVertical: metrics.paddingVertical,
        },
        style,
      ]}
    >
      {decoration ? (
        <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
          pointerEvents="none" style={styles.decoration}>
          {decoration}
        </View>
      ) : showDot ? (
        <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
          pointerEvents="none" style={[
            styles.decoration,
            { backgroundColor: palette.text, width: metrics.dotSize, height: metrics.dotSize, borderRadius: tokens.radius },
          ]} />
      ) : null}
      <Text accessible={false} allowFontScaling style={[
        styles.label,
        { color: palette.text, fontFamily: tokens.fontFamily, fontWeight: tokens.fontWeight, fontSize: metrics.fontSize },
        textStyle,
      ]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start', maxWidth: '100%', flexShrink: 1,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  label: { flexShrink: 1, minWidth: 0, textAlign: 'center' },
  decoration: { flexShrink: 0, alignItems: 'center', justifyContent: 'center' },
});
