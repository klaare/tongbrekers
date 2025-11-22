import { useState, useEffect } from 'react';
import type { Tongbreker } from './types';
import { generateId } from './utils/storage';
import { geminiService } from './services/gemini';
import { ApiKeyInput } from './components/ApiKeyInput';
import { GenerateButton } from './components/GenerateButton';
import { TongbrekerList } from './components/TongbrekerList';
import { Notification } from './components/Notification';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getTongbrekerFromUrl, clearUrlParams } from './utils/url';

function App() {
  const [tongbrekers, setTongbrekers] = useLocalStorage<Tongbreker[]>(
    'tering_tongbrekers_history',
    []
  );
  const [apiKey, setApiKey] = useLocalStorage<string | null>('gemini_api_key', null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // Get API key from environment or localStorage
  const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const activeApiKey = apiKey || envApiKey;

  // Check for shared tongbreker in URL on mount
  useEffect(() => {
    const sharedTongbreker = getTongbrekerFromUrl();
    if (sharedTongbreker) {
      // Add to the beginning of the list
      setTongbrekers((prev) => {
        // Check if it's already in the list (avoid duplicates)
        const exists = prev.some((t) => t.text === sharedTongbreker.text);
        if (exists) {
          return prev;
        }
        return [sharedTongbreker, ...prev].slice(0, 50);
      });
      // Clear URL params for clean URL
      clearUrlParams();
      showNotification('Gedeelde tongbreker geladen! 🔥', 'success');
    }
  }, []);

  // Only show API key input if no key is available (env or localStorage)
  useEffect(() => {
    setShowApiKeyInput(!activeApiKey);
  }, [activeApiKey]);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    setShowApiKeyInput(false);
    showNotification('API key opgeslagen! 🎉', 'success');
  };

  const handleGenerate = async () => {
    if (!activeApiKey) {
      setShowApiKeyInput(true);
      showNotification('API key vereist!', 'error');
      return;
    }

    setIsGenerating(true);

    try {
      const text = await geminiService.generateTongbreker(activeApiKey);

      const tongbreker: Tongbreker = {
        id: generateId(),
        text,
        created_at: new Date().toISOString(),
      };

      setTongbrekers((prev) => [tongbreker, ...prev].slice(0, 50));
      showNotification('Tongbreker gegenereerd! 🔥', 'success');
    } catch (error: any) {
      console.error('Generation error:', error);

      // Show API key input on rate limit error
      if (error.message?.includes('Te veel requests') || error.message?.includes('429')) {
        setShowApiKeyInput(true);
        showNotification('Rate limited! Voer een andere API key in. ⚠️', 'error');
      } else {
        showNotification(error.message || 'AI struikelde over zijn eigen tong...', 'error');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl font-black mb-2 bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
            🔥 Tering Tongbrekers 🔥
          </h1>
          <p className="text-gray-400 uppercase tracking-widest text-sm">
            AI-gedreven tongbreker chaos
          </p>
        </header>

        {/* Main Content */}
        <main>
          {/* Generate Section */}
          <div className="mb-12">
            <GenerateButton onClick={handleGenerate} isGenerating={isGenerating} />
          </div>

          {/* API Key Input */}
          {showApiKeyInput && <ApiKeyInput onSave={handleSaveApiKey} />}

          {/* Recent Tongbrekers */}
          <section>
            <h2 className="text-center text-gray-400 tracking-[0.3em] font-semibold mb-6">
              — RECENT —
            </h2>
            <TongbrekerList tongbrekers={tongbrekers} />
          </section>
        </main>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-background-surface">
          <p className="text-gray-500 text-sm">Gemaakt met 🤖 Gemini AI</p>
        </footer>
      </div>

      {/* Notifications */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
    </div>
  );
}

export default App;
