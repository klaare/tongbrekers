import type { Condoleance } from '../types';

const STORAGE_KEYS = {
  CONDOLEANCES: 'curieuze_condoleances_history',
  API_KEY: 'gemini_api_key',
  MAX_ITEMS: 50,
} as const;

export const storage = {
  // Condoleances
  getCondoleances: (): Condoleance[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONDOLEANCES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading condoleances:', error);
      return [];
    }
  },

  saveCondoleance: (condoleance: Condoleance): boolean => {
    try {
      const history = storage.getCondoleances();
      history.unshift(condoleance);
      const trimmed = history.slice(0, STORAGE_KEYS.MAX_ITEMS);
      localStorage.setItem(STORAGE_KEYS.CONDOLEANCES, JSON.stringify(trimmed));
      return true;
    } catch (error) {
      console.error('Error saving condoleance:', error);
      return false;
    }
  },

  deleteCondoleance: (id: string): boolean => {
    try {
      const history = storage.getCondoleances();
      const filtered = history.filter((t) => t.id !== id);
      localStorage.setItem(STORAGE_KEYS.CONDOLEANCES, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting condoleance:', error);
      return false;
    }
  },

  // API Key
  getApiKey: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.API_KEY);
    } catch (error) {
      console.error('Error getting API key:', error);
      return null;
    }
  },

  saveApiKey: (apiKey: string): boolean => {
    try {
      localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
      return true;
    } catch (error) {
      console.error('Error saving API key:', error);
      return false;
    }
  },

  hasApiKey: (): boolean => {
    const key = storage.getApiKey();
    return key !== null && key.trim().length > 0;
  },
};

export const generateId = (): string => {
  return crypto.randomUUID();
};
