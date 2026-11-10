import { useState } from 'react';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../shared/ui/Button';
import { FormField } from '../../shared/ui/FormField';
import { TextField } from '../../shared/ui/TextField';

type Props = {
  email: string; password: string; busy: boolean; error: string | null;
  onEmailChange: (value: string) => void; onPasswordChange: (value: string) => void; onSubmit: () => void;
};

export function LoginScreen({ email, password, busy, error, onEmailChange, onPasswordChange, onSubmit }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  return <SafeAreaView edges={['top']} style={styles.safe}>
    <StatusBar style="light" />
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Image source={require('./assets/industrial.svg')} style={styles.graphic} contentFit="fill" accessible={false} />
          <Image source={require('./assets/geometry.svg')} style={styles.graphic} contentFit="fill" accessible={false} />
          <View style={styles.brand}>
            <Image source={require('./assets/brand.svg')} style={styles.emblem} accessible={false} />
            <View><Text style={styles.brandName}>AlarmeON</Text><Text style={styles.brandCaption}>FIELD OPERATIONS</Text></View>
          </View>
          <View style={styles.caption}>
            <Image source={require('./assets/dot.svg')} style={styles.dot} accessible={false} />
            <Text style={styles.captionText}>ÁREA DE COLABORADORES</Text>
          </View>
          <Text accessibilityRole="header" style={styles.welcome}>Bem-vindo de volta.</Text>
          <Text style={styles.heroSubtitle}>Aceda às suas intervenções e acompanhe o trabalho em campo.</Text>
          <View style={styles.underline} />
        </View>
        <View style={styles.form}>
          <View style={styles.formHeading}><Text accessibilityRole="header" style={styles.title}>Aceder à sua conta</Text>
            <Text style={styles.subtitle}>Utilize as suas credenciais profissionais.</Text></View>
          <FormField label="E-mail profissional">{props => <TextField {...props} size="large" value={email} onChange={onEmailChange}
            placeholder="nome@empresa.pt" autoCapitalize="none" autoCorrect={false} keyboardType="email-address" autoComplete="email" />}</FormField>
          <FormField label="Palavra-passe">{props => <View>
            <TextField {...props} size="large" value={password} onChange={onPasswordChange} inputStyle={styles.passwordInput}
              secureTextEntry={!showPassword} autoCapitalize="none" autoCorrect={false} autoComplete="password" />
            <Pressable accessibilityRole="button" accessibilityLabel={showPassword ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'}
              accessibilityState={{ selected: showPassword }} onPress={() => setShowPassword(value => !value)} style={styles.visibility}>
              <Image source={require('./assets/eye.svg')} style={styles.eye} accessible={false} />
            </Pressable>
          </View>}</FormField>
          <Text style={styles.recovery} accessibilityLabel="Recuperação de palavra-passe ainda indisponível">Esqueceu-se da palavra-passe? · Indisponível</Text>
          {error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
          <Button label="Entrar na aplicação" size="large" loading={busy} loadingLabel="A entrar…" fullWidth onPress={onSubmit} style={styles.submit} />
          <View style={styles.privacy}><Image source={require('./assets/shield.svg')} style={styles.shield} accessible={false} />
            <Text style={styles.privacyText}>Acesso seguro e reservado a colaboradores.</Text></View>
          <View style={styles.footer}><Text style={styles.footerText}>Problemas no acesso? Contacte o suporte interno.</Text>
            <Text style={styles.footerContext}>AlarmeON · Operações de campo</Text></View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: '#20272d' },
  flex: { flex: 1 }, content: { flexGrow: 1, backgroundColor: '#20272d' },
  hero: { minHeight: 285, paddingHorizontal: 24, paddingTop: 28, paddingBottom: 38, overflow: 'hidden' },
  graphic: { position: 'absolute', right: 0, top: -24, width: 390, height: 367 },
  brand: { flexDirection: 'row', gap: 9, alignItems: 'center' }, emblem: { width: 36, height: 37 },
  brandName: { color: '#fff', fontSize: 18, fontFamily: 'Inter-SemiBold' }, brandCaption: { color: '#cad5e0', fontSize: 8 },
  caption: { marginTop: 24, backgroundColor: 'rgba(52,65,76,0.7)', borderRadius: 8, minHeight: 26, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7, paddingRight: 12 },
  dot: { width: 6, height: 6 }, captionText: { color: '#cad5e0', fontSize: 10, fontFamily: 'Inter-SemiBold' },
  welcome: { color: '#fff', fontSize: 29, fontFamily: 'Inter-SemiBold', marginTop: 20 },
  heroSubtitle: { color: '#cad5e0', fontSize: 12, lineHeight: 17, marginTop: 9, maxWidth: 326 },
  underline: { backgroundColor: '#f97316', width: 42, height: 3, borderRadius: 2, marginTop: 20 },
  form: { flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 24, paddingTop: 26, paddingBottom: 28, gap: 19 },
  formHeading: { gap: 5, marginBottom: 6 }, title: { color: '#131b26', fontSize: 21, fontFamily: 'Inter-SemiBold' },
  subtitle: { color: '#677381', fontSize: 12 }, passwordInput: { paddingRight: 48 },
  visibility: { position: 'absolute', right: 4, top: 4, minWidth: 44, minHeight: 44, borderRadius: 10, backgroundColor: '#f2f4f7', alignItems: 'center', justifyContent: 'center' },
  eye: { width: 19, height: 19 }, recovery: { color: '#a64a08', fontSize: 11, fontFamily: 'Inter-SemiBold', textAlign: 'right' },
  submit: { backgroundColor: '#f97316', borderRadius: 11 }, error: { color: '#b42318' },
  privacy: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }, shield: { width: 17, height: 17 },
  privacyText: { color: '#677381', fontSize: 10, flexShrink: 1 }, footer: { alignItems: 'center', gap: 3 },
  footerText: { color: '#677381', fontSize: 11, textAlign: 'center' }, footerContext: { color: '#677381', fontSize: 10, textAlign: 'center' },
});
