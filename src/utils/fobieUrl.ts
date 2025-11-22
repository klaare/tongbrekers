import type { Fobie } from '../types';
import { generateId } from './storage';

export function encodeFobie(naam: string, beschrijving: string): string {
  try {
    const data = JSON.stringify({ naam, beschrijving });
    return encodeURIComponent(btoa(encodeURIComponent(data)));
  } catch (error) {
    console.error('Error encoding fobie:', error);
    return '';
  }
}

export function decodeFobie(encoded: string): { naam: string; beschrijving: string } | null {
  try {
    const decoded = decodeURIComponent(atob(decodeURIComponent(encoded)));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding fobie:', error);
    return null;
  }
}

export function createFobieShareUrl(fobie: Fobie): string {
  const baseUrl = window.location.origin + window.location.pathname;
  const encoded = encodeFobie(fobie.naam, fobie.beschrijving);
  return `${baseUrl}?f=${encoded}`;
}

export function getFobieFromUrl(): Fobie | null {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('f');

  if (!encoded) {
    return null;
  }

  const data = decodeFobie(encoded);
  if (!data) {
    return null;
  }

  return {
    id: generateId(),
    naam: data.naam,
    beschrijving: data.beschrijving,
    created_at: new Date().toISOString(),
  };
}
