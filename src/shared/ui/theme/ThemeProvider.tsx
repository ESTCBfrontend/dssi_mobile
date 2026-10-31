import { createContext, useContext, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { useFonts } from 'expo-font';
import { defaultThemes, type AppTheme, type ThemeMode, type ThemeSet } from './tokens';

interface ThemeContextValue {
  theme: AppTheme;
  themes: ThemeSet;
  mode: ThemeMode;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const fonts = { 'Inter-Medium': require('../../../../assets/fonts/Inter-Medium.ttf'), 'Inter-Regular': require('../../../../assets/fonts/Inter-Regular.ttf'), 'Inter-SemiBold': require('../../../../assets/fonts/Inter-SemiBold.ttf') };

export interface ThemeProviderProps {
  children: ReactNode;
  /** Omisso: herda o provider exterior ou acompanha o sistema. */
  mode?: ThemeMode;
  /** Omisso: herda os temas exteriores ou usa os tokens claros do Figma. */
  themes?: ThemeSet;
  /** Conteúdo da composição enquanto a fonte local está a carregar. */
  fallback?: ReactNode;
}

export function ThemeProvider({ children, mode, themes, fallback = null }: ThemeProviderProps) {
  const parent = useContext(ThemeContext);
  const systemScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts(fonts);
  const selectedMode = mode ?? parent?.mode ?? 'system';
  const selectedThemes = themes ?? parent?.themes ?? defaultThemes;
  const requestedScheme = selectedMode === 'system' ? systemScheme : selectedMode;
  // Um tema escuro só é usado quando a composição fornece essa paleta explicitamente.
  const theme = requestedScheme === 'dark'
    ? selectedThemes.dark ?? selectedThemes.light
    : selectedThemes.light;

  if (fontError) throw fontError;
  if (!fontsLoaded) return fallback;

  return (
    <ThemeContext.Provider value={{ theme, themes: selectedThemes, mode: selectedMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): AppTheme {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme deve ser usado dentro de ThemeProvider.');
  return context.theme;
}
