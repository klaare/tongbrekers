import type { Haiku } from '../types';

const STORAGE_KEY = 'hopeloze-haikus';
const API_KEY_STORAGE = 'hopeloze-haikus-api-key';
const MAX_ITEMS = 50;

export function getHaikus(): Haiku[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading haikus from localStorage:', error);
    return [];
  }
}

export function saveHaiku(haiku: Haiku): void {
  try {
    const haikus = getHaikus();
    haikus.unshift(haiku);

    if (haikus.length > MAX_ITEMS) {
      haikus.splice(MAX_ITEMS);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(haikus));
  } catch (error) {
    console.error('Error saving haiku to localStorage:', error);
  }
}

export function deleteHaiku(id: string): void {
  try {
    const haikus = getHaikus();
    const filtered = haikus.filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting haiku from localStorage:', error);
  }
}

export function getApiKey(): string | null {
  try {
    return localStorage.getItem(API_KEY_STORAGE);
  } catch (error) {
    console.error('Error reading API key from localStorage:', error);
    return null;
  }
}

export function saveApiKey(key: string): void {
  try {
    localStorage.setItem(API_KEY_STORAGE, key);
  } catch (error) {
    console.error('Error saving API key to localStorage:', error);
  }
}

export function hasApiKey(): boolean {
  const key = getApiKey();
  return key !== null && key.length > 0;
}
