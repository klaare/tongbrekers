import type { Excuus } from '../types';

const STORAGE_KEYS = {
  EXCUSES: 'excuus-ex-machina-items',
  API_KEY: 'excuus_gemini_api_key',
  MAX_ITEMS: 50,
} as const;

export const excuusStorage = {
  getExcuses: (): Excuus[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXCUSES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading excuses:', error);
      return [];
    }
  },

  saveExcuus: (excuus: Excuus): boolean => {
    try {
      const history = excuusStorage.getExcuses();
      history.unshift(excuus);
      const trimmed = history.slice(0, STORAGE_KEYS.MAX_ITEMS);
      localStorage.setItem(STORAGE_KEYS.EXCUSES, JSON.stringify(trimmed));
      return true;
    } catch (error) {
      console.error('Error saving excuus:', error);
      return false;
    }
  },

  deleteExcuus: (id: string): boolean => {
    try {
      const history = excuusStorage.getExcuses();
      const filtered = history.filter((e) => e.id !== id);
      localStorage.setItem(STORAGE_KEYS.EXCUSES, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting excuus:', error);
      return false;
    }
  },

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
    const key = excuusStorage.getApiKey();
    return key !== null && key.trim().length > 0;
  },
};
