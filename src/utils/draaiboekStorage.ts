import type { Draaiboek } from '../types';

const STORAGE_KEYS = {
  DRAAIBOEKEN: 'destructieve-draaiboeken-items',
  API_KEY: 'draaiboek_gemini_api_key',
  MAX_ITEMS: 50,
} as const;

export const draaiboekStorage = {
  getDraaiboeken: (): Draaiboek[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DRAAIBOEKEN);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading draaiboeken:', error);
      return [];
    }
  },

  saveDraaiboek: (draaiboek: Draaiboek): boolean => {
    try {
      const history = draaiboekStorage.getDraaiboeken();
      history.unshift(draaiboek);
      const trimmed = history.slice(0, STORAGE_KEYS.MAX_ITEMS);
      localStorage.setItem(STORAGE_KEYS.DRAAIBOEKEN, JSON.stringify(trimmed));
      return true;
    } catch (error) {
      console.error('Error saving draaiboek:', error);
      return false;
    }
  },

  deleteDraaiboek: (id: string): boolean => {
    try {
      const history = draaiboekStorage.getDraaiboeken();
      const filtered = history.filter((d) => d.id !== id);
      localStorage.setItem(STORAGE_KEYS.DRAAIBOEKEN, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting draaiboek:', error);
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
    const key = draaiboekStorage.getApiKey();
    return key !== null && key.trim().length > 0;
  },
};
