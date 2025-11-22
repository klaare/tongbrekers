# 🔥 Tering Tongbrekers

Een AI-gedreven tongbreker-generator met audio en share-functionaliteit.

## ✨ Features

- **🤖 AI-generatie**: Extreem moeilijke Nederlandse tongbrekers gegenereerd met Gemini AI
- **🔊 Text-to-Speech**: Luister naar de tongbrekers met Nederlandse spraaksynthese
- **📤 Web Share**: Deel tongbrekers direct via het native share-menu of kopieer naar klembord
- **💾 Lokale opslag**: Automatisch opslaan van de laatste 50 tongbrekers
- **📱 Mobile-first**: Responsive design geoptimaliseerd voor mobiele apparaten
- **⚡ Geen build tools**: Vanilla JavaScript met ES modules

## 🚀 Quick Start

### 1. Clone de repository

```bash
git clone <repository-url>
cd tongbrekers
```

### 2. API Key ophalen

Verkrijg een gratis Gemini API key:

1. Ga naar [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Log in met je Google account
3. Klik op "Create API Key"
4. Kopieer de key (begint met `AIza...`)

### 3. Start de app

**Optie A: Python (aanbevolen)**

```bash
python3 -m http.server 8000
```

**Optie B: Node.js**

```bash
npm run dev
```

**Optie C: VS Code Live Server**

Installeer de "Live Server" extensie en klik op "Go Live"

### 4. Open in browser

Open [http://localhost:8000](http://localhost:8000)

### 5. API Key instellen

Bij eerste gebruik:
1. Plak je Gemini API key in het invoerveld
2. Klik op "Opslaan"
3. De key wordt veilig opgeslagen in LocalStorage

## 📖 Gebruik

1. **Genereer**: Klik op "Genereer Tering Tongbreker" voor een nieuwe tongbreker
2. **Afspelen**: Klik op ▶️ om de tongbreker te horen
3. **Delen**: Klik op 📤 (of 📋 voor kopiëren) om te delen

## 🏗️ Project Structuur

```
tongbrekers/
├── index.html              # Hoofd HTML bestand
├── package.json            # NPM configuratie
├── .env.example            # Voorbeeld voor API key
├── README.md               # Dit bestand
├── css/
│   └── styles.css          # Styling (mobile-first)
├── js/
│   ├── app.js              # Hoofd applicatie logica
│   ├── gemini.js           # Gemini API integratie
│   ├── storage.js          # LocalStorage management
│   ├── tts.js              # Text-to-Speech
│   └── share.js            # Web Share API
└── assets/                 # (optioneel) Images/icons
```

## 🔧 Technische Details

### Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: Pure CSS (CSS Variables, Flexbox)
- **AI**: Google Gemini API (gemini-1.5-flash)
- **TTS**: Web Speech API
- **Storage**: LocalStorage API
- **Sharing**: Web Share API + Clipboard API fallback

### API Configuratie

**Gemini API Endpoint:**
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
```

**TTS Settings:**
- Taal: `nl-NL` (Nederlands)
- Rate: `0.85` (iets langzamer voor moeilijke tongbrekers)
- Pitch: `1.0`
- Volume: `1.0`

### Browser Compatibiliteit

**Volledig ondersteund:**
- Chrome/Edge 90+
- Safari 14+
- Firefox 88+

**TTS Support:**
- Chrome/Edge ✅
- Safari ✅
- Firefox ✅ (beperkte Nederlandse stemmen)

**Web Share:**
- Mobile browsers ✅
- Desktop (beperkt) - gebruikt clipboard fallback

## 🎨 Customization

### Stijl aanpassen

Bewerk CSS variabelen in `css/styles.css`:

```css
:root {
    --primary: #ff4444;           /* Primaire kleur */
    --background: #0a0a0a;        /* Achtergrondkleur */
    --text: #ffffff;              /* Tekstkleur */
    /* ... meer variabelen ... */
}
```

### AI Prompt aanpassen

Bewerk de `SYSTEM_PROMPT` in `js/gemini.js` om de stijl van tongbrekers aan te passen.

### TTS Settings

Pas TTS opties aan in `js/tts.js`:

```javascript
utterance.rate = 0.9;   // Snelheid (0.1 - 10)
utterance.pitch = 1.0;  // Toonhoogte (0 - 2)
utterance.volume = 1.0; // Volume (0 - 1)
```

## 🔒 Privacy & Veiligheid

- API key wordt **alleen** lokaal opgeslagen (LocalStorage)
- Geen server-side opslag van data
- Geen tracking of analytics
- Alle data blijft op het apparaat van de gebruiker

## 🐛 Troubleshooting

### "Ongeldige API key"

- Check of de key begint met `AIza`
- Vernieuw de key in Google AI Studio
- Clear browser cache en probeer opnieuw

### TTS werkt niet

- Zorg dat je browser TTS ondersteunt
- Check of je systeem Nederlandse taalondersteuning heeft
- Probeer een andere browser (Chrome werkt het best)

### Delen werkt niet op desktop

- Dit is normaal - Web Share API werkt vooral op mobiel
- De app gebruikt automatisch clipboard als fallback
- Klik op 📋 om te kopiëren naar klembord

## 📝 Licentie

MIT License - Vrij te gebruiken voor persoonlijke en commerciële projecten.

## 🙏 Credits

- **AI**: Google Gemini API
- **TTS**: Web Speech API
- **Icons**: Unicode emoji's

---

Gemaakt met 🔥 en ❤️ voor de Nederlandse taal
