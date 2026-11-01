import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { OverlaySurface, type OverlayCloseReason, type OverlayFocusRefs, type OverlayInsets } from '../Overlay/OverlaySurface';

/** As variantes mobile do Figma são bottom e fullscreen. */
export type DrawerSheetPlacement = 'bottom' | 'fullscreen';
export interface DrawerSheetProps extends OverlayFocusRefs {
  open: boolean; onCloseRequest: (reason: OverlayCloseReason) => void; title: string; description?: string;
  message?: string; children?: ReactNode; actions?: ReactNode; placement?: DrawerSheetPlacement;
  dismissible?: boolean; dismissOnBackdrop?: boolean; showClose?: boolean; closeLabel?: string; showHandle?: boolean;
  safeAreaInsets?: Partial<OverlayInsets>; style?: StyleProp<ViewStyle>; testID?: string;
}
export function DrawerSheet({ placement = 'bottom', ...props }: DrawerSheetProps) {
  return <OverlaySurface {...props} presentation={placement} />;
}
