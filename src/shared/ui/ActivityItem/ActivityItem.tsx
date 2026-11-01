import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import type { ActivityType } from '../theme/activityItemTokens';

export type { ActivityType } from '../theme/activityItemTokens';
export interface ActivityEvent {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  author: string;
  timestamp: number;
  when: string;
  reference: string;
}
export interface ActivityItemProps extends Pick<ViewProps, 'testID' | 'nativeID' | 'onLayout'> {
  event: ActivityEvent;
  onOpenRelated?: (event: ActivityEvent) => void;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
}

export function validateActivityEvent(event: ActivityEvent) {
  if (!event.id.trim() || !event.title.trim() || !event.author.trim() || !event.when.trim() || !event.reference.trim() || !Number.isFinite(event.timestamp)) {
    throw new Error('ActivityItem requer id, título, autor, data, referência e timestamp válidos.');
  }
  if (event.description !== undefined && !event.description.trim()) throw new Error('ActivityItem requer uma descrição não vazia quando fornecida.');
}

export function ActivityItem({ event, onOpenRelated, accessibilityHint, style, ...nativeProps }: ActivityItemProps) {
  const { activityItem: tokens } = useTheme();
  const [focused, setFocused] = useState(false);
  validateActivityEvent(event);
  const palette = tokens.types[event.type];
  const containerStyle = [styles.container, { backgroundColor: tokens.background, borderColor: tokens.border, borderRadius: tokens.radius,
    paddingHorizontal: tokens.paddingHorizontal, paddingVertical: tokens.paddingVertical, gap: tokens.gap }, style];
  const content = <>
    <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" pointerEvents="none"
      style={[styles.symbol, { width: tokens.symbolSize, height: tokens.symbolSize, borderRadius: tokens.symbolRadius, backgroundColor: palette.background }]}>
      <Text allowFontScaling={false} style={{ color: palette.text, fontFamily: tokens.symbolFamily, fontSize: tokens.symbolFontSize }}>{palette.symbol}</Text>
    </View>
    <View style={[styles.content, { gap: tokens.contentGap }]}>
      <Text allowFontScaling style={{ color: tokens.titleColor, fontFamily: tokens.titleFamily, fontSize: tokens.titleSize }}>{event.title}</Text>
      {event.description ? <Text allowFontScaling style={{ color: tokens.secondary, fontFamily: tokens.bodyFamily, fontSize: tokens.bodySize }}>{event.description}</Text> : null}
      <View style={{ gap: tokens.metaGap }}>
        {[event.author, event.when, event.reference].map((value, index) => <Text key={index} allowFontScaling
          style={{ color: tokens.secondary, fontFamily: tokens.metaFamily, fontSize: tokens.metaSize }}>{value}</Text>)}
      </View>
    </View>
  </>;
  if (onOpenRelated) return <Pressable {...nativeProps} accessible accessibilityRole="button"
    accessibilityLabel={[event.title, event.description, event.author, event.when, event.reference].filter(Boolean).join('. ')}
    accessibilityHint={accessibilityHint} onPress={() => onOpenRelated(event)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => [...containerStyle, { opacity: pressed ? 0.9 : 1, outlineColor: tokens.focus,
      outlineStyle: 'solid', outlineWidth: focused ? 2 : 0, outlineOffset: 2 }]}>{content}</Pressable>;
  return <View {...nativeProps} style={containerStyle}>{content}</View>;
}

const styles = StyleSheet.create({
  container: { alignSelf: 'stretch', maxWidth: '100%', borderWidth: 1, flexDirection: 'row', alignItems: 'flex-start' },
  symbol: { alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  content: { flex: 1, minWidth: 0 },
});
