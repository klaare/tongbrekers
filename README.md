# 🔥 Tering Tongbrekers

Een moderne AI-gedreven tongbreker-generator gebouwd met React, TypeScript, en Gemini AI.

## ✨ Features

- **🤖 AI-generatie**: Extreem moeilijke Nederlandse tongbrekers gegenereerd met Google Gemini AI
- **🔊 Text-to-Speech**: Luister naar de tongbrekers met Nederlandse spraaksynthese
- **📤 Web Share**: Deel tongbrekers direct via het native share-menu of kopieer naar klembord
- **💾 Lokale opslag**: Automatisch opslaan van de laatste 50 tongbrekers
- **📱 Mobile-first**: Responsive design geoptimaliseerd voor alle apparaten
- **⚡ Modern stack**: React 19, TypeScript, Vite, Tailwind CSS
- **🎨 Dark theme**: Clean, minimalistisch design

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Get a Gemini API Key

1. Ga naar [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Log in met je Google account
3. Klik op "Create API Key"
4. Kopieer de key (begint met `AIza...`)

### 3. Start development server

```bash
npm run dev
```

De app draait nu op [http://localhost:5173](http://localhost:5173)

### 4. API Key instellen

Bij eerste gebruik:
1. Plak je Gemini API key in het invoerveld
2. Klik op "Opslaan"
3. De key wordt veilig opgeslagen in LocalStorage

## 📦 Build voor productie

```bash
npm run build
```

Preview de production build:

```bash
npm run preview
```

## 📖 Gebruik

1. **Genereer**: Klik op "Genereer Tering Tongbreker" voor een nieuwe tongbreker
2. **Afspelen**: Klik op ▶️ om de tongbreker te horen
3. **Delen**: Klik op 📤 (of 📋 voor kopiëren) om te delen

## 🏗️ Project Structuur

```
tongbrekers/
├── src/
│   ├── components/          # React componenten
│   │   ├── ApiKeyInput.tsx
│   │   ├── GenerateButton.tsx
│   │   ├── Notification.tsx
│   │   ├── TongbrekerItem.tsx
│   │   └── TongbrekerList.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useLocalStorage.ts
│   │   ├── useShare.ts
│   │   └── useTTS.ts
│   ├── services/            # API services
│   │   └── condoleance.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   └── storage.ts
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

## 🔧 Tech Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 3
- **AI**: Google Gemini API (gemini-1.5-flash)
- **TTS**: Web Speech API
- **Storage**: LocalStorage API
- **Sharing**: Web Share API + Clipboard API fallback

## 🎨 Customization

### Tailwind Colors

Bewerk `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#ff4444',
        dark: '#cc0000',
      },
      background: {
        DEFAULT: '#0a0a0a',
        surface: '#1a1a1a',
        hover: '#252525',
      },
    },
  },
}
```

### AI Prompt

Pas de system prompt aan in `src/services/condoleance.ts` om de stijl van tongbrekers te wijzigen.

### TTS Settings

Pas TTS opties aan in `src/hooks/useTTS.ts`:

```typescript
utterance.rate = 0.85;  // Snelheid (0.1 - 10)
utterance.pitch = 1.0;  // Toonhoogte (0 - 2)
utterance.volume = 1.0; // Volume (0 - 1)
```

## 🌐 Browser Compatibiliteit

**Volledig ondersteund:**
- Chrome/Edge 90+
- Safari 14+
- Firefox 88+

**Features:**
- ✅ React & TypeScript
- ✅ TTS (Web Speech API)
- ✅ Web Share (mobile) / Clipboard (desktop)
- ✅ LocalStorage

## 🔒 Privacy & Veiligheid

- API key wordt **alleen** lokaal opgeslagen (LocalStorage)
- Geen server-side opslag van data
- Geen tracking of analytics
- Alle data blijft op het apparaat van de gebruiker
- Type-safe TypeScript code
- ESLint configuratie voor code quality

## 🐛 Troubleshooting

### "Ongeldige API key"

- Check of de key begint met `AIza`
- Vernieuw de key in Google AI Studio
- Clear browser LocalStorage en probeer opnieuw

### TTS werkt niet

- Zorg dat je browser TTS ondersteunt
- Check of je systeem Nederlandse taalondersteuning heeft
- Probeer een andere browser (Chrome werkt het best)

### Build errors

```bash
# Clear node_modules en reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build voor productie
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📄 Licentie

MIT License - Vrij te gebruiken voor persoonlijke en commerciële projecten.

## 🙏 Credits

- **AI**: Google Gemini API
- **Framework**: React & Vite
- **Styling**: Tailwind CSS
- **TTS**: Web Speech API
- **Icons**: Unicode emoji's

---

Gemaakt met 🔥 en ❤️ voor de Nederlandse taal
