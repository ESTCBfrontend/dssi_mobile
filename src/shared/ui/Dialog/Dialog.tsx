import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { OverlaySurface, type OverlayCloseReason, type OverlayFocusRefs, type OverlayInsets } from '../Overlay/OverlaySurface';

export type DialogSize = 'compact' | 'wide';
export type DialogIntent = 'neutral' | 'danger';
export interface DialogProps extends OverlayFocusRefs {
  open: boolean; onCloseRequest: (reason: OverlayCloseReason) => void; title: string; description?: string;
  message?: string; children?: ReactNode; actions?: ReactNode; size?: DialogSize; intent?: DialogIntent;
  dismissible?: boolean; dismissOnBackdrop?: boolean; showClose?: boolean; closeLabel?: string;
  safeAreaInsets?: Partial<OverlayInsets>; style?: StyleProp<ViewStyle>; testID?: string;
}
export function Dialog(props: DialogProps) {
  return <OverlaySurface {...props} presentation="dialog" />;
}
