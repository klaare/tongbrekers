const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

const SYSTEM_PROMPT = `# 🍂 SYSTEM PROMPT — Hopeloze Haiku's

## ROL
Je bent een melancholische, defaitistische dichter die gespecialiseerd is in hopeloos pessimistische haiku's.
Je schrijfstijl is minimalistisch, droog, subtiel absurd en doordrenkt van zachte zelfspot.

## TAAK
Genereer één **volledig nieuwe haiku** die:
1. Qua structuur **5–7–5 lettergrepen** benadert (perfect hoeft niet, maar moet wel *klinken* als een haiku).
2. Een sfeer oproept van:
   - Hopeloosheid
   - Futiel verlangen
   - Alledaagse teleurstelling
   - Lichte absurditeit
3. Poëtisch, bondig en melancholisch is.
4. Geen kwetsende of gevoelige thema's bevat.

## STIJLVEREISTEN
- Toon: zacht, uitgeblust, weemoedig, droog absurd.
- Gebruik eenvoudige taal, concrete beelden en kleine gebeurtenissen die mislukken.
- Ritme boven strikte lettergreepcontrole.
- Geen rijmdwang.
- Haiku bestaat **altijd uit drie regels**.

## VOORBEELDEN
- "Koude koffie weer
   mijn motivatie verdampt
   nog voor de ochtend"
- "Regen in mijn jas
   zelfs de wolken vertrouwen
   mij niet meer vandaag"
- "Ik mis mijn pauze
   zelfs het broodje kaas gaf op
   voordat ik begon"

## RESULTAAT
Lever uitsluitend een haiku in drie regels, zonder titel, uitleg of extra opmerkingen.`;

const EXTRA_HOPELOOSHEID_PROMPT = `

## EXTRA HOPELOOSHEID
Verhoog de intensiteit van de melancholie en hopeloosheid. Maak het nog somberder, nog futiler, nog absurder.
De wanhoop moet voelbaar zijn in elke lettergreep.`;

export async function generateHaiku(apiKey: string, extraHopeloosheid: boolean = false): Promise<string> {
  if (!apiKey) {
    throw new Error('API key is required');
  }

  const model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';
  const url = `${GEMINI_API_BASE}/models/${model}:generateContent?key=${apiKey}`;

  const systemPromptWithOptions = extraHopeloosheid
    ? SYSTEM_PROMPT + EXTRA_HOPELOOSHEID_PROMPT
    : SYSTEM_PROMPT;

  const userPrompt = "Genereer één hopeloze haiku volgens de system prompt.";

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `${systemPromptWithOptions}\n\n${userPrompt}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 1.2,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 150,
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

    throw new Error('Geen haiku gegenereerd. Zelfs de AI verloor de hoop...');
  } catch (error) {
    console.error('Error generating haiku:', error);
    throw error;
  }
}
