import { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { generateId } from '../utils/storage';
import { levenslesService } from '../services/levensles';
import { ApiKeyInput } from '../components/ApiKeyInput';
import { LevenslesButton } from '../components/LevenslesButton';
import { Notification } from '../components/Notification';
import { useTTS } from '../hooks/useTTS';
import { useShare } from '../hooks/useShare';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Levensles {
    id: string;
    text: string;
    created_at: string;
}

export const LugubereLevenslessenPage = () => {
    const [levenslessen, setLevenslessen] = useLocalStorage<Levensles[]>(
        'lugubere_levenslessen_history',
        []
    );
    const [apiKey, setApiKey] = useLocalStorage<string | null>('gemini_api_key', null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showApiKeyInput, setShowApiKeyInput] = useState(false);
    const [notification, setNotification] = useState<{
        message: string;
        type: 'success' | 'error';
    } | null>(null);

    const { speak, currentId, isSupported: ttsSupported } = useTTS();
    useShare();

    const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const activeApiKey = apiKey || envApiKey;

    useEffect(() => {
        setShowApiKeyInput(!activeApiKey);
    }, [activeApiKey]);

    const handleSaveApiKey = (key: string) => {
        setApiKey(key);
        setShowApiKeyInput(false);
        showNotification('Sleutel tot de afgrond geaccepteerd', 'success');
    };

    const handleGenerate = async () => {
        if (!activeApiKey) {
            setShowApiKeyInput(true);
            showNotification('Sleutel vereist om de duisternis te ontsluiten', 'error');
            return;
        }

        setIsGenerating(true);

        try {
            const text = await levenslesService.generateLevensles(activeApiKey);

            const les: Levensles = {
                id: generateId(),
                text,
                created_at: new Date().toISOString(),
            };

            setLevenslessen((prev) => [les, ...prev].slice(0, 50));
            showNotification('Een nieuwe onheilspellende waarheid is onthuld', 'success');
        } catch (error: any) {
            console.error('Generation error:', error);
            showNotification(error.message || 'De duisternis zwijgt...', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleShare = async (les: Levensles) => {
        // Create a temporary container for the square image
        const container = document.createElement('div');
        Object.assign(container.style, {
            width: '1080px',
            height: '1080px',
            position: 'fixed',
            left: '-9999px',
            top: '0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '80px',
            backgroundColor: '#0f172a', // slate-900
            backgroundImage: 'linear-gradient(to bottom right, #0f172a, #1e293b)',
            fontFamily: 'serif',
            color: '#f1f5f9', // slate-100
            boxSizing: 'border-box',
        });

        // Construct the inner HTML for the card
        container.innerHTML = `
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 12px; background-color: #7f1d1d;"></div>
            <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 12px; background-color: #7f1d1d;"></div>
            
            <div style="
                font-size: 32px; 
                text-transform: uppercase; 
                letter-spacing: 0.3em; 
                color: #ef4444; 
                margin-bottom: 60px; 
                font-family: sans-serif; 
                font-weight: bold;
                text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            ">
                Lugubere Levenslessen
            </div>

            <div style="
                font-size: 56px; 
                line-height: 1.4; 
                text-align: center; 
                font-style: italic; 
                margin-bottom: 80px; 
                max-width: 90%;
                text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            ">
                "${les.text}"
            </div>

            <div style="
                font-size: 24px; 
                color: #64748b; 
                text-transform: uppercase; 
                letter-spacing: 0.15em; 
                font-family: sans-serif;
                font-weight: 600;
            ">
                ${new Date(les.created_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            
            <div style="
                margin-top: 20px;
                font-size: 16px;
                color: #475569;
                font-family: sans-serif;
            ">
                ai-absurditeiten.nl
            </div>
        `;

        document.body.appendChild(container);

        try {
            const canvas = await html2canvas(container, {
                scale: 1, // 1080x1080 is already high res
                backgroundColor: null,
                useCORS: true,
            });

            canvas.toBlob(async (blob) => {
                if (!blob) {
                    showNotification('Kon geen afbeelding genereren', 'error');
                    return;
                }

                const file = new File([blob], 'lugubere-levensles.png', { type: 'image/png' });

                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            files: [file],
                            title: 'Lugubere Levensles',
                            text: 'Een wijsheid uit de duisternis...',
                        });
                        showNotification('De duisternis is gedeeld', 'success');
                    } catch (error) {
                        if ((error as Error).name !== 'AbortError') {
                            console.error('Share error:', error);
                            showNotification('Delen mislukt', 'error');
                        }
                    }
                } else {
                    // Fallback: Download image
                    const link = document.createElement('a');
                    link.download = 'lugubere-levensles.png';
                    link.href = canvas.toDataURL();
                    link.click();
                    showNotification('Afbeelding gedownload (delen niet ondersteund)', 'success');
                }
            }, 'image/png');
        } catch (error) {
            console.error('Image generation error:', error);
            showNotification('Kon geen afbeelding genereren', 'error');
        } finally {
            document.body.removeChild(container);
        }
    };

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
    };

    const closeNotification = () => {
        setNotification(null);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-serif selection:bg-red-900 selection:text-white">
            <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
                <header className="text-center mb-12 border-b-2 border-red-900/50 pb-8">
                    <div className="mb-4">
                        <div className="text-sm tracking-[0.3em] text-red-600 uppercase mb-2 font-sans font-bold">
                            Memento Mori
                        </div>
                        <h1 className="font-headline text-5xl md:text-7xl text-white mb-2 leading-tight drop-shadow-lg">
                            Lugubere Levenslessen
                        </h1>
                        <div className="flex items-center justify-center gap-4 text-sm text-slate-400 uppercase tracking-widest font-sans font-bold">
                            <span>†</span>
                            <span>Pessimisme</span>
                            <span>†</span>
                            <span>Nihilisme</span>
                            <span>†</span>
                        </div>
                    </div>
                    <p className="text-base text-slate-300 italic max-w-2xl mx-auto leading-relaxed border-l-2 border-red-900 pl-4">
                        "Wijsheid die u liever niet had willen weten, maar toch niet kunt negeren."
                    </p>
                </header>

                <main>
                    <div className="mb-12 flex justify-center">
                        <LevenslesButton
                            onClick={handleGenerate}
                            isGenerating={isGenerating}
                        />
                    </div>

                    {showApiKeyInput && (
                        <div className="bg-slate-800 p-6 rounded border border-red-900/50 mb-8 shadow-lg">
                            <ApiKeyInput onSave={handleSaveApiKey} />
                        </div>
                    )}

                    <div className="flex items-center justify-center my-12 opacity-70">
                        <div className="h-px bg-gradient-to-r from-transparent via-red-800 to-transparent w-full max-w-xs"></div>
                        <span className="mx-4 text-red-700 text-2xl">☠</span>
                        <div className="h-px bg-gradient-to-r from-transparent via-red-800 to-transparent w-full max-w-xs"></div>
                    </div>

                    <section className="space-y-6">
                        {levenslessen.map((les) => (
                            <article
                                key={les.id}
                                className="bg-slate-800 border border-slate-700 p-6 md:p-8 rounded-sm shadow-xl relative overflow-hidden group hover:border-red-800 transition-colors"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-red-900/40 group-hover:bg-red-700 transition-colors"></div>
                                <div className="font-serif text-xl md:text-2xl text-slate-200 leading-relaxed text-center italic">
                                    "{les.text}"
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-xs text-slate-500 uppercase tracking-widest font-sans font-semibold">
                                        {new Date(les.created_at).toLocaleDateString()}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => speak(les.text, les.id)}
                                            disabled={!ttsSupported}
                                            className={`
                                                px-3 py-2 text-xl rounded border border-slate-600
                                                bg-slate-900 hover:bg-slate-800 hover:border-red-700
                                                text-slate-300 hover:text-red-100
                                                transition-all duration-200 hover:scale-110 active:scale-95
                                                ${!ttsSupported ? 'opacity-40 cursor-not-allowed' : ''}
                                            `}
                                            title={ttsSupported ? 'Speel af' : 'TTS niet ondersteund'}
                                        >
                                            {currentId === les.id ? '⏸️' : '▶️'}
                                        </button>
                                        <button
                                            onClick={() => handleShare(les)}
                                            className="px-3 py-2 text-xl rounded border border-slate-600 bg-slate-900 hover:bg-slate-800 hover:border-red-700 text-slate-300 hover:text-red-100 transition-all duration-200 hover:scale-110 active:scale-95"
                                            title="Delen"
                                        >
                                            📤
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}

                        {levenslessen.length === 0 && (
                            <div className="text-center text-slate-500 italic py-12 text-lg">
                                De leegte staart u aan... durft u haar te vullen?
                            </div>
                        )}
                    </section>
                </main>

                <footer className="text-center mt-16 pt-8 border-t border-slate-800">
                    <p className="text-sm text-slate-500 tracking-wide font-sans">
                        © {new Date().getFullYear()} • Lugubere Levenslessen • Gebruik op eigen risico
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
