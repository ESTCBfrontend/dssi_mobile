export const workOrderQueryKeys = {
  scope: (scope: readonly string[]) => ['work-orders', ...scope] as const,
  list: (scope: readonly string[]) => [...workOrderQueryKeys.scope(scope), 'list'] as const,
  detail: (scope: readonly string[], id: string) => [...workOrderQueryKeys.scope(scope), 'detail', id] as const,
};
