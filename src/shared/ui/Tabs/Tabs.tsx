import { useId, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { Tab, type TabSize } from '../Tab';
import { TabPanel, type TabPanelSurface } from '../TabPanel';
import { useTheme } from '../theme';

export interface TabsItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
  count?: number;
  panelTitle?: string;
  panelDescription?: string;
  panelActions?: ReactNode;
  panelSurface?: TabPanelSurface;
  accessibilityLabel?: string;
}
export interface TabsProps extends Pick<ViewProps, 'testID' | 'onLayout'> {
  items: readonly TabsItem[];
  value: string;
  onChange: (id: string) => void;
  keepMounted?: boolean;
  size?: TabSize;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function Tabs({ items, value, onChange, keepMounted = false, size = 'compact',
  accessibilityLabel = 'Separadores', style, ...nativeProps }: TabsProps) {
  const { tabs: tokens } = useTheme();
  const instance = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  if (!accessibilityLabel.trim()) throw new Error('Tabs requer um nome acessível não vazio.');
  const ids = items.map(item => item.id);
  if (!items.length || ids.some(id => !id.trim()) || new Set(ids).size !== ids.length) throw new Error('Tabs requer identificadores não vazios e únicos.');
  if (!ids.includes(value)) throw new Error('Tabs requer um value correspondente a um separador.');
  const tabId = (id: string) => `tabs-${instance}-${encodeURIComponent(id)}`;
  const panelId = (id: string) => `panel-${instance}-${encodeURIComponent(id)}`;

  return <View {...nativeProps} style={[styles.container, { gap: tokens.panelGap }, style]}>
    <View style={styles.bar}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} accessible={false} accessibilityRole="tablist"
        accessibilityLabel={accessibilityLabel.trim()} contentContainerStyle={{ gap: tokens.tabGap }}>
        {items.map(item => <Tab key={item.id} id={item.id} nativeID={tabId(item.id)} label={item.label} size={size}
          count={item.count} disabled={item.disabled} selected={item.id === value} onSelect={onChange} accessibilityLabel={item.accessibilityLabel} />)}
      </ScrollView>
      <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
        style={{ height: 1, backgroundColor: tokens.border }} />
    </View>
    {items.map(item => <TabPanel key={item.id} id={panelId(item.id)} labelledBy={tabId(item.id)} active={item.id === value}
      keepMounted={keepMounted} title={item.panelTitle} description={item.panelDescription} actions={item.panelActions}
      surface={item.panelSurface}>{item.content}</TabPanel>)}
  </View>;
}

const styles = StyleSheet.create({ container: { alignSelf: 'stretch', maxWidth: '100%' }, bar: { alignSelf: 'stretch' } });
