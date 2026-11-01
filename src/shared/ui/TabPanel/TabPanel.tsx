import { type ReactNode, useState } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { ContentPanel } from '../ContentPanel';
import { useTheme } from '../theme';

export type TabPanelSurface = 'surface' | 'muted';
export interface TabPanelProps extends Pick<ViewProps, 'testID' | 'onLayout'> {
  id: string;
  labelledBy?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
  active?: boolean;
  keepMounted?: boolean;
  surface?: TabPanelSurface;
  style?: StyleProp<ViewStyle>;
}

export function TabPanel({ id, labelledBy, title, description, actions, children, active = true, keepMounted = false,
  surface = 'surface', style, onLayout, ...nativeProps }: TabPanelProps) {
  const { tabPanel: tokens } = useTheme();
  const [width, setWidth] = useState(0);
  if (!id.trim()) throw new Error('TabPanel requer um id não vazio.');
  if (labelledBy !== undefined && !labelledBy.trim()) throw new Error('TabPanel requer um labelledBy não vazio.');
  if (title !== undefined && !title.trim()) throw new Error('TabPanel requer um título não vazio quando fornecido.');
  if (description !== undefined && !description.trim()) throw new Error('TabPanel requer uma descrição não vazia quando fornecida.');
  if (!active && !keepMounted) return null;
  const hasHeader = Boolean(title || description || actions);
  const hasContent = children !== null && children !== undefined && children !== false;
  const wide = width >= tokens.wideBreakpoint;

  return <View {...nativeProps} nativeID={id} role="tabpanel" accessible={false} accessibilityLabelledBy={labelledBy}
    accessibilityElementsHidden={!active} importantForAccessibility={active ? 'auto' : 'no-hide-descendants'}
    pointerEvents={active ? 'auto' : 'none'} style={[styles.outer, !active && styles.hidden, style]}
    onLayout={event => { setWidth(event.nativeEvent.layout.width); onLayout?.(event); }}>
    <ContentPanel surface={surface} style={{ padding: tokens.padding[surface], gap: tokens.gap }}>
      <View style={[styles.slot, { gap: tokens.gap }]}>
        {hasHeader ? <View style={[wide ? styles.wideHeader : styles.header, { gap: tokens.headerGap }]}>
          {title || description ? <View style={[styles.heading, wide && styles.wideHeading, { gap: tokens.headingGap }]}>
            {title ? <Text accessibilityRole="header" allowFontScaling style={{ color: tokens.titleColor,
              fontFamily: tokens.titleFamily, fontSize: tokens.titleSize }}>{title}</Text> : null}
            {description ? <Text allowFontScaling style={{ color: tokens.descriptionColor,
              fontFamily: tokens.descriptionFamily, fontSize: tokens.descriptionSize }}>{description}</Text> : null}
          </View> : null}
          {actions ? <View style={[styles.actions, { gap: tokens.actionsGap }]}>{actions}</View> : null}
        </View> : null}
        {hasHeader && hasContent ? <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
          style={{ height: 1, backgroundColor: tokens.border }} /> : null}
        {hasContent ? <View style={styles.slot}>{children}</View> : null}
      </View>
    </ContentPanel>
  </View>;
}

const styles = StyleSheet.create({
  outer: { alignSelf: 'stretch', maxWidth: '100%' }, hidden: { display: 'none' },
  slot: { alignSelf: 'stretch', minWidth: 0 }, header: { alignSelf: 'stretch' },
  wideHeader: { alignSelf: 'stretch', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' },
  heading: { flexGrow: 1, flexShrink: 1, minWidth: 0 }, wideHeading: { flexBasis: 200, flexShrink: 0, maxWidth: '100%' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' },
});
