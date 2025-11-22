import type { Excuus } from '../types';
import { generateId } from './storage';

export function encodeExcuus(situatie: string, excuus: string, lengte: 'kort' | 'normaal' | 'episch'): string {
  try {
    const data = JSON.stringify({ situatie, excuus, lengte });
    return encodeURIComponent(btoa(encodeURIComponent(data)));
  } catch (error) {
    console.error('Error encoding excuus:', error);
    return '';
  }
}

export function decodeExcuus(encoded: string): { situatie: string; excuus: string; lengte: 'kort' | 'normaal' | 'episch' } | null {
  try {
    const decoded = decodeURIComponent(atob(decodeURIComponent(encoded)));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding excuus:', error);
    return null;
  }
}

export function createExcuusShareUrl(excuus: Excuus): string {
  const baseUrl = window.location.origin + window.location.pathname;
  const encoded = encodeExcuus(excuus.situatie, excuus.excuus, excuus.lengte);
  return `${baseUrl}?e=${encoded}`;
}

export function getExcuusFromUrl(): Excuus | null {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('e');

  if (!encoded) {
    return null;
  }

  const data = decodeExcuus(encoded);
  if (!data) {
    return null;
  }

  return {
    id: generateId(),
    situatie: data.situatie,
    excuus: data.excuus,
    lengte: data.lengte,
    created_at: new Date().toISOString(),
  };
}
