import type { RootState } from '../store';

const STORAGE_KEY = 'inventory_app_state_v1';

export function loadState(): Partial<RootState> | undefined {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return undefined;
    return JSON.parse(serialized);
  } catch (err) {
    console.warn('Failed to load state', err);
    return undefined;
  }
}

export function saveState(state: RootState): void {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    console.warn('Failed to save state', err);
  }
}
