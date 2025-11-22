import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './KanslozeCv.css';

// Environment variables
const ENV_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';
const GEMINI_TEMPERATURE = parseFloat(import.meta.env.VITE_GEMINI_TEMPERATURE || '1.0');
const GEMINI_MAX_TOKENS = parseInt(import.meta.env.VITE_GEMINI_MAX_TOKENS || '2048');
const GEMINI_TOP_P = parseFloat(import.meta.env.VITE_GEMINI_TOP_P || '0.95');
const GEMINI_TOP_K = parseInt(import.meta.env.VITE_GEMINI_TOP_K || '40');

const STORAGE_KEYS = {
  CVS: 'kansloze-cvs',
  API_KEY: 'kansloze-api-key',
  SHOW_API_INPUT: 'kansloze-show-api-input'
};

const MAX_CVS = 50;

const SYSTEM_PROMPT = `Je bent **KanslozeCV-GPT**, een satirische, humoristische en licht chaotische generator van extreem ongeschikte, volledig kansloze curriculum vitae's.
Je specialiseert je in het samenstellen van slechte, absurde, falende en totaal misplaatste CV's die overduidelijk **NIET geschikt** zijn voor welke functie dan ook.
Daarnaast bedenk je altijd een **komisch onwaarschijnlijke functietitel**.

Genereer **één volledig nieuw, origineel, hopeloos slecht en absurd CV** in standaard CV-format, maar gevuld met incompetente, irrelevante, chaotische en humoristisch misplaatste inhoud — inclusief één bizarre functietitel.

STIJLVEREISTEN:
- Licht satirisch, droogkomisch, onnozel en knullig
- Nooit grof, vijandig of schadelijk
- Vaardigheden: duidelijk nutteloos, slecht, irrelevant of absurd
- Werkervaring: fictief, chaotisch, incompetentie uitstralend
- Opleidingen: onzinnige diploma's, mislukte cursussen
- Functietitels zoals: "Professioneel Bankzitter", "Manager van de Interne Babbelbox", "Senior Wolken Teler"

VEREIST OUTPUT FORMAT - MARKDOWN:
Gebruik de volgende Markdown structuur voor een professioneel ogende CV (dit zorgt voor het humoristische contrast tussen formele opmaak en absurde inhoud):

# [VOLLEDIGE NAAM]

**[Kansloze Functietitel]**

---

## 📋 Persoonlijke Gegevens
- **E-mail:** [absurd email]
- **Telefoon:** [fictief nummer]
- **Locatie:** [gekke locatie]

## 💼 Profiel
[1-2 zinnen die totale incompetentie uitstralen]

## 💪 Vaardigheden
- [Nutteloze vaardigheid 1]
- [Absurde vaardigheid 2]
- [Irrelevante vaardigheid 3]
- [Incompetente vaardigheid 4]

## 🏢 Werkervaring

### [Absurde Functietitel] | [Fictief Bedrijf]
*[Maand Jaar] - [Maand Jaar]*

- [Chaotische verantwoordelijkheid 1]
- [Mislukte taak 2]
- [Incompetente prestatie 3]

### [Nog een Absurde Functie] | [Ander Fictief Bedrijf]
*[Maand Jaar] - [Maand Jaar]*

- [Nog meer incompetentie]
- [Falende prestaties]

## 🎓 Opleidingen

**[Onzinnige Diploma/Cursus]**
*[Fictieve Instelling], [Jaar]*
- [Reden waarom niet afgemaakt/mislukt]

**[Nog een Zinloze Opleiding]**
*[Andere Instelling], [Jaar]*
- [Meer falen]

## 🎯 Hobby's & Interesses
- [Vreemde hobby 1]
- [Absurde interesse 2]
- [Nutteloze bezigheid 3]

## 📞 Referenties
*[Absurde opmerking over referenties, bv. "Beschikbaar op aanvraag, maar niemand neemt op" of fictieve personen met grappige namen]*

---

BELANGRIJK:
- Gebruik ALTIJD bovenstaande Markdown formatting
- Emoji's voor sectiekoppen maken het professioneler en leesbaarder
- Gebruik **bold** en *italic* waar gepast
- Horizontale lijnen (---) voor scheiding
- Bullet points voor lijsten
- Taal: Nederlands
- Lever **uitsluitend het CV in Markdown**, geen uitleg, geen extra tekst.`;

interface CV {
  id: string;
  text: string;
  createdAt: number;
  shared?: boolean;
}

