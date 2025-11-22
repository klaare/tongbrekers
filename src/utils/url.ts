import type { Tongbreker } from '../types';
import { generateId } from './storage';

/**
 * Encode a tongbreker into a URL-safe base64 string
 */
export function encodeTongbreker(text: string): string {
  try {
    // Use encodeURIComponent for URL safety
    return encodeURIComponent(btoa(encodeURIComponent(text)));
  } catch (error) {
    console.error('Error encoding tongbreker:', error);
    return '';
  }
}

/**
 * Decode a tongbreker from a URL-safe base64 string
 */
export function decodeTongbreker(encoded: string): string | null {
  try {
    const decoded = decodeURIComponent(atob(decodeURIComponent(encoded)));
    return decoded;
  } catch (error) {
    console.error('Error decoding tongbreker:', error);
    return null;
  }
}

/**
 * Create a shareable URL with a tongbreker
 */
export function createShareUrl(tongbreker: Tongbreker): string {
  const baseUrl = window.location.origin + window.location.pathname;
  const encoded = encodeTongbreker(tongbreker.text);
  return `${baseUrl}?t=${encoded}`;
}

/**
 * Get tongbreker from URL query parameter
 */
export function getTongbrekerFromUrl(): Tongbreker | null {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('t');

  if (!encoded) {
    return null;
  }

  const text = decodeTongbreker(encoded);
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
