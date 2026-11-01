import { useState } from 'react';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Button } from '../Button';
import { MediaAction } from '../MediaAction/MediaAction';
import { StatusBadge } from '../StatusBadge';
import { useTheme } from '../theme';
import type { AttachmentState } from '../AttachmentItem';

export interface PhotoTilePhoto { id: string; name: string; uri?: string; alt?: string }
export interface PhotoTileProps {
  photo: PhotoTilePhoto;
  state: AttachmentState;
  progress?: number;
  selected?: boolean;
  onOpen?: (photo: PhotoTilePhoto) => void;
  onRemove?: (photo: PhotoTilePhoto) => void;
  onRetry?: (photo: PhotoTilePhoto) => void;
  labels?: Partial<{ ready: string; uploading: string; error: string; retry: string; open: string; remove: string; progress: string }>;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function PhotoTile({ photo, state, progress, selected = false, onOpen, onRemove, onRetry, labels, style, testID }: PhotoTileProps) {
  const { media: t } = useTheme();
  const [focused, setFocused] = useState(false);
  const [failedUri, setFailedUri] = useState<string | null>(null);
  if (!photo.id.trim() || !photo.name.trim()) throw new Error('PhotoTile requer id e nome não vazios.');
  if (state === 'uploading' && (progress === undefined || !Number.isFinite(progress) || progress < 0 || progress > 100)) {
    throw new Error('PhotoTile requer progresso entre 0 e 100 durante o envio.');
  }
  const text = { ready: 'Guardada', uploading: 'A enviar...', error: 'Erro de envio', retry: 'Repetir', open: 'Abrir',
    remove: 'Remover', progress: 'Progresso do envio', ...labels };
  const preview = <View style={[styles.preview, { backgroundColor: t.photoBackground, borderRadius: t.previewRadius }]}>
    {photo.uri && photo.uri !== failedUri ? <Image source={{ uri: photo.uri }} style={styles.photo} contentFit="cover" accessible={!onOpen}
      testID={testID ? `${testID}-image` : undefined} onError={() => setFailedUri(photo.uri ?? null)} accessibilityLabel={photo.alt || photo.name} />
      : <View style={styles.photo} accessible={!onOpen} accessibilityRole="image" accessibilityLabel={photo.alt || photo.name}>
        <Image source={require('../MediaAction/assets/sun.svg')} style={styles.sun} />
        <Image source={require('../MediaAction/assets/landscape-large.svg')} style={styles.large} />
        <Image source={require('../MediaAction/assets/landscape-near.svg')} style={styles.near} />
      </View>}
  </View>;
  return <View testID={testID} style={[styles.container, { backgroundColor: t.background, borderColor: selected ? t.focus : state === 'error' ? t.error : t.border, borderRadius: t.radius }, style]}>
    {onOpen ? <Pressable accessibilityRole="button" accessibilityState={{ selected }} accessibilityLabel={`${text.open} ${photo.alt || photo.name}`}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onPress={() => onOpen(photo)}
      style={{ outlineStyle: 'solid', outlineColor: t.focus, outlineWidth: focused ? 2 : 0 }}>{preview}</Pressable> : preview}
    <Text allowFontScaling style={{ fontFamily: t.semiboldFont, fontSize: 12, color: t.primary }}>{photo.name}</Text>
    <View style={styles.statusRow}><StatusBadge size="small" showDot tone={state === 'ready' ? 'success' : state === 'uploading' ? 'info' : 'danger'} label={text[state]} />
      {onRemove && state !== 'uploading' ? <MediaAction label={`${text.remove} ${photo.name}`} onPress={() => onRemove(photo)} /> : null}</View>
    {state === 'uploading' ? <View accessible accessibilityRole="progressbar" accessibilityLabel={text.progress}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(progress!), text: `${Math.round(progress!)}%` }}
      style={[styles.track, { backgroundColor: t.track }]}><View style={{ width: `${progress!}%`, height: 6, borderRadius: 3, backgroundColor: t.brand }} /></View> : null}
    {state === 'error' && onRetry ? <Button label={text.retry} variant="outline" fullWidth onPress={() => onRetry(photo)} /> : null}
  </View>;
}

const styles = StyleSheet.create({
  container: { width: 154, maxWidth: '100%', borderWidth: 1, padding: 9, gap: 8 },
  preview: { width: '100%', height: 102, overflow: 'hidden' },
  photo: { width: '100%', height: '100%' },
  sun: { position: 'absolute', right: 15, top: 18, width: 26, height: 26 },
  large: { position: 'absolute', left: 13, top: 44, width: 103.057, height: 71.25 },
  near: { position: 'absolute', left: 69, top: 60, width: 74.4782, height: 51.75 },
  statusRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  track: { height: 6, borderRadius: 3, overflow: 'hidden' },
});
