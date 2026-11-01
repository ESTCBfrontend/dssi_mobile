import { useState } from 'react';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Button } from '../Button';
import { ProgressBar } from '../ProgressBar';
import { StatusBadge } from '../StatusBadge';
import { MediaAction } from '../MediaAction/MediaAction';
import { useTheme } from '../theme';

export type AttachmentState = 'ready' | 'uploading' | 'error';
export interface AttachmentFile { id: string; name: string; details: string; kind: 'document' | 'photo'; uri?: string }
export interface AttachmentItemProps {
  file: AttachmentFile;
  state: AttachmentState;
  /** Percentagem determinada, obrigatória durante o envio. */
  progress?: number;
  onOpen?: (file: AttachmentFile) => void;
  onRemove?: (file: AttachmentFile) => void;
  onRetry?: (file: AttachmentFile) => void;
  labels?: Partial<{ ready: string; uploading: string; error: string; errorDetails: string; progress: string; retry: string; open: string; remove: string }>;
  uploadingDetails?: (progress: number) => string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function AttachmentItem({ file, state, progress, onOpen, onRemove, onRetry, labels, uploadingDetails, style, testID }: AttachmentItemProps) {
  const { media: t } = useTheme();
  const [focused, setFocused] = useState(false);
  const [failedUri, setFailedUri] = useState<string | null>(null);
  if (!file.id.trim() || !file.name.trim() || !file.details.trim()) throw new Error('AttachmentItem requer id, nome e detalhes não vazios.');
  if (state === 'uploading' && (progress === undefined || !Number.isFinite(progress) || progress < 0 || progress > 100)) {
    throw new Error('AttachmentItem requer progresso entre 0 e 100 durante o envio.');
  }
  const text = { ready: 'Pronto para anexar', uploading: 'A enviar ficheiro...', error: 'Não foi possível enviar',
    errorDetails: 'O envio falhou. Pode voltar a tentar.', progress: 'Progresso do envio', retry: 'Repetir',
    open: 'Abrir', remove: 'Remover', ...labels };
  const preview = file.kind === 'photo'
    ? <Image source={file.uri && file.uri !== failedUri ? { uri: file.uri } : require('../MediaAction/assets/attachment-photo.svg')}
      onError={() => { if (file.uri && failedUri !== file.uri) setFailedUri(file.uri); }} style={styles.preview} contentFit="cover" />
    : <View style={[styles.preview, styles.document, { backgroundColor: t.subtle }]}><View style={{ width: 24, height: 30,
      backgroundColor: t.background, borderColor: t.brand, borderWidth: 1.7, borderRadius: 3 }} /><View style={{ width: 14,
      height: 3, backgroundColor: t.brand, borderRadius: 1.5 }} /></View>;
  const main = <><View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">{preview}</View>
    <View style={styles.nameStack}><Text allowFontScaling style={{ fontFamily: t.semiboldFont, fontSize: 14, color: t.primary }}>{file.name}</Text>
      <Text allowFontScaling style={{ fontFamily: t.regularFont, fontSize: 12, color: t.secondary }}>{file.details}</Text></View></>;
  return <View testID={testID} style={[styles.container, { backgroundColor: t.background, borderColor: state === 'error' ? t.error : t.border, borderRadius: t.radius }, style]}>
    {onOpen ? <Pressable accessibilityRole="button" accessibilityLabel={`${text.open} ${file.name}`} onPress={() => onOpen(file)}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={[styles.main, { outlineStyle: 'solid', outlineColor: t.focus, outlineWidth: focused ? 2 : 0 }]}>{main}</Pressable>
      : <View style={styles.main}>{main}</View>}
    <View style={styles.statusRow}><StatusBadge size="small" showDot tone={state === 'ready' ? 'success' : state === 'uploading' ? 'info' : 'danger'} label={text[state]} />
      {onRemove && state !== 'uploading' ? <MediaAction label={`${text.remove} ${file.name}`} onPress={() => onRemove(file)} /> : null}</View>
    {state === 'uploading' ? <><Text allowFontScaling style={{ color: t.secondary, fontFamily: t.regularFont, fontSize: 12 }}>{uploadingDetails?.(progress!) ?? `A enviar... ${Math.round(progress!)}%`}</Text>
      <ProgressBar size="compact" label={text.progress} value={progress!} /></> : null}
    {state === 'error' ? <View style={styles.errorRow}><Text allowFontScaling style={[styles.errorText, { color: t.error, fontFamily: t.regularFont, fontSize: 12 }]}>{text.errorDetails}</Text>
      {onRetry ? <Button label={text.retry} variant="outline" onPress={() => onRetry(file)} /> : null}</View> : null}
  </View>;
}

const styles = StyleSheet.create({
  container: { alignSelf: 'stretch', maxWidth: '100%', borderWidth: 1, padding: 14, gap: 10 },
  main: { flexDirection: 'row', alignItems: 'center', gap: 12, minWidth: 0 },
  preview: { width: 52, height: 52, borderRadius: 10 },
  document: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  nameStack: { flex: 1, minWidth: 0, gap: 5 },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 },
  errorRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 9 },
  errorText: { flex: 1, minWidth: 100 },
});
