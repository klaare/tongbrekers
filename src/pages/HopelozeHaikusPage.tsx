import { useState, useEffect } from 'react';
import type { Haiku } from '../types';
import { generateHaiku } from '../services/haiku';
import { getHaikus, saveHaiku, deleteHaiku, getApiKey, saveApiKey, hasApiKey } from '../utils/haikuStorage';
import { getHaikuFromUrl } from '../utils/haikuUrl';
import { HaikuList } from '../components/haikus/HaikuList';

export const HopelozeHaikusPage = () => {
  const [haikus, setHaikus] = useState<Haiku[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);
  const [extraHopeloosheid, setExtraHopeloosheid] = useState(false);

  useEffect(() => {
    const stored = getHaikus();
    setHaikus(stored);

    const storedKey = getApiKey();
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      setShowApiInput(true);
    }

    const sharedHaiku = getHaikuFromUrl();
    if (sharedHaiku) {
      saveHaiku(sharedHaiku);
      setHaikus(prev => [sharedHaiku, ...prev]);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleGenerate = async () => {
    if (!apiKey) {
      setError('Voer eerst een API key in');
      setShowApiInput(true);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const text = await generateHaiku(apiKey, extraHopeloosheid);

      const newHaiku: Haiku = {
        id: crypto.randomUUID(),
        text,
        extraHopeloosheid,
        created_at: new Date().toISOString()
      };

      saveHaiku(newHaiku);
      setHaikus(prev => [newHaiku, ...prev]);
    } catch (err) {
      console.error('Error generating haiku:', err);
      setError('Er ging iets mis bij het genereren van de haiku');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      saveApiKey(apiKey.trim());
      setShowApiInput(false);
      setError('');
    }
  };

  const handleDelete = (id: string) => {
    deleteHaiku(id);
    setHaikus(prev => prev.filter(h => h.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif text-gray-800 mb-4 tracking-tight">
            🍂 Hopeloze Haiku's
          </h1>
          <p className="text-gray-500 font-serif italic text-lg">
            Melancholische meditaties voor de moderne mens
          </p>
        </div>

        {/* API Key Input */}
        {showApiInput && (
          <div className="mb-12 p-8 bg-white border border-gray-200 rounded-sm shadow-sm">
            <h3 className="text-lg font-serif text-gray-700 mb-4">Google Gemini API Key</h3>
            <div className="flex gap-3">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveApiKey()}
                placeholder="Voer je API key in..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-400 transition-colors font-mono text-sm"
              />
              <button
                onClick={handleSaveApiKey}
                className="px-6 py-3 bg-gray-700 text-white rounded-sm hover:bg-gray-800 transition-colors font-serif"
              >
                Opslaan
              </button>
            </div>
            {hasApiKey() && (
              <button
                onClick={() => setShowApiInput(false)}
                className="mt-3 text-sm text-gray-500 hover:text-gray-700 underline font-serif"
              >
                Annuleren
              </button>
            )}
          </div>
        )}

        {!showApiInput && (
          <button
            onClick={() => setShowApiInput(true)}
            className="mb-8 text-sm text-gray-500 hover:text-gray-700 underline font-serif"
          >
            API Key wijzigen
          </button>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-sm">
            <p className="text-red-700 font-serif">{error}</p>
          </div>
        )}

        {/* Generate Section */}
        <div className="mb-16 p-12 bg-white border border-gray-200 rounded-sm shadow-sm">
          <div className="flex flex-col items-center gap-6">
            {/* Extra Hopeloosheid Toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={extraHopeloosheid}
                onChange={(e) => setExtraHopeloosheid(e.target.checked)}
                className="w-5 h-5 accent-gray-600"
              />
              <span className="text-gray-600 font-serif italic">Extra hopeloosheid</span>
            </label>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`
                px-12 py-4 text-lg font-serif
                bg-gray-700 text-white rounded-sm
                hover:bg-gray-800 transition-all duration-200
                hover:shadow-lg
                disabled:opacity-50 disabled:cursor-not-allowed
                ${loading ? 'animate-pulse' : ''}
              `}
            >
              {loading ? 'Existentiële leegte wordt berekend...' : 'Genereer Haiku'}
            </button>
          </div>
        </div>

        {/* Haiku List */}
        {haikus.length > 0 && (
          <div>
            <h2 className="text-2xl font-serif text-gray-700 mb-8 text-center">Recente Haiku's</h2>
            <HaikuList haikus={haikus} onDelete={handleDelete} />
          </div>
        )}
      </div>
    </div>
  );
};
