import type { Condoleance } from '../types';
import { generateId } from './storage';

/**
 * Encode a condoleance into a URL-safe base64 string
 */
export function encodeCondoleance(text: string): string {
  try {
    // Use encodeURIComponent for URL safety
    return encodeURIComponent(btoa(encodeURIComponent(text)));
  } catch (error) {
    console.error('Error encoding condoleance:', error);
    return '';
  }
}

/**
 * Decode a condoleance from a URL-safe base64 string
 */
export function decodeCondoleance(encoded: string): string | null {
  try {
    const decoded = decodeURIComponent(atob(decodeURIComponent(encoded)));
    return decoded;
  } catch (error) {
    console.error('Error decoding condoleance:', error);
    return null;
  }
}

/**
 * Create a shareable URL with a condoleance
 */
export function createShareUrl(condoleance: Condoleance): string {
  const baseUrl = window.location.origin + window.location.pathname;
  const encoded = encodeCondoleance(condoleance.text);
  return `${baseUrl}?c=${encoded}`;
}

/**
 * Get condoleance from URL query parameter
 */
export function getCondoleanceFromUrl(): Condoleance | null {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('c');

  if (!encoded) {
    return null;
  }

  const text = decodeCondoleance(encoded);
  if (!text) {
    return null;
  }

  return {
    id: generateId(),
    text,
    created_at: new Date().toISOString(),
  };
}

/**
 * Clear the URL query parameter
 */
export function clearUrlParams(): void {
  const url = new URL(window.location.href);
  url.search = '';
  window.history.replaceState({}, '', url.toString());
}
