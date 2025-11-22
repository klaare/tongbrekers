import { useState } from 'react';
import { condoleanceService } from '../services/condoleance.ts';

interface ApiKeyInputProps {
  onSave: (apiKey: string) => void;
}

export const ApiKeyInput = ({ onSave }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    const trimmed = apiKey.trim();

    if (!trimmed) {
      setError('Voer een API key in');
      return;
    }

    if (!condoleanceService.validateApiKey(trimmed)) {
      setError('Ongeldige API key formaat. Gemini keys beginnen met "AIza"');
      return;
    }

    onSave(trimmed);
    setApiKey('');
    setError('');
  };

  return (
    <div className="bg-paper-aged border-4 border-accent-border rounded-lg p-6 mb-8 animate-slide-in shadow-lg">
      <p className="text-accent font-bold mb-4 text-lg uppercase tracking-wide">⚠️ Gemini API key nodig</p>
      <input
        type="text"
        value={apiKey}
        onChange={(e) => {
          setApiKey(e.target.value);
          setError('');
        }}
        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        placeholder="Plak je Gemini API key hier..."
        className="w-full px-4 py-3 bg-paper rounded-lg border-2 border-ink text-ink focus:border-accent-border focus:outline-none mb-3 font-mono"
      />
      {error && <p className="text-red-800 text-sm mb-3 font-semibold">{error}</p>}
      <button
        onClick={handleSave}
        className="w-full px-4 py-3 bg-accent border-2 border-ink text-paper font-bold rounded-lg hover:bg-accent-vintage transition-colors uppercase tracking-wide"
      >
        Opslaan
      </button>
      <p className="text-ink-faded text-sm mt-4">
        Gratis API key krijgen:{' '}
        <a
          href="https://makersuite.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-border hover:underline font-semibold"
        >
          makersuite.google.com
        </a>
      </p>
    </div>
  );
};
