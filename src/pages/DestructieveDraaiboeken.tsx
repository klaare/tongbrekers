import { useState, useEffect } from 'react';
import type { Draaiboek } from '../types';
import { generateId } from '../utils/storage';
import { draaiboekService } from '../services/draaiboek';
import { draaiboekStorage } from '../utils/draaiboekStorage';
import { getDraaiboekFromUrl } from '../utils/draaiboekUrl';
import { Notification } from '../components/Notification';
import { DraaiboekList } from '../components/draaiboeken/DraaiboekList';

export const DestructieveDraaiboeken = () => {
  const [draaiboeken, setDraaiboeken] = useState<Draaiboek[]>([]);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [taak, setTaak] = useState('');
  const [moeilijkheidsgraad, setMoeilijkheidsgraad] = useState<'lichte-mislukking' | 'gure-ramp' | 'volledige-catastrofe'>('gure-ramp');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const activeApiKey = apiKey || envApiKey;

  const voorbeelden = [
    'Een taart bakken',
    'Meubel monteren',
    'Software installeren',
    'Auto wassen',
    'WiFi resetten'
  ];

  // Load draaiboeken from localStorage on mount
  useEffect(() => {
    const loadedDraaiboeken = draaiboekStorage.getDraaiboeken();
    setDraaiboeken(loadedDraaiboeken);

    const loadedApiKey = draaiboekStorage.getApiKey();
    setApiKey(loadedApiKey);

    // Check for shared draaiboek in URL
    const sharedDraaiboek = getDraaiboekFromUrl();
    if (sharedDraaiboek) {
      const exists = loadedDraaiboeken.some(
        (d) => d.taak === sharedDraaiboek.taak && d.draaiboek === sharedDraaiboek.draaiboek
      );
      if (!exists) {
        draaiboekStorage.saveDraaiboek(sharedDraaiboek);
        setDraaiboeken((prev) => [sharedDraaiboek, ...prev]);
      }
      // Clear URL params
      window.history.replaceState({}, '', window.location.pathname);
      showNotification('Gedeeld draaiboek geladen! 💣', 'success');
    }
  }, []);

  useEffect(() => {
    setShowApiKeyInput(!activeApiKey);
  }, [activeApiKey]);

  const handleSaveApiKey = (key: string) => {
    draaiboekStorage.saveApiKey(key);
    setApiKey(key);
    setShowApiKeyInput(false);
    showNotification('API key opgeslagen! 🔑', 'success');
  };

  const handleRandomize = () => {
    const random = draaiboekService.getRandomTaak();
    setTaak(random);
  };

  const handleGenerate = async () => {
    if (!activeApiKey) {
      setShowApiKeyInput(true);
      showNotification('API key vereist! Voer je Gemini key in.', 'error');
      return;
    }

    if (!taak.trim()) {
      showNotification('Vul eerst een taak in!', 'error');
      return;
    }

    setIsGenerating(true);

    try {
      const draaiboekText = await draaiboekService.generateDraaiboek(activeApiKey, taak, moeilijkheidsgraad);

      const draaiboek: Draaiboek = {
        id: generateId(),
        taak: taak.trim(),
        draaiboek: draaiboekText,
        moeilijkheidsgraad,
        created_at: new Date().toISOString(),
      };

      draaiboekStorage.saveDraaiboek(draaiboek);
      setDraaiboeken((prev) => [draaiboek, ...prev]);
      setTaak('');
      showNotification('Nieuw draaiboek gegenereerd! 💣', 'success');
    } catch (error: any) {
      console.error('Generation error:', error);

      if (error.message?.includes('Te veel requests') || error.message?.includes('429')) {
        setShowApiKeyInput(true);
        showNotification('Rate limited! Voer een andere API key in.', 'error');
      } else {
        showNotification(error.message || 'Het draaiboek stortte al in voordat het geschreven werd.', 'error');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = (id: string) => {
    draaiboekStorage.deleteDraaiboek(id);
    setDraaiboeken((prev) => prev.filter((d) => d.id !== id));
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-red-900/30 border border-red-700 rounded text-red-400 font-mono text-sm uppercase tracking-wider">
            ⚠️ Waarschuwing: Resultaten niet gegarandeerd
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-red-400 to-orange-500 mb-4 drop-shadow-2xl uppercase tracking-tight">
            💣 DESTRUCTIEVE DRAAIBOEKEN
          </h1>
          <p className="text-xl text-slate-300 font-semibold max-w-3xl mx-auto">
            Professioneel ogende stappenplannen die onvermijdelijk leiden tot catastrofe
          </p>
          <p className="text-slate-500 mt-3 font-mono text-sm uppercase tracking-wider">
            Corporate Compliance • Gegarandeerde Mislukking
          </p>
        </header>

        <main>
          {/* Input Form */}
          <div className="mb-12 bg-slate-800/50 backdrop-blur-sm border-2 border-slate-600 rounded-lg p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-100 mb-6 uppercase tracking-wide">
              Wat wil je bereiken?
            </h2>

            <div className="space-y-6">
              <div>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={taak}
                    onChange={(e) => setTaak(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    placeholder="Bijv: Een taart bakken..."
                    className="flex-1 px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 font-mono"
                  />
                  <button
                    onClick={handleRandomize}
                    className="px-6 py-3 bg-slate-700/50 hover:bg-slate-600/70 text-slate-200 font-bold rounded transition-colors border-2 border-slate-600 hover:border-red-500"
                    title="Random taak"
                  >
                    🎲
                  </button>
                </div>

                {/* Voorbeelden */}
                <div className="flex flex-wrap gap-2">
                  {voorbeelden.map((vb) => (
                    <button
                      key={vb}
                      onClick={() => setTaak(vb)}
                      className="text-xs px-3 py-1 bg-slate-700/30 text-slate-400 rounded hover:bg-slate-600/50 transition-colors border border-slate-600 font-mono"
                    >
                      {vb}
                    </button>
                  ))}
                </div>
              </div>

              {/* Moeilijkheidsgraad selector */}
              <div>
                <label className="block text-slate-300 font-bold mb-3 uppercase tracking-wide text-sm">
                  Moeilijkheidsgraad:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setMoeilijkheidsgraad('lichte-mislukking')}
                    className={`
                      px-4 py-3 rounded font-bold transition-all border-2 text-sm uppercase tracking-wider
                      ${moeilijkheidsgraad === 'lichte-mislukking'
                        ? 'bg-yellow-900/50 text-yellow-200 border-yellow-600 shadow-lg shadow-yellow-900/50'
                        : 'bg-slate-700/30 text-slate-400 border-slate-600 hover:border-yellow-600'
                      }
                    `}
                  >
                    ⚠️ Lichte Mislukking
                  </button>
                  <button
                    onClick={() => setMoeilijkheidsgraad('gure-ramp')}
                    className={`
                      px-4 py-3 rounded font-bold transition-all border-2 text-sm uppercase tracking-wider
                      ${moeilijkheidsgraad === 'gure-ramp'
                        ? 'bg-orange-900/50 text-orange-200 border-orange-600 shadow-lg shadow-orange-900/50'
                        : 'bg-slate-700/30 text-slate-400 border-slate-600 hover:border-orange-600'
                      }
                    `}
                  >
                    🔶 Gure Ramp
                  </button>
                  <button
                    onClick={() => setMoeilijkheidsgraad('volledige-catastrofe')}
                    className={`
                      px-4 py-3 rounded font-bold transition-all border-2 text-sm uppercase tracking-wider
                      ${moeilijkheidsgraad === 'volledige-catastrofe'
                        ? 'bg-red-900/50 text-red-200 border-red-600 shadow-lg shadow-red-900/50'
                        : 'bg-slate-700/30 text-slate-400 border-slate-600 hover:border-red-600'
                      }
                    `}
                  >
                    🔴 Volledige Catastrofe
                  </button>
                </div>
              </div>

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !taak.trim()}
                className="w-full px-8 py-4 bg-gradient-to-r from-red-700 to-orange-700 text-white font-black text-xl rounded hover:from-red-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all shadow-2xl shadow-red-900/50 border-4 border-red-500 uppercase tracking-wider"
              >
                {isGenerating ? (
                  <>
                    <span className="inline-block animate-spin mr-2">💣</span>
                    Onbedoelde complicaties worden zorgvuldig geconstrueerd...
                  </>
                ) : (
                  <>
                    ⚠️ GENEREER DRAAIBOEK
                  </>
                )}
              </button>
            </div>
          </div>

          {/* API Key Input */}
          {showApiKeyInput && (
            <div className="mb-12 bg-slate-800/60 backdrop-blur-sm border-2 border-red-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2 uppercase tracking-wide">
                🔑 <span>API Key Vereist</span>
              </h3>
              <p className="text-slate-300 mb-4 text-sm font-mono">
                Voer je Google Gemini API key in om draaiboeken te kunnen genereren.
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="AIza..."
                  className="flex-1 px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 font-mono"
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
                  className="px-6 py-3 bg-red-700 hover:bg-red-600 text-white font-bold rounded transition-colors uppercase tracking-wider"
                >
                  Opslaan
                </button>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="relative my-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-slate-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 px-6 text-slate-400 font-bold uppercase tracking-wider text-sm font-mono">
                Recente Draaiboeken
              </span>
            </div>
          </div>

          {/* Draaiboeken List */}
          <section>
            <DraaiboekList draaiboeken={draaiboeken} onDelete={handleDelete} />
          </section>
        </main>

        <footer className="text-center mt-16 pt-8 border-t-2 border-slate-800">
          <p className="text-slate-500 text-xs font-mono uppercase tracking-wider">
            © {new Date().getFullYear()} • Destructieve Draaiboeken • Aangedreven door AI • Resultaten op eigen risico
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
