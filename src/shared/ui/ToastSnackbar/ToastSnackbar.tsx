import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Image } from 'expo-image';
import { AccessibilityInfo, Platform, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { AlertIcon, type AlertIconTone } from '../AlertIcon';
import { Button } from '../Button';
import type { OverlayInsets } from '../DrawerSheet';
import { useTheme } from '../theme';

export interface ToastMessage {
  id: string; message: string; title?: string; tone?: AlertIconTone; durationMs?: number | null;
  action?: { label: string; onPress: () => void }; dismissible?: boolean;
}
function validateToast(toast: ToastMessage) {
  if (!toast.id.trim() || !toast.message.trim() || (toast.title !== undefined && !toast.title.trim()) ||
      (toast.action && !toast.action.label.trim()) || (toast.durationMs != null && (!Number.isFinite(toast.durationMs) || toast.durationMs <= 0)))
    throw new Error('ToastSnackbar requer identificador, mensagens e duração válidos.');
}
export interface ToastSnackbarProps { toast: ToastMessage; onDismiss?: () => void; style?: StyleProp<ViewStyle>; testID?: string }
export function ToastSnackbar({ toast, onDismiss, style, testID }: ToastSnackbarProps) {
  const { media: t, colors } = useTheme();
  validateToast(toast);
  return <View testID={testID} style={[styles.toast, { backgroundColor: t.background, borderColor: t.border,
    borderRadius: t.radius, shadowColor: t.primary }, style]}>
    <AlertIcon tone={toast.tone ?? 'info'} />
    <View style={styles.message} accessible accessibilityRole="alert" accessibilityLiveRegion="polite"
      accessibilityLabel={[toast.title, toast.message].filter(Boolean).join('. ')}>
      {toast.title ? <Text allowFontScaling style={{ color: t.primary, fontFamily: t.semiboldFont, fontSize: 14 }}>{toast.title}</Text> : null}
      <Text allowFontScaling style={{ color: toast.title ? t.secondary : t.primary, fontFamily: t.regularFont, fontSize: 13 }}>{toast.message}</Text>
    </View>
    {toast.action ? <Button variant="outline" label={toast.action.label} onPress={toast.action.onPress} /> : null}
    {onDismiss && toast.dismissible !== false ? <Pressable accessibilityRole="button" accessibilityLabel="Fechar notificação"
      onPress={onDismiss} style={styles.close}><Image source={require('../Alert/assets/close.svg')} tintColor={colors.textPrimary}
        style={styles.closeIcon} accessible={false} /></Pressable> : null}
  </View>;
}
interface ToastContextValue { show: (toast: ToastMessage) => void; dismiss: (id: string) => void; clear: () => void }
const ToastContext = createContext<ToastContextValue | null>(null);
export interface ToastProviderProps { children: ReactNode; safeAreaInsets?: Partial<OverlayInsets> }
/** Fila local ao provider; identificadores repetidos enquanto presentes são ignorados. */
export function ToastProvider({ children, safeAreaInsets }: ToastProviderProps) {
  const [queue, setQueue] = useState<ToastMessage[]>([]);
  const bottom = safeAreaInsets?.bottom ?? 0; const left = safeAreaInsets?.left ?? 0; const right = safeAreaInsets?.right ?? 0;
  if ([bottom, left, right].some(value => !Number.isFinite(value) || value < 0)) throw new Error('ToastProvider requer margens seguras válidas.');
  const show = useCallback((toast: ToastMessage) => {
    validateToast(toast);
    setQueue(current => current.some(item => item.id === toast.id) ? current : [...current, toast]);
  }, []);
  const dismiss = useCallback((id: string) => setQueue(current => current.filter(item => item.id !== id)), []);
  const clear = useCallback(() => setQueue([]), []);
  const active = queue[0];
  useEffect(() => {
    if (!active) return undefined;
    if (Platform.OS === 'ios') AccessibilityInfo.announceForAccessibility([active.title, active.message].filter(Boolean).join('. '));
    const duration = active.durationMs === undefined ? (active.action || active.tone === 'danger' ? null : 5000) : active.durationMs;
    if (duration === null) return undefined;
    const timer = setTimeout(() => dismiss(active.id), duration);
    return () => clearTimeout(timer);
  }, [active, dismiss]);
  const context = useMemo(() => ({ show, dismiss, clear }), [show, dismiss, clear]);
  const displayed = active ? { ...active, action: active.action ? { ...active.action, onPress: () => {
    try { active.action?.onPress(); } finally { dismiss(active.id); }
  } } : undefined } : undefined;
  return <ToastContext.Provider value={context}><View style={styles.host}>
    {children}
    {displayed ? <View pointerEvents="box-none" style={[styles.overlay, { bottom: 16 + bottom, left: 16 + left, right: 16 + right }]}>
      <ToastSnackbar toast={displayed} onDismiss={() => dismiss(displayed.id)} /></View> : null}
  </View></ToastContext.Provider>;
}
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast deve ser usado dentro de ToastProvider.');
  return context;
}
const styles = StyleSheet.create({
  host: { flex: 1 }, overlay: { position: 'absolute', zIndex: 10 },
  toast: { borderWidth: 1, padding: 16, gap: 12, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.09, shadowRadius: 8, elevation: 3 },
  message: { flex: 1, minWidth: 120, gap: 5 }, close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  closeIcon: { width: 18, height: 18 },
});
