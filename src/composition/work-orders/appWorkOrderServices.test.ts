import { afterEach, expect, jest, test } from '@jest/globals';
import type { WorkOrderServices } from './workOrderServices';

afterEach(() => {
  jest.dontMock('../debug/debugConfig');
  jest.dontMock('../data-source/appDataSource');
});

test.each(['mock', 'api'] as const)('respeita a origem inicial %s com o Debug Menu oculto', async source => {
  jest.doMock('../debug/debugConfig', () => ({ ENABLE_DEBUG_LAYER: false }));
  jest.doMock('../data-source/appDataSource', () => ({ appDataSource: { source } }));
  let services!: WorkOrderServices;
  jest.isolateModules(() => { services = require('./appWorkOrderServices').appWorkOrderServices; });
  if (source === 'mock') {
    expect(services.mock).not.toBeNull();
    expect((await services.mock!.list()).length).toBeGreaterThan(0);
  } else {
    expect(services.mock).toBeNull();
    await expect(services.api.list()).rejects.toThrow('Serviço de ordens indisponível.');
  }
});
