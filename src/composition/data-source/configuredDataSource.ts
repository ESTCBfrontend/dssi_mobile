import { DataSourceSelection } from './dataSource';

export function createConfiguredDataSource(options: {
  configuredSource?: string;
  debugLayerEnabled: boolean;
  development: boolean;
}): DataSourceSelection {
  return new DataSourceSelection({
    configuredSource: options.configuredSource,
    allowRuntimeSelection: options.development && options.debugLayerEnabled,
  });
}
