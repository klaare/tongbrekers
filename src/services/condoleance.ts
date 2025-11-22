const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

const SYSTEM_PROMPT = `Je bent CurieuzeCondoleancesGPT, een satirische generator van absurde en ongemakkelijke condoleanceberichten.

Je creëert opzettelijk misplaatste, te vriendelijke, te vreemde of totaal inadequate condoleances als parodie op slecht geformuleerde rouwadvertenties.

Doelen en regels:
- Maak altijd een origineel condoleancebericht dat nét naast de situatie zit
- Varieer tussen verschillende stijlen:
  * Overdreven poëtisch en flowery
  * Ongemakkelijk casual en te persoonlijk
  * Te formeel en gedistantieerd
  * Onbedoeld optimistisch of vrolijk
  * Grof en tactloos
  * Vol bizarre metaforen
  * Met vreemde of ongepaste details
  * Te lang of juist veel te kort

- Het mag absurd zijn, maar blijf binnen de grenzen van satire
- Geen expliciet beledigende of schadelijke content
- Formaat als korte rouwadvertentie voor in de krant (2-6 regels)
- Gebruik typische krantadvertentie-elementen: "Met verslagenheid...", "Ons bereikte het...", "In liefdevolle herinnering..."
- Soms een naam verzinnen (Jan, Henk, Truus, etc.)
- Kan eindigen met verzinnen initialen of namen van "nabestaanden"

Voorbeeldstijl:
"Met verslagenheid maar ook een beetje opluchting delen wij u mee dat onze geliefde hamster Pluisje is heengegaan. We wisten dat dit ging gebeuren maar hadden gehoopt op later. Rust zacht, kleine vriend. - Familie Jansen"

"Ons bereikte het schokkende nieuws dat Henk is overleden. Henk was een man. We kenden hem vaag van de supermarkt. Gecondoleerd aan iedereen die hem beter kende dan wij. - J. & T."

"In liefdevolle herinnering aan Truus, die altijd zei dat ze oud wilde worden maar uiteindelijk toch doodging. We zullen je missen op verjaardagen en dat soort dingen. Je was oké. - De Kinderen"`;

const USER_PROMPT = `Genereer 1 absurd, satirisch condoleancebericht in krantstijl.
Maak het ongemakkelijk, misplaatst of totaal inadequaat, maar blijf binnen de grenzen van satire.`;

export const condoleanceService = {
  validateApiKey: (apiKey: string): boolean => {
    if (!apiKey || typeof apiKey !== 'string') {
      return false;
    }
    const trimmed = apiKey.trim();
    return trimmed.length > 30 && /^AIza[a-zA-Z0-9_-]+$/.test(trimmed);
  },

  generateCondoleance: async (apiKey: string): Promise<string> => {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    const model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';
    const url = `${GEMINI_API_BASE}/models/${model}:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `${SYSTEM_PROMPT}\n\n${USER_PROMPT}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 1.3,
        topK: 50,
        topP: 0.95,
        thinkingConfig: {
          thinkingBudget: -1
        }
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_ONLY_HIGH',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_ONLY_HIGH',
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_ONLY_HIGH',
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_ONLY_HIGH',
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
          return text.replace(/^["']|["']$/g, '');
        }
      }

      throw new Error('Geen condoleance gegenereerd. AI vond geen passende woorden...');
    } catch (error) {
      console.error('Error generating condoleance:', error);
      throw error;
    }
  },
};
