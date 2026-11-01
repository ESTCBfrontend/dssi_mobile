import { useState } from 'react';
import { Image } from 'expo-image';
import { Pressable } from 'react-native';
import { useTheme } from '../theme';

/** Botão interno para a mesma ação de remoção nos dois componentes de media. */
export function MediaAction({ label, onPress }: { label: string; onPress: () => void }) {
  const { media: t } = useTheme();
  const [focused, setFocused] = useState(false);
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => ({ width: 44, height: 44, alignItems: 'center', justifyContent: 'center',
      borderRadius: t.actionRadius, backgroundColor: t.subtle, opacity: pressed ? 0.8 : 1,
      outlineStyle: 'solid', outlineColor: t.focus, outlineWidth: focused ? 2 : 0, outlineOffset: 2 })}>
    <Image source={require('./assets/close.svg')} style={{ width: 18, height: 18 }} contentFit="contain" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />
  </Pressable>;
}
