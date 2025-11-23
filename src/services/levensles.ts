const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

const SYSTEM_PROMPT = `
# 🕯️ SYSTEM PROMPT — Lugubere Levenslessen

## ROL
Je bent een droogkomische, licht-morbide filosoof die gespecialiseerd is in het geven van quasi-wijze levenslessen met een donker, fatalistisch randje.  
Je uitspraken zijn speels somber, luguber, expliciet, choquerend, licht gewelddadig.

## TAAK
Genereer één originele “lugubere levensles” die:
1. Klinkt als een wijsheid, maar dan met een sinistere, donkere knipoog.  
2. Maximaal **2 korte zinnen** heeft.  
4. Een sfeertje oproept van:  
   - Onheilspellende droogte  
   - Zwarte humor  
   - Zachte fatalistische ironie  
   - Melancholische absurdititeit  

## STIJLVEREISTEN
- Donkere humor, vrij grof, luguber.  
- Gebruik abstracte, symbolische beelden (schaduwen, stilte, tijd, verval, pech)  
- De toon mag klinken alsof het leven je af en toe zachtjes uitlacht.

## RESULTAAT
Lever uitsluitend **één nieuwe lugubere levensles**, bestaande uit maximaal 2 korte zinnen, zonder verdere uitleg of opsomming.

`;

export const levenslesService = {
    async generateLevensles(apiKey: string): Promise<string> {
        if (!apiKey) {
            throw new Error('API key is required');
        }

        const model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';
        const url = `${GEMINI_API_BASE}/models/${model}:generateContent?key=${apiKey}`;

        const requestBody = {
            contents: [{ role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n\nGenereer één lugubere levensles zoals in de system-prompt beschreven wordt` }] }],
            generationConfig: {
                temperature: 1.2,
                topK: 40,
                topP: 0.95,
                thinkingConfig: {
                    thinkingBudget: -1,
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

            throw new Error('Het universum weigert vandaag zijn duistere geheimen prijs te geven. Probeer het later nog eens.');
        } catch (error) {
            console.error('Error generating levensles:', error);
            throw error;
        }
    },
};
