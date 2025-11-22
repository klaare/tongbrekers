import { useState, useEffect } from 'react';
import type { Excuus } from '../types';
import { generateId } from '../utils/storage';
import { excuusService } from '../services/excuus';
import { excuusStorage } from '../utils/excuusStorage';
import { getExcuusFromUrl } from '../utils/excuusUrl';
import { Notification } from '../components/Notification';
import { ExcuusList } from '../components/excuses/ExcuusList';

export const ExcuusExMachinaPage = () => {
  const [excuses, setExcuses] = useState<Excuus[]>([]);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [situatie, setSituatie] = useState('');
  const [lengte, setLengte] = useState<'kort' | 'normaal' | 'episch'>('normaal');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const activeApiKey = apiKey || envApiKey;

  const voorbeelden = [
    'Te laat komen',
    'Vergeten terug te appen',
    'Vergeten verjaardag',
    'Misstap op werk',
    'Gemiste afspraak'
  ];

  // Load excuses from localStorage on mount
  useEffect(() => {
    const loadedExcuses = excuusStorage.getExcuses();
    setExcuses(loadedExcuses);

    const loadedApiKey = excuusStorage.getApiKey();
    setApiKey(loadedApiKey);

    // Check for shared excuus in URL
    const sharedExcuus = getExcuusFromUrl();
    if (sharedExcuus) {
      const exists = loadedExcuses.some(
        (e) => e.situatie === sharedExcuus.situatie && e.excuus === sharedExcuus.excuus
      );
      if (!exists) {
        excuusStorage.saveExcuus(sharedExcuus);
        setExcuses((prev) => [sharedExcuus, ...prev]);
      }
      // Clear URL params
      window.history.replaceState({}, '', window.location.pathname);
      showNotification('Gedeeld excuus geladen! 🙏', 'success');
    }
  }, []);

  useEffect(() => {
    setShowApiKeyInput(!activeApiKey);
  }, [activeApiKey]);

  const handleSaveApiKey = (key: string) => {
    excuusStorage.saveApiKey(key);
    setApiKey(key);
    setShowApiKeyInput(false);
    showNotification('API key opgeslagen! 🔑', 'success');
  };

  const handleRandomize = () => {
    const random = excuusService.getRandomSituatie();
    setSituatie(random);
  };

  const handleGenerate = async () => {
    if (!activeApiKey) {
      setShowApiKeyInput(true);
      showNotification('API key vereist! Voer je Gemini key in.', 'error');
      return;
    }

    if (!situatie.trim()) {
      showNotification('Vul eerst een situatie in!', 'error');
      return;
    }

    setIsGenerating(true);

    try {
      const excuusText = await excuusService.generateExcuus(activeApiKey, situatie, lengte);

      const excuus: Excuus = {
        id: generateId(),
        situatie: situatie.trim(),
        excuus: excuusText,
        lengte,
        created_at: new Date().toISOString(),
      };

      excuusStorage.saveExcuus(excuus);
      setExcuses((prev) => [excuus, ...prev]);
      setSituatie('');
      showNotification('Nieuw excuus gegenereerd! 🙏', 'success');
    } catch (error: any) {
      console.error('Generation error:', error);

      if (error.message?.includes('Te veel requests') || error.message?.includes('429')) {
        setShowApiKeyInput(true);
        showNotification('Rate limited! Voer een andere API key in.', 'error');
      } else {
        showNotification(error.message || 'Er ging iets mis... 😬', 'error');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = (id: string) => {
    excuusStorage.deleteExcuus(id);
    setExcuses((prev) => prev.filter((e) => e.id !== id));
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-950 to-yellow-950">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-300 mb-4 drop-shadow-2xl">
            🙏 EXCUUS EX MACHINA 🙏
          </h1>
          <p className="text-xl text-amber-200 font-semibold max-w-2xl mx-auto">
            Genereer creatieve, gedetailleerde excuses voor elke situatie
          </p>
          <p className="text-amber-400 mt-3 italic text-lg">
            AI-gedreven oplossingen voor ongemakkelijke momenten
          </p>
        </header>

        <main>
          {/* Input Form */}
          <div className="mb-12 bg-amber-900/30 backdrop-blur-sm border-2 border-amber-700 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-amber-100 mb-6">
              Waar heb je een excuus voor nodig?
            </h2>

            <div className="space-y-6">
              <div>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={situatie}
                    onChange={(e) => setSituatie(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    placeholder="Bijv: Te laat op werk..."
                    className="flex-1 px-4 py-3 bg-amber-900/50 border-2 border-amber-700 rounded-lg text-white placeholder-amber-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50"
                  />
                  <button
                    onClick={handleRandomize}
                    className="px-6 py-3 bg-amber-800/50 hover:bg-amber-700/70 text-amber-100 font-bold rounded-lg transition-colors border-2 border-amber-700 hover:border-amber-500"
                    title="Verzin maar iets"
                  >
                    🎲
                  </button>
                </div>

                {/* Voorbeelden */}
                <div className="flex flex-wrap gap-2">
                  {voorbeelden.map((vb) => (
                    <button
                      key={vb}
                      onClick={() => setSituatie(vb)}
                      className="text-xs px-3 py-1 bg-amber-800/30 text-amber-300 rounded-full hover:bg-amber-700/50 transition-colors border border-amber-700"
                    >
                      {vb}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lengte selector */}
              <div>
                <label className="block text-amber-200 font-semibold mb-3">
                  Lengte van het excuus:
                </label>
                <div className="flex gap-3">
                  {(['kort', 'normaal', 'episch'] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLengte(l)}
                      className={`
                        flex-1 px-4 py-3 rounded-lg font-bold transition-all border-2
                        ${lengte === l
                          ? 'bg-amber-600 text-white border-amber-500 shadow-lg'
                          : 'bg-amber-900/30 text-amber-300 border-amber-700 hover:border-amber-600'
                        }
                      `}
                    >
                      {l === 'kort' && '📏 Kort'}
                      {l === 'normaal' && '📋 Normaal'}
                      {l === 'episch' && '📜 Episch'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !situatie.trim()}
                className="w-full px-8 py-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-black text-xl rounded-xl hover:from-amber-500 hover:to-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all shadow-2xl shadow-amber-500/50 border-4 border-amber-400"
              >
                {isGenerating ? (
                  <>
                    <span className="inline-block animate-spin mr-2">🙏</span>
                    Plausibele onwaarschijnlijkheden worden berekend...
                  </>
                ) : (
                  <>
                    🎯 GENEREER EXCUUS
                  </>
                )}
              </button>
            </div>
          </div>

          {/* API Key Input */}
          {showApiKeyInput && (
            <div className="mb-12 bg-amber-950/60 backdrop-blur-sm border-2 border-amber-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                🔑 <span>API Key vereist</span>
              </h3>
              <p className="text-amber-200 mb-4 text-sm">
                Voer je Google Gemini API key in om excuses te kunnen genereren.
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="AIza..."
                  className="flex-1 px-4 py-3 bg-amber-900/50 border-2 border-amber-700 rounded-lg text-white placeholder-amber-400 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.currentTarget;
                      if (input.value.trim()) {
                        handleSaveApiKey(input.value.trim());
                      }
                    }
                  }}
                />
                <button
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    if (input.value.trim()) {
                      handleSaveApiKey(input.value.trim());
                    }
                  }}
                  className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg transition-colors"
                >
                  Opslaan
                </button>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="relative my-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-amber-800"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gradient-to-br from-gray-900 via-amber-950 to-yellow-950 px-6 text-amber-300 font-bold uppercase tracking-wider text-sm">
                Recente Excuses
              </span>
            </div>
          </div>

          {/* Excuses List */}
          <section>
            <ExcuusList excuses={excuses} onDelete={handleDelete} />
          </section>
        </main>

        <footer className="text-center mt-16 pt-8 border-t-2 border-amber-900">
          <p className="text-amber-500 text-sm">
            © {new Date().getFullYear()} • Excuus Ex Machina • Aangedreven door AI • Gebruik op eigen risico
          </p>
        </footer>
      </div>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
    </div>
  );
};
