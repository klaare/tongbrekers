export interface Condoleance {
  id: string;
  text: string;
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
