// request-store.ts
import { AsyncLocalStorage } from 'async_hooks';

export const AsyncStore = new AsyncLocalStorage<Map<string, any>>();

