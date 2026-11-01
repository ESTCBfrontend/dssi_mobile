import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ComponentRef, type ReactNode, type RefObject } from 'react';
import { Image } from 'expo-image';
import { AccessibilityInfo, Animated, KeyboardAvoidingView, Modal, PanResponder, Platform, Pressable, ScrollView, StyleSheet, Text, View,
  type HostInstance, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';

export type OverlayCloseReason = 'closeButton' | 'backdrop' | 'system' | 'swipe';
export interface OverlayInsets { top: number; right: number; bottom: number; left: number }
export interface OverlayFocusRefs {
  /** Elemento nativo acessível a focar após abertura; omisso: título da superfície. */
  initialFocusRef?: RefObject<HostInstance | null>;
  /** Elemento nativo acessível para o qual devolver o foco após o fecho controlado. */
  returnFocusRef?: RefObject<HostInstance | null>;
}
interface OverlaySurfaceProps extends OverlayFocusRefs {
  open: boolean; title: string; description?: string; message?: string; children?: ReactNode; actions?: ReactNode;
  onCloseRequest: (reason: OverlayCloseReason) => void; dismissible?: boolean; dismissOnBackdrop?: boolean;
  showClose?: boolean; closeLabel?: string; presentation: 'dialog' | 'bottom' | 'fullscreen';
  size?: 'compact' | 'wide'; intent?: 'neutral' | 'danger'; showHandle?: boolean;
  safeAreaInsets?: Partial<OverlayInsets>; style?: StyleProp<ViewStyle>; testID?: string;
}

/** Superfície interna partilhada: não gere o estado nem decide se uma operação pode fechar. */
export function OverlaySurface({ open, title, description, message, children, actions, onCloseRequest,
  dismissible = true, dismissOnBackdrop = false, showClose = true, closeLabel = 'Fechar', presentation,
  size = 'compact', intent = 'neutral', showHandle = true, initialFocusRef, returnFocusRef, safeAreaInsets, style, testID }: OverlaySurfaceProps) {
  const { overlay: t } = useTheme();
  const [closeFocused, setCloseFocused] = useState(false);
  const titleRef = useRef<ComponentRef<typeof Text>>(null);
  const wasOpen = useRef(false);
  const closeConfig = useRef({ open, dismissible, onCloseRequest });
  const gestureOffset = useRef(new Animated.Value(0)).current;
  const gestureConfig = useRef({ enabled: false, threshold: t.swipeThreshold, onCloseRequest });
  useLayoutEffect(() => {
    closeConfig.current = { open, dismissible, onCloseRequest };
    gestureConfig.current = { enabled: open && presentation === 'bottom' && showHandle && dismissible,
      threshold: t.swipeThreshold, onCloseRequest };
  }, [open, dismissible, onCloseRequest, presentation, showHandle, t.swipeThreshold]);
  const responder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_event, state) => gestureConfig.current.enabled && state.dy > 10 && state.dy > Math.abs(state.dx) * 1.5,
    onPanResponderMove: (_event, state) => gestureOffset.setValue(Math.max(0, state.dy)),
    onPanResponderRelease: (_event, state) => {
      const shouldClose = gestureConfig.current.enabled && state.dy >= gestureConfig.current.threshold;
      gestureOffset.setValue(0);
      if (shouldClose) gestureConfig.current.onCloseRequest('swipe');
    },
    onPanResponderTerminate: () => gestureOffset.setValue(0),
  }), [gestureOffset]);
  useEffect(() => {
    if (!open && wasOpen.current) {
      gestureOffset.setValue(0);
      const frame = requestAnimationFrame(() => { if (returnFocusRef?.current) AccessibilityInfo.sendAccessibilityEvent(returnFocusRef.current, 'focus'); });
      wasOpen.current = false;
      return () => cancelAnimationFrame(frame);
    }
    wasOpen.current = open;
    return undefined;
  }, [open, returnFocusRef, gestureOffset]);
  if (!title.trim() || (description !== undefined && !description.trim()) || (message !== undefined && !message.trim()) || (showClose && !closeLabel.trim())) {
    throw new Error('A sobreposição requer título e textos fornecidos não vazios.');
  }
  const insets = { top: 0, right: 0, bottom: 0, left: 0, ...safeAreaInsets };
  if (Object.values(insets).some(value => !Number.isFinite(value) || value < 0)) throw new Error('A sobreposição requer margens seguras finitas e não negativas.');
  const isDialog = presentation === 'dialog'; const isFull = presentation === 'fullscreen';
  const gap = isDialog ? t.gapDialog : t.gapSheet;
  const padding = isDialog ? size === 'wide' ? t.widePadding : t.compactPadding : isFull ? t.fullscreenPadding : t.bottomPadding;
  const radius = isDialog ? t.dialogRadius : isFull ? t.fullscreenRadius : t.sheetRadius;
  const maxWidth = isDialog ? size === 'wide' ? t.wideWidth : t.compactWidth : isFull ? undefined : t.sheetMaxWidth;
  const requestClose = (reason: OverlayCloseReason) => { const current = closeConfig.current; if (current.open && current.dismissible) current.onCloseRequest(reason); };
  return <Modal transparent visible={open} animationType="none" testID={testID ? `${testID}-native` : undefined}
    onRequestClose={() => requestClose('system')} onShow={() => {
      if (!closeConfig.current.open) return;
      const target = initialFocusRef?.current ?? titleRef.current;
      if (target) AccessibilityInfo.sendAccessibilityEvent(target, 'focus');
    }}>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.layer,
      isDialog ? { paddingTop: t.viewportPadding + insets.top, paddingBottom: t.viewportPadding + insets.bottom,
        paddingLeft: t.viewportPadding + insets.left, paddingRight: t.viewportPadding + insets.right, justifyContent: 'center' }
        : isFull ? styles.fillLayer : [styles.bottomLayer, { paddingTop: t.viewportPadding + insets.top }],
      { backgroundColor: t.backdrop }]}>
      <Pressable accessibilityElementsHidden importantForAccessibility="no-hide-descendants" accessible={false}
        testID={testID ? `${testID}-backdrop` : undefined} disabled={!dismissible || !dismissOnBackdrop}
        onPress={() => requestClose('backdrop')} style={StyleSheet.absoluteFill} />
      <Animated.View testID={testID} accessibilityViewIsModal aria-modal onAccessibilityEscape={() => requestClose('system')} style={[styles.surface,
        { backgroundColor: t.background, borderColor: t.border, borderRadius: radius, maxWidth,
          transform: [{ translateY: gestureOffset }] }, isFull && styles.fullscreen, style]}>
        <ScrollView testID={testID ? `${testID}-scroll` : undefined} keyboardShouldPersistTaps="handled" keyboardDismissMode="none" style={styles.scroll}
          contentContainerStyle={[{ paddingTop: padding + (isFull ? insets.top : 0), paddingBottom: padding + (isDialog ? 0 : insets.bottom),
            paddingLeft: padding + (isDialog ? 0 : insets.left), paddingRight: padding + (isDialog ? 0 : insets.right), gap }, isFull && styles.fullscreenContent]}>
          {presentation === 'bottom' && showHandle ? <View testID={testID ? `${testID}-handle` : undefined}
            accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
            {...responder.panHandlers} style={styles.handleTarget}>
            <View style={{ width: 42, height: 5, borderRadius: 2.5, backgroundColor: t.handle }} /></View> : null}
          <View style={[styles.header, { gap: isDialog ? 14 : 10 }]}>
            <View style={[styles.heading, { gap: isDialog ? 6 : 5 }]}>
              <Text ref={titleRef} accessibilityRole="header" allowFontScaling style={{ color: t.primary, fontFamily: t.semiboldFont,
                fontSize: isDialog && size === 'wide' ? 21 : 19 }}>{title}</Text>
              {description ? <Text allowFontScaling style={{ color: t.secondary, fontFamily: t.regularFont, fontSize: 13 }}>{description}</Text> : null}
            </View>
            {showClose ? <Pressable accessibilityRole="button" accessibilityLabel={closeLabel} disabled={!dismissible}
              accessibilityState={{ disabled: !dismissible }} onPress={() => requestClose('closeButton')}
              onFocus={() => setCloseFocused(true)} onBlur={() => setCloseFocused(false)} style={({ pressed }) => [styles.close,
                { backgroundColor: t.closeBackground, opacity: pressed && dismissible ? 0.75 : 1, outlineColor: t.focus,
                  outlineStyle: 'solid', outlineWidth: closeFocused && dismissible ? 2 : 0, outlineOffset: 2 }]}>
              <Image source={require('../Alert/assets/close.svg')} style={{ width: 18, height: 18 }}
                accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />
            </Pressable> : null}
          </View>
          {!isDialog && (children || message) ? <View accessible={false} style={{ height: 1, backgroundColor: t.border }} /> : null}
          {message || children ? <View style={[styles.body, isFull && styles.grow, { gap: 8 }]}>
            {message ? <Text allowFontScaling style={{ color: intent === 'danger' ? t.danger : t.secondary,
              fontFamily: t.regularFont, fontSize: 13 }}>{message}</Text> : null}{children}</View> : null}
          {actions ? <><View accessible={false} style={{ height: 1, backgroundColor: t.border }} />
            <View style={[styles.actions, { gap: isDialog ? 10 : 8 }]}>{actions}</View></> : null}
        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
  </Modal>;
}
const styles = StyleSheet.create({
  layer: { flex: 1, alignItems: 'center' }, bottomLayer: { justifyContent: 'flex-end' }, fillLayer: { justifyContent: 'center' },
  surface: { width: '100%', maxHeight: '100%', borderWidth: 1, flexShrink: 1, overflow: 'hidden' },
  fullscreen: { height: '100%' }, scroll: { flexShrink: 1 }, fullscreenContent: { flexGrow: 1 }, grow: { flexGrow: 1 },
  header: { flexDirection: 'row', alignItems: 'flex-start' }, heading: { flex: 1, minWidth: 0 },
  close: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  body: { alignSelf: 'stretch', minWidth: 0 }, actions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end' },
  handleTarget: { alignSelf: 'stretch', height: 44, marginVertical: -19.5, alignItems: 'center', justifyContent: 'center' },
});
