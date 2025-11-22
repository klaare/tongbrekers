/**
 * Gemini API Integration
 * Handles text generation using Google's Gemini API
 */

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

// System prompt for generating tongbrekers
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

/**
 * Generate a tongbreker using Gemini API
 * @param {string} apiKey - Gemini API key
 * @returns {Promise<string>} The generated tongbreker text
 */
export async function generateTongbreker(apiKey) {
    if (!apiKey) {
        throw new Error('API key is required');
    }

    const model = 'gemini-1.5-flash'; // Using the free tier model
    const url = `${GEMINI_API_BASE}/models/${model}:generateContent?key=${apiKey}`;

    const requestBody = {
        contents: [
            {
                parts: [
                    {
                        text: `${SYSTEM_PROMPT}\n\n${USER_PROMPT}`
                    }
                ]
            }
        ],
        generationConfig: {
            temperature: 1.2, // High creativity
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 200,
        },
        safetySettings: [
            {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_NONE"
            },
            {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_NONE"
            },
            {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_NONE"
            },
            {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_NONE"
            }
        ]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Gemini API error:', errorData);

            if (response.status === 401) {
                throw new Error('Ongeldige API key. Check je key en probeer opnieuw.');
            } else if (response.status === 429) {
                throw new Error('Te veel requests. Wacht even en probeer opnieuw.');
            } else {
                throw new Error(`API fout: ${response.status} - ${errorData.error?.message || 'Onbekende fout'}`);
            }
        }

        const data = await response.json();

        // Extract the generated text
        if (data.candidates && data.candidates.length > 0) {
            const candidate = data.candidates[0];
            if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                const text = candidate.content.parts[0].text.trim();

                // Clean up any quotes or extra formatting
                return text.replace(/^["']|["']$/g, '');
            }
        }

        throw new Error('Geen tongbreker gegenereerd. AI struikelde over zijn eigen tong...');
    } catch (error) {
        console.error('Error generating tongbreker:', error);
        throw error;
    }
}

/**
 * Validate API key format
 * @param {string} apiKey - The API key to validate
 * @returns {boolean}
 */
export function validateApiKey(apiKey) {
    if (!apiKey || typeof apiKey !== 'string') {
        return false;
    }

    // Basic validation - Gemini keys typically start with "AIza"
    const trimmed = apiKey.trim();
    return trimmed.length > 30 && /^AIza[a-zA-Z0-9_-]+$/.test(trimmed);
}
