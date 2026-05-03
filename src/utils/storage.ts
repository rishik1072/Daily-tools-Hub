const isLocalStorageAvailable = (): boolean => {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
};

export const safeGetItem = <T = any>(key: string, fallback: T | null = null): T | null => {
  if (!isLocalStorageAvailable()) return fallback;

  try {
    const value = window.localStorage.getItem(key);
    if (!value) return fallback;
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn(`Unable to read localStorage key '${key}':`, error);
    return fallback;
  }
};

export const safeSetItem = (key: string, value: unknown): void => {
  if (!isLocalStorageAvailable()) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Unable to write localStorage key '${key}':`, error);
  }
};

export const safeRemoveItem = (key: string): void => {
  if (!isLocalStorageAvailable()) return;

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Unable to remove localStorage key '${key}':`, error);
  }
};
