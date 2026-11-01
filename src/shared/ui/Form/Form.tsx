import { useState, type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Button } from '../Button';
import { useTheme } from '../theme';

export interface FormProps {
  title: string; description?: string; children: ReactNode; onSubmit: () => void; submitLabel: string;
  onReset?: () => void; resetLabel?: string; pending?: boolean; error?: string; footerNote?: string;
  layout?: 'stacked' | 'wide'; style?: StyleProp<ViewStyle>; testID?: string;
}
export function Form({ title, description, children, onSubmit, submitLabel, onReset, resetLabel = 'Limpar',
  pending = false, error, footerNote, layout = 'stacked', style, testID }: FormProps) {
  const { form: t } = useTheme(); const [width, setWidth] = useState(0);
  if (!title.trim() || !submitLabel.trim() || (onReset && !resetLabel.trim()) ||
      (description !== undefined && !description.trim()) || (error !== undefined && !error.trim()))
    throw new Error('Form requer título, ações e mensagens fornecidas não vazias.');
  const wide = layout === 'wide' && width >= t.wideBreakpoint;
  return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.avoid}>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
      <View testID={testID} onLayout={event => setWidth(event.nativeEvent.layout.width)} style={[styles.form, { gap: t.gap,
        backgroundColor: t.background, borderColor: t.border, borderRadius: t.radius, padding: wide ? t.widePadding : t.padding }, style]}>
        <View style={{ gap: 7 }}><Text accessibilityRole="header" allowFontScaling style={{ color: t.primary, fontFamily: t.semiboldFont, fontSize: 22, lineHeight: 30 }}>{title}</Text>
          {description ? <Text allowFontScaling style={{ color: t.secondary, fontFamily: t.regularFont, fontSize: 14, lineHeight: 21 }}>{description}</Text> : null}</View>
        {children}
        <View accessible={false} style={{ backgroundColor: t.border, height: 1 }} />
        {error ? <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={{ color: t.danger, fontFamily: t.regularFont }}>{error}</Text> : null}
        {footerNote ? <Text allowFontScaling style={{ color: t.secondary, fontFamily: t.regularFont, fontSize: 12 }}>{footerNote}</Text> : null}
        <View style={[styles.actions, wide && styles.wide, { gap: 10 }]}>
          {onReset ? <Button label={resetLabel} variant="secondary" disabled={pending} fullWidth={!wide} onPress={onReset} /> : null}
          <Button label={submitLabel} loading={pending} fullWidth={!wide} onPress={onSubmit} />
        </View>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>;
}
const styles = StyleSheet.create({ avoid: { flexShrink: 1 }, content: { flexGrow: 1 },
  form: { alignSelf: 'stretch', maxWidth: '100%', borderWidth: 1 }, actions: { alignSelf: 'stretch' },
  wide: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end' } });
