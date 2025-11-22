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
    <div className="bg-background-surface border-2 border-yellow-500 rounded-xl p-6 mb-8 animate-slide-in">
      <p className="text-yellow-500 font-semibold mb-4">⚠️ Gemini API key nodig</p>
      <input
        type="text"
        value={apiKey}
        onChange={(e) => {
          setApiKey(e.target.value);
          setError('');
        }}
        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        placeholder="Plak je Gemini API key hier..."
        className="w-full px-4 py-3 bg-background rounded-lg border border-gray-700 text-white focus:border-primary focus:outline-none mb-3"
      />
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <button
        onClick={handleSave}
        className="w-full px-4 py-3 bg-yellow-500 text-background font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
      >
        Opslaan
      </button>
      <p className="text-gray-400 text-sm mt-4">
        Gratis API key krijgen:{' '}
        <a
          href="https://makersuite.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          makersuite.google.com
        </a>
      </p>
    </div>
  );
};
