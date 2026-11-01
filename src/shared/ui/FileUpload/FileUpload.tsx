import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { Image } from 'expo-image';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { AttachmentItem, type AttachmentFile, type AttachmentState } from '../AttachmentItem';
import { Button } from '../Button';
import { useTheme } from '../theme';

export interface UploadEntry { file: AttachmentFile; state: AttachmentState; progress?: number }
export interface FileUploadProps {
  title: string; description?: string; files: readonly UploadEntry[]; onAdd: (assets: DocumentPicker.DocumentPickerAsset[]) => void;
  onRemove?: (file: AttachmentFile) => void; onOpen?: (file: AttachmentFile) => void; onRetry?: (file: AttachmentFile) => void;
  accept?: readonly string[]; allowedExtensions?: readonly string[]; maxFiles?: number; maxSizeBytes?: number;
  formatsHint?: string; disabled?: boolean; error?: string; style?: StyleProp<ViewStyle>; testID?: string;
}
function matchesMime(mime: string | undefined, accepted: readonly string[]): boolean {
  if (!mime) return false;
  const actual = mime.toLowerCase();
  return accepted.some(type => { const pattern = type.toLowerCase(); return pattern === '*/*' || pattern === actual ||
    (pattern.endsWith('/*') && actual.startsWith(pattern.slice(0, -1))); });
}
export function FileUpload({ title, description, files, onAdd, onRemove, onOpen, onRetry, accept, allowedExtensions,
  maxFiles, maxSizeBytes, formatsHint, disabled = false, error, style, testID }: FileUploadProps) {
  const { media: t } = useTheme(); const [busy, setBusy] = useState(false); const [localError, setLocalError] = useState<string>();
  const busyRef = useRef(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const current = useRef({ files, onAdd, accept, allowedExtensions, maxFiles, maxSizeBytes, disabled });
  useLayoutEffect(() => { current.current = { files, onAdd, accept, allowedExtensions, maxFiles, maxSizeBytes, disabled }; },
    [files, onAdd, accept, allowedExtensions, maxFiles, maxSizeBytes, disabled]);
  if (!title.trim() || (description !== undefined && !description.trim()) ||
      (maxFiles !== undefined && (!Number.isSafeInteger(maxFiles) || maxFiles < 1)) ||
      (maxSizeBytes !== undefined && (!Number.isSafeInteger(maxSizeBytes) || maxSizeBytes < 1)))
    throw new Error('FileUpload requer título e limites válidos.');
  const locked = disabled || busy || (maxFiles !== undefined && files.length >= maxFiles);
  const browse = async () => {
    if (locked || busyRef.current) return;
    busyRef.current = true; setBusy(true); setLocalError(undefined);
    let selected: DocumentPicker.DocumentPickerAsset[] | undefined;
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: accept?.length ? [...accept] : '*/*', multiple: true, copyToCacheDirectory: true });
      if (result.canceled || !mounted.current) return;
      const latest = current.current; if (latest.disabled) return;
      if (latest.maxFiles !== undefined && latest.files.length + result.assets.length > latest.maxFiles) { setLocalError('O número de ficheiros excede o limite permitido.'); return; }
      if (result.assets.some(asset => latest.maxSizeBytes !== undefined && (asset.size === undefined || !Number.isFinite(asset.size) || asset.size > latest.maxSizeBytes))) {
        setLocalError('Um ficheiro excede o limite de tamanho ou não tem tamanho disponível.'); return;
      }
      if (result.assets.some(asset => (latest.accept?.length && !matchesMime(asset.mimeType, latest.accept)) ||
          (latest.allowedExtensions?.length && !latest.allowedExtensions.some(ext => asset.name.toLowerCase().endsWith(ext.toLowerCase().startsWith('.') ? ext.toLowerCase() : `.${ext.toLowerCase()}`))))) {
        setLocalError('Um ficheiro não corresponde aos formatos permitidos.'); return;
      }
      selected = result.assets;
    } catch { if (mounted.current) setLocalError('Não foi possível selecionar os ficheiros.'); }
    finally { busyRef.current = false; if (mounted.current) setBusy(false); }
    if (selected && mounted.current && !current.current.disabled) current.current.onAdd(selected);
  };
  const issue = error || localError;
  return <View testID={testID} style={[styles.container, { backgroundColor: t.background, borderColor: issue ? t.error : t.border, borderRadius: t.radius }, style]}>
    <View style={styles.heading}><Text accessibilityRole="header" allowFontScaling style={{ color: t.primary, fontFamily: t.semiboldFont, fontSize: 16 }}>{title}</Text>
      {description ? <Text allowFontScaling style={{ color: t.secondary, fontFamily: t.regularFont, fontSize: 13 }}>{description}</Text> : null}</View>
    <View style={[styles.zone, { backgroundColor: t.subtle, borderColor: issue ? t.error : t.secondary }]}>
      <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[styles.symbol, { backgroundColor: t.background }]}>
        <Image source={require('./assets/plus.svg')} style={styles.plus} accessible={false} />
      </View>
      <Text allowFontScaling style={{ color: t.primary, fontFamily: t.semiboldFont, fontSize: 14, textAlign: 'center' }}>Selecionar ficheiro</Text>
      <Text allowFontScaling style={{ color: t.secondary, fontFamily: t.regularFont, fontSize: 12, textAlign: 'center' }}>Selecione um ficheiro do dispositivo.</Text>
      <Button label="Adicionar ficheiro" fullWidth disabled={locked} loading={busy} onPress={browse} />
    </View>
    {formatsHint ? <Text allowFontScaling style={{ color: t.secondary, fontFamily: t.regularFont, fontSize: 12 }}>{formatsHint}</Text> : null}
    {issue ? <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={{ color: t.error, fontFamily: t.regularFont }}>{issue}</Text> : null}
    {files.length ? <View style={styles.list}><Text allowFontScaling style={{ color: t.secondary, fontFamily: t.semiboldFont, fontSize: 12 }}>{files.length} {files.length === 1 ? 'ficheiro selecionado' : 'ficheiros selecionados'}</Text>
      {files.map(entry => <AttachmentItem key={entry.file.id} file={entry.file} state={entry.state} progress={entry.progress}
        onOpen={onOpen} onRemove={disabled || busy ? undefined : onRemove} onRetry={disabled || busy ? undefined : onRetry} />)}</View> : null}
  </View>;
}
const styles = StyleSheet.create({ container: { alignSelf: 'stretch', maxWidth: '100%', borderWidth: 1, padding: 16, gap: 16 },
  heading: { gap: 5 }, zone: { alignSelf: 'stretch', borderWidth: 1, borderRadius: 12, padding: 16, alignItems: 'center', gap: 10 },
  symbol: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, plus: { width: 24, height: 24 },
  list: { alignSelf: 'stretch', gap: 10 } });
