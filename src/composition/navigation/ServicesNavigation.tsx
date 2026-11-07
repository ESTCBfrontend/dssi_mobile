import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { NavItem } from '../../shared/ui/NavItem';
import { lightTheme, ThemeProvider } from '../../shared/ui/theme';

const navTheme = { light: { ...lightTheme, navigation: { ...lightTheme.navigation,
  surface: '#20272d', subtle: '#303b48', secondary: '#cad5e0', brandText: '#ffffff', activeIndicator: '#f97316' } } };
const destinations = [
  { label: 'Início', icon: require('./assets/home.svg') },
  { label: 'Serviços', icon: require('./assets/services.svg') },
  { label: 'Agenda', icon: require('./assets/agenda.svg') },
  { label: 'Perfil', icon: require('./assets/profile.svg') },
] as const;

export function ServicesNavigation() {
  return <ThemeProvider themes={navTheme}><View accessibilityRole="tablist" style={styles.navigation}>
    {destinations.map(item => {
      const selected = item.label === 'Serviços';
      return <NavItem key={item.label} label={item.label} selected={selected} disabled={!selected}
        accessibilityHint={selected ? undefined : 'Ainda não disponível'} onPress={() => {}} style={styles.item}
        icon={<Image source={item.icon} style={styles.icon} accessible={false} />} />;
    })}
  </View></ThemeProvider>;
}

const styles = StyleSheet.create({
  navigation: { flexDirection: 'row', backgroundColor: '#20272d', paddingHorizontal: 12, borderTopLeftRadius: 18, borderTopRightRadius: 18 },
  item: { flex: 1 }, icon: { width: 23, height: 23 },
});
