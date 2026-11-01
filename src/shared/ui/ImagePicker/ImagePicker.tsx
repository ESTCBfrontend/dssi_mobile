import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as ExpoImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Button } from '../Button';
import { PhotoTile, type PhotoTilePhoto } from '../PhotoTile';
import type { AttachmentState } from '../AttachmentItem';
import { useTheme } from '../theme';

export interface ImageEntry { photo: PhotoTilePhoto; state: AttachmentState; progress?: number; selected?: boolean }
export interface ImagePickerProps {
  title: string; description?: string; photos: readonly ImageEntry[];
  onAdd: (assets: ExpoImagePicker.ImagePickerAsset[], source: 'gallery' | 'camera') => void;
  onRemove?: (photo: PhotoTilePhoto) => void; onOpen?: (photo: PhotoTilePhoto) => void; onRetry?: (photo: PhotoTilePhoto) => void;
  allowCamera?: boolean; maxFiles?: number; disabled?: boolean; error?: string; formatsHint?: string;
  style?: StyleProp<ViewStyle>; testID?: string;
}
export function ImagePicker({ title, description, photos, onAdd, onRemove, onOpen, onRetry, allowCamera = false,
  maxFiles, disabled = false, error, formatsHint, style, testID }: ImagePickerProps) {
  const { media: t } = useTheme(); const [busy, setBusy] = useState(false); const [localError, setLocalError] = useState<string>();
  const busyRef = useRef(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const current = useRef({ photos, onAdd, maxFiles, disabled, allowCamera });
  useLayoutEffect(() => { current.current = { photos, onAdd, maxFiles, disabled, allowCamera }; }, [photos, onAdd, maxFiles, disabled, allowCamera]);
  if (!title.trim() || (description !== undefined && !description.trim()) ||
      (maxFiles !== undefined && (!Number.isSafeInteger(maxFiles) || maxFiles < 1))) throw new Error('ImagePicker requer título e limite válidos.');
  const locked = disabled || busy || (maxFiles !== undefined && photos.length >= maxFiles);
  const select = async (source: 'gallery' | 'camera') => {
    if (locked || busyRef.current || (source === 'camera' && !allowCamera)) return;
    busyRef.current = true; setBusy(true); setLocalError(undefined);
    let selected: ExpoImagePicker.ImagePickerAsset[] | undefined;
    try {
      if (source === 'camera') {
        const permission = await ExpoImagePicker.requestCameraPermissionsAsync();
        if (!mounted.current || current.current.disabled || !current.current.allowCamera) return;
        if (!permission.granted) { setLocalError('A permissão da câmara não foi concedida.'); return; }
      }
      const result = source === 'camera'
        ? await ExpoImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 1 })
        : await ExpoImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsMultipleSelection: true, quality: 1 });
      if (result.canceled || !mounted.current) return;
      const latest = current.current; if (latest.disabled || (source === 'camera' && !latest.allowCamera)) return;
      if (latest.maxFiles !== undefined && latest.photos.length + result.assets.length > latest.maxFiles) {
        setLocalError('O número de fotografias excede o limite permitido.'); return;
      }
      selected = result.assets;
    } catch { if (mounted.current) setLocalError('Não foi possível selecionar as fotografias.'); }
    finally { busyRef.current = false; if (mounted.current) setBusy(false); }
    if (selected && mounted.current && !current.current.disabled && (source !== 'camera' || current.current.allowCamera))
      current.current.onAdd(selected, source);
  };
  const issue = error || localError;
  return <View testID={testID} style={[styles.container, { backgroundColor: t.background, borderColor: issue ? t.error : t.border, borderRadius: t.radius }, style]}>
    <View style={styles.heading}><Text accessibilityRole="header" allowFontScaling style={{ color: t.primary, fontFamily: t.semiboldFont, fontSize: 16 }}>{title}</Text>
      {description ? <Text allowFontScaling style={{ color: t.secondary, fontFamily: t.regularFont, fontSize: 13 }}>{description}</Text> : null}</View>
    <View style={styles.actions}><Button label="Escolher da galeria" fullWidth disabled={locked} loading={busy} onPress={() => select('gallery')} />
      {allowCamera ? <Button label="Tirar fotografia" fullWidth variant="outline" disabled={locked} onPress={() => select('camera')} /> : null}</View>
    {issue ? <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={{ color: t.error, fontFamily: t.regularFont }}>{issue}</Text> : null}
    {photos.length ? <View style={styles.list}><Text allowFontScaling style={{ color: t.secondary, fontFamily: t.semiboldFont, fontSize: 12 }}>{photos.length} {photos.length === 1 ? 'fotografia selecionada' : 'fotografias selecionadas'}</Text>
      <View style={styles.grid}>{photos.map(entry => <PhotoTile key={entry.photo.id} photo={entry.photo} state={entry.state}
        progress={entry.progress} selected={entry.selected} onOpen={onOpen} onRemove={disabled || busy ? undefined : onRemove}
        onRetry={disabled || busy ? undefined : onRetry} />)}</View></View>
      : <View style={[styles.empty, { backgroundColor: t.subtle, borderColor: t.border }]}>
        <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[styles.symbol, { backgroundColor: t.background }]}>
          <Image source={require('./assets/plus.svg')} style={styles.plus} accessible={false} /></View>
        <Text allowFontScaling style={{ color: t.primary, fontFamily: t.semiboldFont, fontSize: 14, textAlign: 'center' }}>Ainda não existem fotografias</Text>
        <Text allowFontScaling style={{ color: t.secondary, fontFamily: t.regularFont, fontSize: 12, textAlign: 'center' }}>Fotografe ou selecione imagens guardadas no dispositivo.</Text></View>}
    {formatsHint ? <Text allowFontScaling style={{ color: t.secondary, fontFamily: t.regularFont, fontSize: 11 }}>{formatsHint}</Text> : null}
  </View>;
}
const styles = StyleSheet.create({ container: { alignSelf: 'stretch', maxWidth: '100%', borderWidth: 1, padding: 16, gap: 14 },
  heading: { gap: 5 }, actions: { gap: 8 }, list: { gap: 9 }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  empty: { alignSelf: 'stretch', borderWidth: 1, borderRadius: 12, padding: 18, alignItems: 'center', gap: 10 },
  symbol: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, plus: { width: 24, height: 24 } });
