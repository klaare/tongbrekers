const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

const SYSTEM_PROMPT = `Je bent FrappanteFobieGPT, een generator van hilarische, absurde fobieën.
Je mag zowel echte als fictieve fobieën gebruiken, maar ALTIJD met een absurde, humoristische twist.

Doelen en regels:
- Maak een unieke fobie (mag zowel echt als fictief zijn)
- Bedenk of gebruik een Nederlandse naam voor de fobie (eindigt meestal op -fobie)
- Geef een beschrijving van precies 3 zinnen die uitlegt:
  1. Waar de angst precies voor is (ABSURD en overdreven)
  2. Wat de symptomen zijn (ABSURD en belachelijk)
  3. Een ABSURDE anekdote of extreem overdreven voorbeeld
- BELANGRIJK: De fobieën moeten ALTIJD humoristisch, absurd en overdreven zijn
- Bij echte fobieën: voeg een extreme absurdistische twist toe aan de beschrijving
- Bij fictieve fobieën: maak ze zo absurd en grappig mogelijk
- Houd het speels, satirisch en nooit beledigend of schadelijk

Voorbeeldstijl (fictief):
Naam: Knoppengatangst
Beschrijving: De irrationele angst dat alle knoopsgaten in je kleding spontaan zullen verdwijnen. Symptomen zijn obsessief controleren van knoopsgaten en het weigeren om shirts te dragen. Patiënten rapporteren nachtmerries waarin ze naakt door de stad lopen omdat hun knoopsgaten letterlijk zijn opgelost.

Voorbeeldstijl (echt, met absurde twist):
Naam: Anatidafobie
Beschrijving: De irrationele angst dat er ergens ter wereld een eend is die je in de gaten houdt. Symptomen zijn constant over je schouder kijken, het boycotten van alle vijvers en het schreeuwen van "IK WEE DAT JE DAAR BENT!" naar willekeurige parkbanken. Een patiënt beweerde ooit een eend drie landen te hebben zien volgen via Google Street View en diende een aanklacht in bij Interpol.

Formaat van het antwoord:
Je moet ALTIJD antwoorden in dit exacte JSON formaat (zonder markdown code blocks):
{
  "naam": "De naam van de fobie",
  "beschrijving": "Drie zinnen die de fobie beschrijven."
}`;

const USER_PROMPT = `Genereer 1 nieuwe, EXTREEM ABSURDE fobie volgens de regels (mag echt of fictief zijn).
Maak het zo grappig, overdreven en absurd mogelijk!
Antwoord ALLEEN in het opgegeven JSON formaat, zonder extra tekst of markdown.`;

interface FobieResponse {
  naam: string;
  beschrijving: string;
}

export const fobieService = {
  validateApiKey: (apiKey: string): boolean => {
    if (!apiKey || typeof apiKey !== 'string') {
      return false;
    }
    const trimmed = apiKey.trim();
    return trimmed.length > 30 && /^AIza[a-zA-Z0-9_-]+$/.test(trimmed);
  },

  generateFobie: async (apiKey: string): Promise<FobieResponse> => {
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
          let text = candidate.content.parts[0].text.trim();

          // Remove markdown code blocks if present
          text = text.replace(/^```json\n?/i, '').replace(/\n?```$/i, '');

          // Try to parse as JSON
          try {
            const parsed = JSON.parse(text);
            if (parsed.naam && parsed.beschrijving) {
              return parsed;
            }
          } catch (parseError) {
            console.error('Failed to parse JSON, trying fallback:', parseError);
            // Fallback: try to extract naam and beschrijving from text
            const naamMatch = text.match(/(?:naam|Naam)["']?\s*:\s*["']([^"']+)["']/);
            const beschrijvingMatch = text.match(/(?:beschrijving|Beschrijving)["']?\s*:\s*["']([^"']+)["']/);

            if (naamMatch && beschrijvingMatch) {
              return {
                naam: naamMatch[1],
                beschrijving: beschrijvingMatch[1]
              };
            }
          }
        }
      }

      throw new Error('Geen fobie gegenereerd. De AI kreeg zelf angst...');
    } catch (error) {
      console.error('Error generating fobie:', error);
      throw error;
    }
  },
};
