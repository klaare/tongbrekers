import type { Haiku } from '../types';

export function createHaikuShareUrl(haiku: Haiku): string {
  const data = {
    text: haiku.text,
    extraHopeloosheid: haiku.extraHopeloosheid
  };

  const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
  const url = new URL(window.location.href);
  url.searchParams.set('h', encoded);

  return url.toString();
}

export function getHaikuFromUrl(): Haiku | null {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('h');

  if (!encoded) {
    return null;
  }

  try {
    const decoded = JSON.parse(decodeURIComponent(atob(encoded)));

    return {
      id: crypto.randomUUID(),
      text: decoded.text,
      extraHopeloosheid: decoded.extraHopeloosheid || false,
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error decoding haiku from URL:', error);
    return null;
  }
}