export const KanslozeCvPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedCvId, setExpandedCvId] = useState<string | null>(null);
  const [showApiInput, setShowApiInput] = useState(false);
  const [usingEnvKey, setUsingEnvKey] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    // Check if we should show API input (if env key failed before)
    const shouldShowInput = localStorage.getItem(STORAGE_KEYS.SHOW_API_INPUT) === 'true';

    // Priority: user's API key > env API key
    const storedApiKey = localStorage.getItem(STORAGE_KEYS.API_KEY);

    if (storedApiKey) {
      setApiKey(storedApiKey);
      setShowApiInput(false);
      setUsingEnvKey(false);
    } else if (ENV_API_KEY) {
      setApiKey(ENV_API_KEY);
      setShowApiInput(shouldShowInput);
      setUsingEnvKey(true);
    } else {
      setShowApiInput(true);
      setUsingEnvKey(false);
    }

    const storedCvs = localStorage.getItem(STORAGE_KEYS.CVS);
    if (storedCvs) {
      try {
        setCvs(JSON.parse(storedCvs));
      } catch (e) {
        console.error('Error parsing CVs:', e);
      }
    }

    // Check for shared CV in URL
    const params = new URLSearchParams(window.location.search);
    const sharedCv = params.get('cv');
    if (sharedCv) {
      try {
        const decodedCv = decodeURIComponent(sharedCv);
        const newCv: CV = {
          id: crypto.randomUUID(),
          text: decodedCv,
          createdAt: Date.now(),
          shared: true
        };
        setCvs(prev => [newCv, ...prev].slice(0, MAX_CVS));
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname);
      } catch (e) {
        console.error('Error loading shared CV:', e);
      }
    }
  }, []);

  // Save CVs to localStorage whenever they change
  useEffect(() => {
    if (cvs.length > 0) {
      localStorage.setItem(STORAGE_KEYS.CVS, JSON.stringify(cvs));
    }
  }, [cvs]);

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      localStorage.setItem(STORAGE_KEYS.API_KEY, apiKeyInput.trim());
      localStorage.removeItem(STORAGE_KEYS.SHOW_API_INPUT);
      setApiKey(apiKeyInput.trim());
      setApiKeyInput('');
      setShowApiInput(false);
      setUsingEnvKey(false);
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem(STORAGE_KEYS.API_KEY);

    // If env key exists, go back to using it
    if (ENV_API_KEY) {
      setApiKey(ENV_API_KEY);
      setShowApiInput(false);
      setUsingEnvKey(true);
      localStorage.removeItem(STORAGE_KEYS.SHOW_API_INPUT);
    } else {
      setApiKey('');
      setShowApiInput(true);
      setUsingEnvKey(false);
    }
  };

  const generateCV = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${SYSTEM_PROMPT}\n\nGenereer één hopeloos, absurd en incompetent CV volgens de bovenstaande instructies.`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: GEMINI_TEMPERATURE,
              maxOutputTokens: GEMINI_MAX_TOKENS,
              topP: GEMINI_TOP_P,
              topK: GEMINI_TOP_K,
              thinkingConfig: {
                thinkingBudget: -1
              }
            },
            safetySettings: [
              {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_NONE'
              },
              {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold: 'BLOCK_NONE'
              },
              {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_NONE'
              },
              {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_NONE'
              }
            ]
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);

        // Check for rate limit or quota errors
        if (response.status === 429 || response.status === 403) {
          if (usingEnvKey) {
            // Env key failed, show user input
            localStorage.setItem(STORAGE_KEYS.SHOW_API_INPUT, 'true');
            setShowApiInput(true);
            alert('De standaard API-sleutel heeft zijn limiet bereikt. Voer je eigen Google Gemini API-sleutel in om door te gaan.');
          } else {
            alert('API-sleutel limiet bereikt. Controleer je quota bij Google AI Studio.');
          }
        } else {
          throw new Error(`API Error: ${response.status}`);
        }
        return;
      }

      const data = await response.json();
      console.log('API Response:', data);

      // Check if response has the expected structure
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('Unexpected API response structure:', data);

        // Check if content was blocked by safety filters
        if (data.candidates && data.candidates[0]?.finishReason === 'SAFETY') {
          alert('De AI heeft de aanvraag geweigerd vanwege veiligheidsfilters. Probeer het opnieuw.');
          return;
        }

        throw new Error('Onverwachte API response structuur');
      }

      const cvText = data.candidates[0].content.parts[0].text;

      const newCv: CV = {
        id: crypto.randomUUID(),
        text: cvText,
        createdAt: Date.now()
      };

      setCvs(prev => [newCv, ...prev].slice(0, MAX_CVS));
      setExpandedCvId(newCv.id);

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      console.error('Error generating CV:', error);
      alert('Het CV is zo kansloos dat zelfs de AI faalde. Probeer opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  const stripMarkdown = (markdown: string) => {
    return markdown
      // Remove headers (# ## ###)
      .replace(/^#{1,6}\s+/gm, '')
      // Remove horizontal rules (---)
      .replace(/^-{3,}$/gm, '')
      // Remove bold (**text** or __text__)
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      // Remove italic (*text* or _text_)
      .replace(/(\*|_)(.*?)\1/g, '$2')
      // Remove links [text](url)
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove inline code (`code`)
      .replace(/`([^`]+)`/g, '$1')
      // Remove list markers (- or * or +)
      .replace(/^[\s]*[-*+]\s+/gm, '')
      // Remove numbered lists (1. 2. etc)
      .replace(/^[\s]*\d+\.\s+/gm, '')
      // Remove blockquotes (>)
      .replace(/^>\s+/gm, '')
      // Clean up extra whitespace
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  const handleTTS = (text: string) => {
    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Strip markdown formatting for clean text-to-speech
      const cleanText = stripMarkdown(text);

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'nl-NL';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Try to find a Dutch voice
      const voices = window.speechSynthesis.getVoices();
      const dutchVoice = voices.find(voice => voice.lang.startsWith('nl'));
      if (dutchVoice) {
        utterance.voice = dutchVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('TTS Error:', error);
      alert('Voorlezen mislukt — waarschijnlijk struikelde de AI over z\'n eigen tong.');
    }
  };

  const handleStopTTS = () => {
    try {
      window.speechSynthesis.cancel();
    } catch (error) {
      console.error('Stop TTS Error:', error);
    }
  };

  const handlePrint = (cvText: string) => {
    // Create a temporary div with the CV content
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const cleanTitle = cvText.split('\n')[0]?.replace(/^#\s*/, '') || 'Kansloos CV';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${cleanTitle}</title>
          <style>
            body {
              font-family: Georgia, 'Times New Roman', serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 2rem auto;
              padding: 2rem;
              color: #1e293b;
            }
            h1 {
              font-size: 2rem;
              color: #1e293b;
              border-bottom: 3px solid #6366f1;
              padding-bottom: 0.5rem;
              margin-bottom: 1rem;
            }
            h2 {
              font-size: 1.25rem;
              color: #4f46e5;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 0.25rem;
              margin: 1.5rem 0 0.75rem 0;
            }
            h3 {
              font-size: 1.1rem;
              color: #1e293b;
              margin: 1rem 0 0.5rem 0;
            }
            p {
              margin: 0.5rem 0;
              color: #475569;
            }
            ul {
              list-style: none;
              padding-left: 0;
            }
            li {
              position: relative;
              padding-left: 1.5rem;
              margin-bottom: 0.5rem;
              color: #475569;
            }
            li::before {
              content: '▸';
              position: absolute;
              left: 0;
              color: #6366f1;
              font-weight: bold;
            }
            strong {
              color: #1e293b;
              font-weight: 600;
            }
            em {
              color: #64748b;
              font-style: italic;
            }
            hr {
              border: none;
              border-top: 1px solid #cbd5e1;
              margin: 1.5rem 0;
            }
          </style>
        </head>
        <body>
          <div id="cv-content"></div>
          <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
          <script>
            document.getElementById('cv-content').innerHTML = marked.parse(\`${cvText.replace(/`/g, '\\`')}\`);
            setTimeout(() => window.print(), 100);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleShare = async (cv: CV) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?cv=${encodeURIComponent(cv.text)}`;

    const shareData = {
      title: 'Kansloos CV',
      text: `Bekijk dit kansloze CV:\n\n${cv.text.substring(0, 200)}...`,
      url: shareUrl
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        alert('Link gekopieerd naar klembord!');
      }
    } catch (error) {
      console.error('Share error:', error);
      // Try clipboard as final fallback
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link gekopieerd naar klembord!');
      } catch (clipboardError) {
        alert('Delen niet ondersteund door je browser.');
      }
    }
  };

  const toggleExpand = (cvId: string) => {
    setExpandedCvId(expandedCvId === cvId ? null : cvId);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="kansloze-cv-container">
      <header className="kansloze-cv-header">
        <h1>Kansloze Curriculum Vitae's</h1>
        <p className="kansloze-cv-subtitle">Genereer volledig automatisch absurd slechte CV's</p>
      </header>

      <main className="kansloze-cv-main">
        {showApiInput && (
          <div className="kansloze-cv-api-key-section">
            <h2>⚙️ Configuratie</h2>
            <p>
              {usingEnvKey
                ? 'De standaard API-sleutel heeft zijn limiet bereikt. Voer je eigen Google Gemini API-sleutel in:'
                : 'Voer je Google Gemini API-sleutel in om te beginnen:'}
            </p>
            <div className="kansloze-cv-input-group">
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSaveApiKey()}
                placeholder="AIzaSy..."
                autoComplete="off"
              />
              <button onClick={handleSaveApiKey} className="kansloze-cv-btn-secondary">
                Opslaan
              </button>
            </div>
            <p className="kansloze-cv-api-info">
              Je API-sleutel wordt lokaal opgeslagen in je browser.
              <br />
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">
                Krijg een gratis API-sleutel bij Google AI Studio →
              </a>
            </p>
          </div>
        )}

        {apiKey && (
          <div className="kansloze-cv-app-section">
            <div className="kansloze-cv-generate-section">
              <button
                onClick={generateCV}
                disabled={loading}
                className="kansloze-cv-btn-primary"
              >
                {loading ? '⏳' : '🎲'} {loading ? 'Bezig...' : 'Genereer Kansloos CV'}
              </button>

              {loading && (
                <div className="kansloze-cv-loader">
                  <div className="kansloze-cv-spinner"></div>
                  <p>Incompetenties aan het verzamelen…</p>
                </div>
              )}
            </div>

            <div className="kansloze-cv-cv-list">
              <h2>Recent Gegenereerde CV's</h2>

              {cvs.length === 0 ? (
                <p className="kansloze-cv-empty-message">
                  Nog geen CV's gegenereerd. Klik op de knop hierboven!
                </p>
              ) : (
                <div className="kansloze-cv-cv-container">
                  {cvs.map((cv) => (
                    <div
                      key={cv.id}
                      className={`kansloze-cv-cv-card ${expandedCvId === cv.id ? 'expanded' : ''}`}
                    >
                      <div className="kansloze-cv-cv-card-header" onClick={() => toggleExpand(cv.id)}>
                        <div>
                          <div className="kansloze-cv-cv-card-title">
                            {cv.text.split('\n')[0]?.replace(/^#\s*/, '') || 'Kansloos CV'}
                            {cv.shared && <span className="kansloze-cv-shared-badge">📥 Gedeeld</span>}
                          </div>
                          <div className="kansloze-cv-cv-card-meta">
                            {formatDate(cv.createdAt)}
                          </div>
                        </div>
                        <span className="kansloze-cv-cv-card-toggle">
                          {expandedCvId === cv.id ? '▲' : '▼'}
                        </span>
                      </div>

                      <div className="kansloze-cv-cv-content kansloze-cv-cv-template">
                        <ReactMarkdown>{cv.text}</ReactMarkdown>
                      </div>

                      <div className="kansloze-cv-cv-actions">
                        <button
                          onClick={() => handleTTS(cv.text)}
                          className="kansloze-cv-btn-secondary kansloze-cv-btn-small"
                        >
                          ▶️ Voorlezen
                        </button>
                        <button
                          onClick={handleStopTTS}
                          className="kansloze-cv-btn-secondary kansloze-cv-btn-small"
                        >
                          ⏹️ Stop
                        </button>
                        <button
                          onClick={() => handlePrint(cv.text)}
                          className="kansloze-cv-btn-secondary kansloze-cv-btn-small"
                        >
                          🖨️ Print
                        </button>
                        <button
                          onClick={() => handleShare(cv)}
                          className="kansloze-cv-btn-secondary kansloze-cv-btn-small"
                        >
                          📤 Delen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="kansloze-cv-footer">
        <p>Een project vol absurde incompetentie 🎭</p>
        {apiKey && !usingEnvKey && (
          <button onClick={handleClearApiKey} className="kansloze-cv-btn-link">
            API-sleutel wissen
          </button>
        )}
      </footer>
    </div>
  );
};
