import { useState, useEffect } from 'react';
import type { Fobie } from '../types';
import { generateId } from '../utils/storage';
import { fobieService } from '../services/fobie';
import { fobieStorage } from '../utils/fobieStorage';
import { getFobieFromUrl } from '../utils/fobieUrl';
import { Notification } from '../components/Notification';
import { FobieList } from '../components/fobieen/FobieList';

export const FobieenPage = () => {
  const [fobieen, setFobieen] = useState<Fobie[]>([]);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const activeApiKey = apiKey || envApiKey;

  // Load fobieen from localStorage on mount
  useEffect(() => {
    const loadedFobieen = fobieStorage.getFobieen();
    setFobieen(loadedFobieen);

    const loadedApiKey = fobieStorage.getApiKey();
    setApiKey(loadedApiKey);

    // Check for shared fobie in URL
    const sharedFobie = getFobieFromUrl();
    if (sharedFobie) {
      const exists = loadedFobieen.some(
        (f) => f.naam === sharedFobie.naam && f.beschrijving === sharedFobie.beschrijving
      );
      if (!exists) {
        fobieStorage.saveFobie(sharedFobie);
        setFobieen((prev) => [sharedFobie, ...prev]);
      }
      // Clear URL params
      window.history.replaceState({}, '', window.location.pathname);
      showNotification('Gedeelde fobie geladen! 😰', 'success');
    }
  }, []);

  useEffect(() => {
    setShowApiKeyInput(!activeApiKey);
  }, [activeApiKey]);

  const handleSaveApiKey = (key: string) => {
    fobieStorage.saveApiKey(key);
    setApiKey(key);
    setShowApiKeyInput(false);
    showNotification('API key opgeslagen! 🔑', 'success');
  };

  const handleGenerate = async () => {
    if (!activeApiKey) {
      setShowApiKeyInput(true);
      showNotification('API key vereist! Voer je Gemini key in.', 'error');
      return;
    }

    setIsGenerating(true);

    try {
      const result = await fobieService.generateFobie(activeApiKey);

      const fobie: Fobie = {
        id: generateId(),
        naam: result.naam,
        beschrijving: result.beschrijving,
        created_at: new Date().toISOString(),
      };

      fobieStorage.saveFobie(fobie);
      setFobieen((prev) => [fobie, ...prev]);
      showNotification('Nieuwe fobie gegenereerd! 😰', 'success');
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
    fobieStorage.deleteFobie(id);
    setFobieen((prev) => prev.filter((f) => f.id !== id));
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-950 to-cyan-950">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-green-300 mb-4 drop-shadow-2xl">
            😰 FRAPPANTE FOBIEËN 😰
          </h1>
          <p className="text-xl text-teal-200 font-semibold max-w-2xl mx-auto">
            Absurde, fictieve angsten die niet echt bestaan
          </p>
          <p className="text-teal-400 mt-3 italic text-lg">
            Genereer hilarische fobieën met AI — gratis therapie niet inbegrepen
          </p>
        </header>

        <main>
          {/* Generate Button */}
          <div className="mb-12 flex justify-center">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="group relative px-12 py-5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-black text-xl rounded-2xl hover:from-teal-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all shadow-2xl shadow-teal-500/50 border-4 border-teal-400"
            >
              {isGenerating ? (
                <>
                  <span className="inline-block animate-spin mr-2">😰</span>
                  GENEREREN...
                </>
              ) : (
                <>
                  🎯 GENEREER FRAPPANTE FOBIE
                </>
              )}
            </button>
          </div>

          {/* API Key Input */}
          {showApiKeyInput && (
            <div className="mb-12 bg-teal-950/60 backdrop-blur-sm border-2 border-teal-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                🔑 <span>API Key vereist</span>
              </h3>
              <p className="text-teal-200 mb-4 text-sm">
                Voer je Google Gemini API key in om fobieën te kunnen genereren.
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="AIza..."
                  className="flex-1 px-4 py-3 bg-teal-900/50 border-2 border-teal-700 rounded-lg text-white placeholder-teal-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
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
                  className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors"
                >
                  Opslaan
                </button>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="relative my-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-teal-800"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gradient-to-br from-gray-900 via-teal-950 to-cyan-950 px-6 text-teal-300 font-bold uppercase tracking-wider text-sm">
                Recente Fobieën
              </span>
            </div>
          </div>

          {/* Fobieen List */}
          <section>
            <FobieList fobieen={fobieen} onDelete={handleDelete} />
          </section>
        </main>

        <footer className="text-center mt-16 pt-8 border-t-2 border-teal-900">
          <p className="text-teal-500 text-sm">
            © {new Date().getFullYear()} • Frappante Fobieën • Aangedreven door AI • Voor de angst niet therapeutisch goedgekeurd
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
