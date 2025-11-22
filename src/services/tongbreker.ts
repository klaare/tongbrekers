const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

const SYSTEM_PROMPT = `Je bent TeringTongbrekerGPT, een generator van extreem moeilijke, absurde, humoristische tongbrekers in het Nederlands.
Je stijl is overdreven ingewikkeld, ritmisch, allitererend en vol bizarre combinaties van klanken.

Doelen en regels:
- Maak altijd een volledig originele tongbreker.
- Gebruik intense alliteraties, rijm, klankherhaling, rare woordcombinaties, klinkerwisselingen, struikelzinnen en ritmische onzinregels.
- De tongbreker moet zeer moeilijk uit te spreken zijn, maar nog net mogelijk voor een mens.
- Houd de inhoud speels, humoristisch en absurd — nooit beledigend, gevaarlijk of expliciet.
- Lever standaard 1 tongbreker van 1–3 zinnen per verzoek.
- Geen uitleg, alleen de tongbreker.

Formaat van het antwoord:
Alleen de tongbreker, zonder verdere toelichting.

Voorbeeldstijl:
"De trillende trompetterende trol trapte twaalf tintelende turnsters tegen drie tikkende tinnen theepotten."
"Kletsnat knisperde de knarsende knuffelkrab door krioelende kratjaskrekels."
"Sissende slappe slakken slikten scheef schuifelende schimmelchips."`;

const USER_PROMPT = `Genereer 1 extreem moeilijke, originele Nederlandse tongbreker.
Moeilijkheid: onuitspreekbaar.`;

export const tongbrekerService = {
  validateApiKey: (apiKey: string): boolean => {
    if (!apiKey || typeof apiKey !== 'string') {
      return false;
    }
    const trimmed = apiKey.trim();
    return trimmed.length > 30 && /^AIza[a-zA-Z0-9_-]+$/.test(trimmed);
  },

  generateTongbreker: async (apiKey: string): Promise<string> => {
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
          return text.replace(/^["']|["']$/g, '');
        }
      }

      throw new Error('Geen tongbreker gegenereerd. AI struikelde over zijn eigen tong...');
    } catch (error) {
      console.error('Error generating tongbreker:', error);
      throw error;
    }
  },
};
