import { useState } from 'react';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View, type PressableProps, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { AlertIcon, type AlertIconTone } from '../AlertIcon';
import { Button } from '../Button';
import { useTheme } from '../theme';

export type AlertLayout = 'compact' | 'detailed';
export interface AlertAction { label: string; onPress: NonNullable<PressableProps['onPress']> }
export interface AlertProps extends Pick<ViewProps, 'testID' | 'nativeID' | 'onLayout'> {
  tone?: AlertIconTone;
  layout?: AlertLayout;
  title: string;
  message?: string;
  action?: AlertAction;
  onDismiss?: NonNullable<PressableProps['onPress']>;
  dismissLabel?: string;
  toneLabel?: string;
  accessibilityLiveRegion?: ViewProps['accessibilityLiveRegion'];
  style?: StyleProp<ViewStyle>;
}

const defaultToneLabels: Record<AlertIconTone, string> = {
  info: 'Informação', success: 'Sucesso', warning: 'Aviso', danger: 'Erro',
};
const closeIcon = require('./assets/close.svg');

export function Alert({ tone = 'info', layout = 'compact', title, message, action, onDismiss,
  dismissLabel = 'Fechar alerta', toneLabel, accessibilityLiveRegion = 'none', style, ...nativeProps }: AlertProps) {
  const { alert: tokens, colors } = useTheme();
  const [closeFocused, setCloseFocused] = useState(false);
  const severity = toneLabel ?? defaultToneLabels[tone];
  if (!title.trim()) throw new Error('Alert requer um título não vazio.');
  if (!severity.trim()) throw new Error('Alert requer uma indicação de tipo não vazia.');
  if (layout === 'detailed' && !message?.trim()) throw new Error('Alert detalhado requer uma mensagem não vazia.');
  if (layout === 'compact' && message !== undefined) throw new Error('Alert compacto não apresenta mensagem; usa o layout detailed.');
  if (onDismiss && !dismissLabel.trim()) throw new Error('Alert requer uma etiqueta de fecho não vazia.');

  return <View {...nativeProps} style={[styles.container, { backgroundColor: tokens.background[tone],
    borderColor: tokens.border, borderRadius: tokens.radius, padding: tokens.padding, gap: tokens.gap }, style]}>
    <AlertIcon tone={tone} />
    <View style={[styles.content, { gap: tokens.contentGap }]}>
      <View accessible accessibilityRole="alert" accessibilityLiveRegion={accessibilityLiveRegion}
        accessibilityLabel={[severity.trim(), title.trim(), message?.trim()].filter(Boolean).join('. ')}>
        <Text allowFontScaling style={{ color: tokens.text, fontFamily: tokens.titleFamily, fontSize: tokens.titleSize }}>{title}</Text>
        {layout === 'detailed' ? <Text allowFontScaling style={{ marginTop: tokens.contentGap, color: tokens.text,
          fontFamily: tokens.messageFamily, fontSize: tokens.messageSize }}>{message}</Text> : null}
      </View>
      {action ? <Button label={action.label} onPress={action.onPress} variant="outline" size="medium" /> : null}
    </View>
    {onDismiss ? <Pressable accessibilityRole="button" accessibilityLabel={dismissLabel.trim()} onPress={onDismiss}
      onFocus={() => setCloseFocused(true)} onBlur={() => setCloseFocused(false)}
      style={({ pressed }) => [styles.close, { opacity: pressed ? 0.7 : 1, outlineColor: colors.borderFocus,
        outlineStyle: 'solid', outlineWidth: closeFocused ? 2 : 0, outlineOffset: 2 }]}>
      <Image source={closeIcon} contentFit="contain" accessible={false} accessibilityElementsHidden
        style={{ width: 18, height: 18 }} />
    </Pressable> : null}
  </View>;
}

const styles = StyleSheet.create({
  container: { alignSelf: 'stretch', maxWidth: '100%', flexDirection: 'row', alignItems: 'flex-start', borderWidth: 1 },
  content: { flex: 1, minWidth: 0 },
  close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', flexShrink: 0, borderRadius: 8 },
});
