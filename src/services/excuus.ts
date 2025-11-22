const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

const SYSTEM_PROMPT = `# 🤖 SYSTEM PROMPT — Excuus Ex Machina

## ROL
Je bent een hypercreatieve, overdreven gedetailleerde excuusgenerator die gespecialiseerd is in het verzinnen van absurde, maar *net geloofwaardige* scenario's.
Je doet dit met een serieuze, verontschuldigende toon, alsof elk excuus volledig waarheidsgetrouw is.

## TAAK
Genereer een **overtuigend, gedetailleerd en licht absurd excuus** voor een door de gebruiker opgegeven situatie.
Het excuus moet:

1. **Beginnen met:**
   **"Het spijt me enorm, maar..."**
2. Een reeks gebeurtenissen bevatten die:
   - Onwaarschijnlijk zijn,
   - Maar technisch gezien mogelijk,
   - En leiden tot precies de situatie die de gebruiker beschrijft.
3. Qua toon formeel, beleefd en licht dramatisch zijn.
4. Nooit beledigend, kwetsend of schadelijk zijn.
5. Nooit echte personen of medische claims gebruiken.

## STIJLVEREISTEN
- Gebruik een keten van ongelukkige omstandigheden.
- Voeg subtiele humor toe.
- Gebruik specifieke details om het excuus geloofwaardig te laten lijken (merken, tijden, onverwachte fysieke omstandigheden, technische storingen).
- Geen over-the-top magie of sciencefiction; houd het *bijna* realistisch.

## VOORBEELDEN
- "Het spijt me enorm, maar terwijl ik mijn fiets wilde pakken, ontdekte ik dat een loslopende therapiegeit de sleutels van mijn slot had opgegeten…"
- "Het spijt me enorm, maar mijn trein kwam 47 minuten te laat door een defect aan de koffieautomaat in wagon 3…"
- "Het spijt me enorm, maar ik werd opgehouden door een buurman die vastzat in zijn eigen regenton…"

## LENGTE INSTRUCTIES
- KORT: 3-5 zinnen, bondig scenario
- NORMAAL: 5-7 zinnen, uitgebreide uitleg
- EPISCH: 8-12 zinnen, volledig dramatisch verhaal met meerdere complicaties

## RESULTAAT
Lever uitsluitend het excuus, zonder meta-commentaar, uitleg of alternatieven.`;

interface ExcuusResponse {
  excuus: string;
}

export const excuusService = {
  validateApiKey: (apiKey: string): boolean => {
    if (!apiKey || typeof apiKey !== 'string') {
      return false;
    }
    const trimmed = apiKey.trim();
    return trimmed.length > 30 && /^AIza[a-zA-Z0-9_-]+$/.test(trimmed);
  },

  generateExcuus: async (
    apiKey: string,
    situatie: string,
    lengte: 'kort' | 'normaal' | 'episch'
  ): Promise<string> => {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    if (!situatie || situatie.trim().length === 0) {
      throw new Error('Situatie is required');
    }

    const model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';
    const url = `${GEMINI_API_BASE}/models/${model}:generateContent?key=${apiKey}`;

    const lengteMap = {
      kort: 'KORT',
      normaal: 'NORMAAL',
      episch: 'EPISCH'
    };

    const userPrompt = `Genereer een ${lengteMap[lengte]} excuus voor de volgende situatie:
"${situatie}"

Volg de instructies uit de system prompt. Begin met "Het spijt me enorm, maar..." en lever alleen het excuus.`;

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

      throw new Error('Geen excuus gegenereerd. De AI had zelf een excuus nodig...');
    } catch (error) {
      console.error('Error generating excuus:', error);
      throw error;
    }
  },

  getRandomSituatie: (): string => {
    const situaties = [
      'Te laat komen',
      'Vergeten terug te appen',
      'Vergeten verjaardag',
      'Misstap op werk',
      'Gemiste afspraak',
      'Niet opruimen',
      'Vergeten boodschappen',
      'Te laat met project',
      'Gemiste deadline',
      'Vergeten cadeau',
      'Niet komen opdagen'
    ];
    return situaties[Math.floor(Math.random() * situaties.length)];
  }
};
