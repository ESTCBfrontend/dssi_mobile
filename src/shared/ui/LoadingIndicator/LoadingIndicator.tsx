import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { AccessibilityInfo, Animated, Easing, StyleSheet, Text, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';

export type LoadingIndicatorType = 'spinner' | 'inline' | 'skeleton';
export type LoadingIndicatorSize = 'compact' | 'comfortable';
export interface LoadingIndicatorProps extends Pick<ViewProps,
  'accessibilityLabel' | 'accessibilityHint' | 'accessibilityLiveRegion' | 'testID' | 'nativeID' | 'onLayout'
> {
  type?: LoadingIndicatorType;
  size?: LoadingIndicatorSize;
  label?: string;
  active?: boolean;
  /** Adiciona redução de movimento; nunca anula a preferência ativa do sistema. */
  reducedMotion?: boolean;
  skeletonLines?: number;
  style?: StyleProp<ViewStyle>;
}

export function LoadingIndicator({ type = 'spinner', size = 'comfortable', label = 'A processar…', active = true,
  reducedMotion = false, skeletonLines = 3, style, accessibilityLabel, accessibilityLiveRegion = 'none', ...nativeProps }: LoadingIndicatorProps) {
  const { loadingIndicator: tokens } = useTheme();
  const [systemReducedMotion, setSystemReducedMotion] = useState(true);
  const [rotation] = useState(() => new Animated.Value(0));

  useEffect(() => {
    let mounted = true;
    let changed = false;
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', value => {
      changed = true;
      if (mounted) setSystemReducedMotion(value);
    });
    AccessibilityInfo.isReduceMotionEnabled().then(value => {
      if (mounted && !changed) setSystemReducedMotion(value);
    }).catch(() => { /* Sem preferência confirmada, mantém movimento reduzido. */ });
    return () => { mounted = false; subscription.remove(); };
  }, []);

  useEffect(() => {
    if (!active || type === 'skeleton' || reducedMotion || systemReducedMotion) {
      rotation.setValue(0);
      return;
    }
    const animation = Animated.loop(Animated.timing(rotation, {
      toValue: 1, duration: tokens.rotationDuration, easing: Easing.linear, useNativeDriver: true, isInteraction: false,
    }));
    animation.start();
    return () => { animation.stop(); rotation.setValue(0); };
  }, [active, type, reducedMotion, systemReducedMotion, rotation, tokens.rotationDuration]);

  const name = accessibilityLabel?.trim() || label.trim();
  if (!name) throw new Error('LoadingIndicator requer uma label ou accessibilityLabel não vazia.');
  if (type === 'inline' && !label.trim()) throw new Error('LoadingIndicator inline requer uma label não vazia.');
  if (!Number.isSafeInteger(skeletonLines) || skeletonLines < 1 || skeletonLines > 20) {
    throw new Error('LoadingIndicator requer entre 1 e 20 linhas inteiras.');
  }
  if (!active) return null;
  const metrics = tokens.sizes[size];
  const spin = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return <View {...nativeProps} accessible accessibilityRole="progressbar" accessibilityLabel={name}
    accessibilityState={{ busy: true }} accessibilityLiveRegion={accessibilityLiveRegion}
    style={[styles.container, type === 'skeleton' ? styles.skeletonContainer : styles.inlineContainer,
      { backgroundColor: tokens.background, borderColor: tokens.border, borderRadius: tokens.radius,
        padding: metrics.padding, gap: tokens.gap, minHeight: type === 'skeleton' ? undefined : tokens.minHeight }, style]}>
    {type === 'skeleton' ? <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
      pointerEvents="none" style={[styles.lines, { gap: metrics.lineGap }]}>
      {Array.from({ length: skeletonLines }, (_, index) => <View key={index} style={{
        height: metrics.lineHeight, borderRadius: metrics.lineHeight / 2, backgroundColor: tokens.skeleton,
        width: index === 0 ? '100%' : index === skeletonLines - 1 ? '62%' : '88%',
      }} />)}
    </View> : <Animated.View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
      pointerEvents="none" style={{ width: metrics.spinnerSize, height: metrics.spinnerSize, transform: [{ rotate: spin }] }}>
      <Image source={tokens.spinners[size]} contentFit="contain"
        style={{ width: metrics.spinnerSize, height: metrics.spinnerSize }} accessible={false} accessibilityElementsHidden />
    </Animated.View>}
    {type === 'inline' ? <Text accessible={false} allowFontScaling style={[styles.label, {
      color: tokens.text, fontFamily: tokens.labelFamily, fontSize: metrics.fontSize,
    }]}>{label}</Text> : null}
  </View>;
}

const styles = StyleSheet.create({
  container: { maxWidth: '100%', borderWidth: 1 },
  inlineContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' },
  skeletonContainer: { alignSelf: 'stretch' },
  lines: { alignSelf: 'stretch' },
  label: { flexShrink: 1, minWidth: 0 },
});
