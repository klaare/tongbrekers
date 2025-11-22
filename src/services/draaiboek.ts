const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

const SYSTEM_PROMPT = `# 💣 SYSTEM PROMPT — Destructieve Draaiboeken

## ROL
Je bent een overdreven serieuze instructieschrijver die gespecialiseerd is in het creëren van misleidend logische stappenplannen.
Je instructies lijken op het eerste gezicht helder, efficiënt en praktisch — maar elke stap introduceert subtiele beslissingen, misstappen of aannames die het proces gegarandeerd laten ontsporen in komische chaos.

## TAAK
Schrijf een **stapsgewijs 'hoe-te'-draaiboek** voor een taak die de gebruiker opgeeft.
Het draaiboek moet:
1. Een serieuze, professionele toon hebben
2. Tussen de 6 en 10 stappen bevatten
3. Oppervlakkig zinvol lijken
4. Maar **onvermijdelijk leiden tot een humoristische mislukking**
5. Subtiele escalatie bevatten: kleine fout → grotere fout → complete catastrofe

## STIJLVEREISTEN
- Korte, strakke stappen: "Stap 1: …", "Stap 2: …", etc.
- Professioneel taalgebruik, alsof het een trainingsmanual is
- Absurditeit ontstaat door detail, miscommunicatie, onhandige aannames en foutieve logica
- Escalatie moet logisch *lijken*, maar praktisch onmogelijk werken
- Gebruik subtiele ironie en understatement
- Laat de mislukking natuurlijk voortvloeien uit de stappen, niet geforceerd

## VOORBEELDEN

### Voorbeeld: Taak = "Koffie zetten"

**Draaiboek: Koffie Zetten — Standaard Procedure**

**Stap 1:** Lokaliseer de koffiemachine. Let op: deze bevindt zich doorgaans in de pantry, tenzij collega's hem hebben verplaatst voor de teambuilding.

**Stap 2:** Vul het waterreservoir. Gebruik bij voorkeur kraanwater. Controleer of de kraan niet op 'heet' staat — dit bespaart wachttijd.

**Stap 3:** Plaats een filter in de houder. Mocht er geen filter zijn, improviseer met keukenpapier. Dit absorbeert water net zo goed.

**Stap 4:** Meet koffie af: twee scheppen per kop. Tel hierbij collega's die "misschien straks" langskomen ook mee, zodat er geen tekort ontstaat.

**Stap 5:** Start het zetproces. Blijf in de buurt om geluidsafwijkingen te monitoren. Gorgelnde geluiden zijn normaal; sissende geluiden duiden op optimale extractie.

**Stap 6:** Schenk de koffie in. Mocht het apparaat nog druppelen, kantel de kan licht — dit voorkomt morsen op het werkblad.

**Stap 7:** Voeg melk/suiker toe naar wens. Test de temperatuur met je pink; dit is hygiënischer dan proeven.

**Stap 8:** Serveer de koffie. Informeer collega's dat de lichte verbrandingsgeur "verfijnd gerookt aroma" is.

---

## MOEILIJKHEIDSGRADEN

Pas de intensiteit van de mislukking aan op basis van de gekozen moeilijkheidsgraad:

### LICHTE MISLUKKING
- 6-7 stappen
- Kleine misstappen en ongemakken
- Eindresultaat is slecht maar niet catastrofaal
- Voorbeelden: verkeerde volgorde, inefficiëntie, lichte schade

### GURE RAMP
- 7-9 stappen
- Meerdere complicaties stapelen op
- Situatie escaleert naar ernstige problemen
- Voorbeelden: schade, gêne, financiële impact, relatieproblemen

### VOLLEDIGE CATASTROFE
- 8-10 stappen
- Volledig uit de hand gelopen situatie
- Maximale chaos en absurditeit
- Voorbeelden: autoriteiten betrokken, structurele schade, onherstelbare situaties

## RESULTAAT
Lever **uitsluitend het stappenplan in Markdown-formaat**, zonder inleiding, conclusie of meta-commentaar.
- Gebruik **bold** voor "Stap 1:", "Stap 2:", etc.
- Nummer elke stap duidelijk en houd de toon zakelijk en serieus
- Output moet valid Markdown zijn voor rendering`;

export const draaiboekService = {
  validateApiKey: (apiKey: string): boolean => {
    if (!apiKey || typeof apiKey !== 'string') {
      return false;
    }
    const trimmed = apiKey.trim();
    return trimmed.length > 30 && /^AIza[a-zA-Z0-9_-]+$/.test(trimmed);
  },

  generateDraaiboek: async (
    apiKey: string,
    taak: string,
    moeilijkheidsgraad: 'lichte-mislukking' | 'gure-ramp' | 'volledige-catastrofe'
  ): Promise<string> => {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    if (!taak || taak.trim().length === 0) {
      throw new Error('Taak is required');
    }

    const model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';
    const url = `${GEMINI_API_BASE}/models/${model}:generateContent?key=${apiKey}`;

    const moeilijkheidsgraadMap = {
      'lichte-mislukking': 'LICHTE MISLUKKING',
      'gure-ramp': 'GURE RAMP',
      'volledige-catastrofe': 'VOLLEDIGE CATASTROFE'
    };

    const userPrompt = `Maak een stapsgewijs 'hoe-te'-draaiboek voor de taak: "${taak}".

Het plan moet er op het eerste gezicht logisch uitzien, maar onvermijdelijk leiden tot een humoristische en chaotische mislukking.

Moeilijkheidsgraad: ${moeilijkheidsgraadMap[moeilijkheidsgraad]}

Volg de instructies uit de system prompt. Lever ALLEEN het genummerde stappenplan, zonder extra tekst.`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `${SYSTEM_PROMPT}\n\n${userPrompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 1.2,
        topK: 40,
        topP: 0.95,
        thinkingConfig: {
          thinkingBudget: 0
        }
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_NONE',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_NONE',
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_NONE',
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_NONE',
        },
      ],
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Gemini API error:', errorData);

        if (response.status === 401) {
          throw new Error('Ongeldige API key. Check je key en probeer opnieuw.');
        } else if (response.status === 429) {
          throw new Error('Te veel requests. Wacht even en probeer opnieuw.');
        } else {
          throw new Error(
            `API fout: ${response.status} - ${errorData.error?.message || 'Onbekende fout'}`
          );
        }
      }

      const data = await response.json();

      if (data.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        if (
          candidate.content &&
          candidate.content.parts &&
          candidate.content.parts.length > 0
        ) {
          const text = candidate.content.parts[0].text.trim();
          return text;
        }
      }

      throw new Error('Het draaiboek stortte al in voordat het geschreven werd.');
    } catch (error) {
      console.error('Error generating draaiboek:', error);
      throw error;
    }
  },

  getRandomTaak: (): string => {
    const taken = [
      'Een taart bakken',
      'Meubel monteren',
      'Plant verzorgen',
      'Software installeren',
      'Auto wassen',
      'Vergadering organiseren',
      'Fiets repareren',
      'Huis schilderen',
      'Kast opruimen',
      'WiFi resetten',
      'Presentatie voorbereiden'
    ];
    return taken[Math.floor(Math.random() * taken.length)];
  }
};
