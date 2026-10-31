import { useState, type ComponentRef, type ReactNode, type Ref } from 'react';
import {
  ActivityIndicator, Pressable, StyleSheet, Text, View,
  type PressableProps, type StyleProp, type TextStyle, type ViewStyle,
} from 'react-native';
import { useTheme } from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';
export interface ButtonIconProps { color: string; size: number }
export type ButtonIcon = ReactNode | ((props: ButtonIconProps) => ReactNode);

type NativeButtonProps = Pick<PressableProps,
  'accessibilityHint' | 'accessibilityLabel' | 'testID' | 'nativeID' | 'onLayout' |
  'onFocus' | 'onBlur' | 'onLongPress' | 'onPressIn' | 'onPressOut' | 'hitSlop' | 'delayLongPress'
>;

export interface ButtonProps extends NativeButtonProps {
  label: string;
  onPress: NonNullable<PressableProps['onPress']>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  /** Estado controlado pelo consumidor; não executa nem gere pedidos de rede. */
  loading?: boolean;
  loadingLabel?: string;
  fullWidth?: boolean;
  iconStart?: ButtonIcon;
  iconEnd?: ButtonIcon;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  ref?: Ref<ComponentRef<typeof Pressable>>;
}

export function Button({
  label, onPress, variant = 'primary', size = 'medium', disabled = false,
  loading = false, loadingLabel, fullWidth = false, iconStart, iconEnd,
  style, textStyle, accessibilityLabel, hitSlop = 4, onFocus, onBlur, ref, ...nativeProps
}: ButtonProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  if (!label.trim()) throw new Error('Button requer uma label não vazia.');

  const locked = disabled || loading;
  const palette = {
    primary: { background: theme.colors.actionPrimary, foreground: theme.colors.textOnPrimary },
    secondary: { background: theme.colors.actionSecondary, foreground: theme.colors.textPrimary },
    outline: { background: theme.colors.surface, foreground: theme.colors.textBrand },
    danger: { background: theme.colors.actionDanger, foreground: theme.colors.textOnDanger },
  }[variant];
  const foreground = disabled ? theme.colors.textDisabled : palette.foreground;
  const borderColor = disabled
    ? theme.colors.borderDisabled
    : variant === 'outline' ? theme.colors.borderFocus : palette.background;
  const metrics = {
    small: { minHeight: theme.controls.minTouchSize, paddingHorizontal: theme.spacing.md },
    medium: { minHeight: theme.controls.mediumHeight, paddingHorizontal: theme.spacing.lg },
    large: { minHeight: theme.controls.largeHeight, paddingHorizontal: theme.spacing.xl },
  }[size];
  const iconProps = { color: foreground, size: 24 };
  const renderIcon = (icon: ButtonIcon) => typeof icon === 'function' ? icon(iconProps) : icon;
  const startIcon = loading ? null : renderIcon(iconStart);
  const endIcon = renderIcon(iconEnd);

  return (
    <Pressable
      {...nativeProps}
      ref={ref}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel?.trim() || label}
      accessibilityState={{ disabled: locked, busy: loading }}
      disabled={locked}
      focusable={!locked}
      hitSlop={hitSlop}
      onPress={onPress}
      onFocus={(event) => { setFocused(true); onFocus?.(event); }}
      onBlur={(event) => { setFocused(false); onBlur?.(event); }}
      style={({ pressed }) => [
        styles.button,
        metrics,
        {
          minWidth: theme.controls.minTouchSize,
          paddingVertical: size === 'small' ? theme.spacing.sm : theme.spacing.md,
          gap: theme.spacing.sm,
          borderRadius: theme.radius.control,
          backgroundColor: disabled ? theme.colors.actionDisabled : palette.background,
          borderColor,
          // O stroke ocupa espaço apenas nas variantes que o têm no Figma.
          borderWidth: disabled || variant === 'outline' ? 1 : 0,
          outlineColor: theme.colors.borderFocus,
          outlineStyle: 'solid',
          outlineWidth: focused && !locked ? 2 : 0,
          outlineOffset: 2,
          opacity: pressed && !locked ? 0.9 : 1,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={foreground}
          size="small"
          accessible={false}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
      ) : startIcon ? (
        <View pointerEvents="none" accessible={false} accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants" style={styles.icon}>
          {startIcon}
        </View>
      ) : null}
      <Text allowFontScaling style={[
        styles.label,
        {
          color: foreground,
          fontFamily: theme.typography.buttonFamily,
          fontWeight: theme.typography.buttonWeight,
          fontSize: theme.typography.buttonSize[size],
        },
        textStyle,
      ]}>
        {loading ? loadingLabel || label : label}
      </Text>
      {endIcon ? (
        <View pointerEvents="none" accessible={false} accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants" style={styles.icon}>
          {endIcon}
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start', maxWidth: '100%', flexShrink: 1,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  fullWidth: { alignSelf: 'stretch' },
  label: { flexShrink: 1, minWidth: 0, textAlign: 'center' },
  icon: { flexShrink: 0, alignItems: 'center', justifyContent: 'center' },
});
