import type { Draaiboek } from '../types';
import { generateId } from './storage';

export function encodeDraaiboek(taak: string, draaiboek: string, moeilijkheidsgraad: 'lichte-mislukking' | 'gure-ramp' | 'volledige-catastrofe'): string {
  try {
    const data = JSON.stringify({ taak, draaiboek, moeilijkheidsgraad });
    return encodeURIComponent(btoa(encodeURIComponent(data)));
  } catch (error) {
    console.error('Error encoding draaiboek:', error);
    return '';
  }
}

export function decodeDraaiboek(encoded: string): { taak: string; draaiboek: string; moeilijkheidsgraad: 'lichte-mislukking' | 'gure-ramp' | 'volledige-catastrofe' } | null {
  try {
    const decoded = decodeURIComponent(atob(decodeURIComponent(encoded)));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding draaiboek:', error);
    return null;
  }
}

export function createDraaiboekShareUrl(draaiboek: Draaiboek): string {
  const baseUrl = window.location.origin + window.location.pathname;
  const encoded = encodeDraaiboek(draaiboek.taak, draaiboek.draaiboek, draaiboek.moeilijkheidsgraad);
  return `${baseUrl}?d=${encoded}`;
}

export function getDraaiboekFromUrl(): Draaiboek | null {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('d');

  if (!encoded) {
    return null;
  }

  const data = decodeDraaiboek(encoded);
  if (!data) {
    return null;
  }

  return {
    id: generateId(),
    taak: data.taak,
    draaiboek: data.draaiboek,
    moeilijkheidsgraad: data.moeilijkheidsgraad,
    created_at: new Date().toISOString(),
  };
}
