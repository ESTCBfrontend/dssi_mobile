import { QueryClient, QueryClientProvider, focusManager } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { AppState, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ServicesNavigation } from '../composition/navigation/ServicesNavigation';
import { ThemeProvider } from '../shared/ui/theme';

import { appDataSource } from '../composition/data-source/appDataSource';
import { ENABLE_DEBUG_LAYER } from '../composition/debug/debugConfig';
import { appWorkOrderServices } from '../composition/work-orders/appWorkOrderServices';
import { WorkOrderSourceProvider } from '../composition/work-orders/WorkOrderSourceProvider';

const DebugLayer = __DEV__ && ENABLE_DEBUG_LAYER
  ? require('../composition/debug/DebugLayer').DebugLayer as typeof import('../composition/debug/DebugLayer').DebugLayer
  : null;

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    if (Platform.OS === 'web') return undefined;
    const subscription = AppState.addEventListener('change', state => {
      focusManager.setFocused(state === 'active');
    });
    return () => subscription.remove();
  }, []);

  return <ThemeProvider><QueryClientProvider client={queryClient}>
    <WorkOrderSourceProvider selection={appDataSource} services={appWorkOrderServices}><View style={styles.container}>
      <SafeAreaView edges={['bottom']} style={styles.shell}>
        <Stack screenOptions={{ headerShown: false }} />
        <ServicesNavigation />
      </SafeAreaView>
      {DebugLayer && <DebugLayer selection={appDataSource} />}
    </View></WorkOrderSourceProvider>
  </QueryClientProvider></ThemeProvider>;
}

const styles = StyleSheet.create({ container: { flex: 1 }, shell: { flex: 1, backgroundColor: '#20272d' } });
