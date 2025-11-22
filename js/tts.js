/**
 * Text-to-Speech (TTS) Module
 * Uses Web Speech API for browser-based TTS
 */

let currentSpeech = null;

/**
 * Check if TTS is supported in the browser
 * @returns {boolean}
 */
export function isTTSSupported() {
    return 'speechSynthesis' in window;
}

/**
 * Get available Dutch voices
 * @returns {Promise<SpeechSynthesisVoice[]>}
 */
export function getDutchVoices() {
    return new Promise((resolve) => {
        const synth = window.speechSynthesis;
        let voices = synth.getVoices();

        if (voices.length > 0) {
            const dutchVoices = voices.filter(voice =>
                voice.lang.startsWith('nl') || voice.lang.startsWith('nl-')
            );
            resolve(dutchVoices);
        } else {
            // Voices might not be loaded yet
            synth.onvoiceschanged = () => {
                voices = synth.getVoices();
                const dutchVoices = voices.filter(voice =>
                    voice.lang.startsWith('nl') || voice.lang.startsWith('nl-')
                );
                resolve(dutchVoices);
            };
        }
    });
}

/**
 * Speak the given text
 * @param {string} text - The text to speak
 * @param {Object} options - TTS options
 * @returns {Promise<void>}
 */
export async function speak(text, options = {}) {
    if (!isTTSSupported()) {
        throw new Error('Text-to-Speech wordt niet ondersteund in deze browser');
    }

    // Stop any ongoing speech
    stop();

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);

    // Get Dutch voice if available
    const dutchVoices = await getDutchVoices();
    if (dutchVoices.length > 0) {
        // Prefer Netherlands Dutch over Belgian Dutch
        const nlVoice = dutchVoices.find(v => v.lang === 'nl-NL') || dutchVoices[0];
        utterance.voice = nlVoice;
    }

    // Set options
    utterance.lang = options.lang || 'nl-NL';
    utterance.rate = options.rate || 0.9; // Slightly slower for difficult tongbrekers
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;

    return new Promise((resolve, reject) => {
        utterance.onend = () => {
            currentSpeech = null;
            resolve();
        };

        utterance.onerror = (event) => {
            currentSpeech = null;
            console.error('TTS error:', event);
            reject(new Error('Fout bij afspelen van audio'));
        };

        currentSpeech = utterance;
        synth.speak(utterance);
    });
}

/**
 * Stop current speech
 */
export function stop() {
    if (isTTSSupported()) {
        const synth = window.speechSynthesis;
        synth.cancel();
        currentSpeech = null;
    }
}

/**
 * Pause current speech
 */
export function pause() {
    if (isTTSSupported() && currentSpeech) {
        const synth = window.speechSynthesis;
        synth.pause();
    }
}

/**
 * Resume paused speech
 */
export function resume() {
    if (isTTSSupported()) {
        const synth = window.speechSynthesis;
        synth.resume();
    }
}

/**
 * Check if currently speaking
 * @returns {boolean}
 */
export function isSpeaking() {
    if (isTTSSupported()) {
        return window.speechSynthesis.speaking;
    }
    return false;
}

/**
 * Get status of current speech
 * @returns {Object}
 */
export function getStatus() {
    if (!isTTSSupported()) {
        return { supported: false, speaking: false, paused: false };
    }

    const synth = window.speechSynthesis;
    return {
        supported: true,
        speaking: synth.speaking,
        paused: synth.paused,
        pending: synth.pending
    };
}
