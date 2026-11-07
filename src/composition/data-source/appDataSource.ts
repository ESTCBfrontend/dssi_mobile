import { ENABLE_DEBUG_LAYER } from '../debug/debugConfig';
import { createConfiguredDataSource } from './configuredDataSource';

/** Origem inicial da aplicação, independente da disponibilidade do menu. */
const DATA_SOURCE: 'api' | 'mock' = 'api';

export const appDataSource = createConfiguredDataSource({
  configuredSource: DATA_SOURCE,
  debugLayerEnabled: ENABLE_DEBUG_LAYER,
  development: __DEV__,
});
