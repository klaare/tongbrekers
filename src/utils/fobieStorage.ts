import type { Fobie } from '../types';

const STORAGE_KEYS = {
  FOBIEEN: 'frappante_fobieen_history',
  API_KEY: 'fobieen_gemini_api_key',
  MAX_ITEMS: 50,
} as const;

export const fobieStorage = {
  getFobieen: (): Fobie[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FOBIEEN);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading fobieën:', error);
      return [];
    }
  },

  saveFobie: (fobie: Fobie): boolean => {
    try {
      const history = fobieStorage.getFobieen();
      history.unshift(fobie);
      const trimmed = history.slice(0, STORAGE_KEYS.MAX_ITEMS);
      localStorage.setItem(STORAGE_KEYS.FOBIEEN, JSON.stringify(trimmed));
      return true;
    } catch (error) {
      console.error('Error saving fobie:', error);
      return false;
    }
  },

  deleteFobie: (id: string): boolean => {
    try {
      const history = fobieStorage.getFobieen();
      const filtered = history.filter((f) => f.id !== id);
      localStorage.setItem(STORAGE_KEYS.FOBIEEN, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting fobie:', error);
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
    const key = fobieStorage.getApiKey();
    return key !== null && key.trim().length > 0;
  },
};
