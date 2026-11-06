import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { appDataSource } from './src/app/data-source/appDataSource';
import { ENABLE_DEBUG_LAYER } from './src/app/debug/debugConfig';

const DebugLayer = __DEV__ && ENABLE_DEBUG_LAYER
  ? require('./src/app/debug/DebugLayer').DebugLayer as typeof import('./src/app/debug/DebugLayer').DebugLayer
  : null;

export default function App() {
  return (
    <View style={styles.container}>
      <Text accessibilityRole="header">DSSI Mobile</Text>
      <Text>Base da aplicação mobile do projeto DSSI.</Text>
      <StatusBar style="auto" />
      {DebugLayer && <DebugLayer selection={appDataSource} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
});
