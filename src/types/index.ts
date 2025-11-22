export interface Condoleance {
  id: string;
  text: string;
  created_at: string;
}

export interface Tongbreker {
  id: string;
  text: string;
  created_at: string;
}

export interface Fobie {
  id: string;
  naam: string;
  beschrijving: string;
  created_at: string;
}

export interface Excuus {
  id: string;
  situatie: string;
  excuus: string;
  lengte: 'kort' | 'normaal' | 'episch';
  created_at: string;
}

export interface ApiKeyConfig {
  key: string | null;
  isValid: boolean;
}

export interface TTSOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
}
