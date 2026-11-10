import { ENABLE_DEBUG_LAYER } from './debugConfig';

export const testAccounts = [
  { name: 'João Almeida', email: 'tecnico@alarmeon.pt' },
  { name: 'Mariana Ferreira', email: 'tecnico2@alarmeon.pt' },
] as const;

type Options = { inspect: boolean; tokens: boolean; email: string; selection: number; logout: number };
let options: Options = { inspect: false, tokens: false, email: '', selection: 0, logout: 0 };
const listeners = new Set<() => void>();
const enabled = () => __DEV__ && ENABLE_DEBUG_LAYER;
export const debugOptions = {
  getSnapshot: () => options,
  subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
  update(update: Partial<Options>) {
    if (!enabled()) return;
    options = { ...options, ...update };
    for (const listener of listeners) listener();
  },
  selectAccount(email: string) {
    if (!enabled() || !testAccounts.some(account => account.email === email)) return;
    this.update({ email, selection: options.selection + 1 });
  },
  endSession() { this.update({ logout: options.logout + 1 }); },
  enabled,
};
