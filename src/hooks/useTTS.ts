import { useState, useCallback } from 'react';
import type { TTSOptions } from '../types';

export const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const isSupported = 'speechSynthesis' in window;

  /**
   * Get the best available Dutch voice
   * Waits for voices to load if necessary
   */
  const getDutchVoice = useCallback(async (): Promise<SpeechSynthesisVoice | null> => {
    if (!isSupported) return null;

    const synth = window.speechSynthesis;
    let voices = synth.getVoices();

    // If voices aren't loaded yet, wait for them
    if (voices.length === 0) {
      await new Promise<void>((resolve) => {
        synth.onvoiceschanged = () => {
          resolve();
        };
        // Timeout after 1 second if voices don't load
        setTimeout(() => resolve(), 1000);
      });
      voices = synth.getVoices();
    }

    // Priority order for Dutch voices
    const dutchVariants = [
      'nl-NL', // Netherlands Dutch (preferred)
      'nl-BE', // Belgian Dutch
      'nl',    // Generic Dutch
    ];

    // Try to find a Dutch voice in priority order
    for (const variant of dutchVariants) {
      const voice = voices.find((v) => v.lang === variant);
      if (voice) {
        console.log('🇳🇱 Using Dutch voice:', voice.name, voice.lang);
        return voice;
      }
    }

    // Fallback: find any voice that starts with 'nl'
    const anyDutchVoice = voices.find((v) => v.lang.startsWith('nl'));
    if (anyDutchVoice) {
      console.log('🇳🇱 Using Dutch voice (fallback):', anyDutchVoice.name, anyDutchVoice.lang);
      return anyDutchVoice;
    }

    // Log available voices for debugging
    console.warn('⚠️ No Dutch voice found. Available voices:', voices.map(v => `${v.name} (${v.lang})`));
    return null;
  }, [isSupported]);

  const speak = useCallback(
    async (text: string, id: string, options: TTSOptions = {}) => {
      if (!isSupported) {
        throw new Error('Text-to-Speech wordt niet ondersteund in deze browser');
      }

      const synth = window.speechSynthesis;

      // Stop if already speaking this one
      if (currentId === id && synth.speaking) {
        synth.cancel();
        setIsSpeaking(false);
        setCurrentId(null);
        return;
      }

      // Stop any current speech
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // FORCE Dutch voice
      const dutchVoice = await getDutchVoice();
      if (dutchVoice) {
        utterance.voice = dutchVoice;
      }

      // ALWAYS set language to Dutch, regardless of browser language
      utterance.lang = 'nl-NL';
      utterance.rate = options.rate || 0.85;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;

      return new Promise<void>((resolve, reject) => {
        utterance.onstart = () => {
          setIsSpeaking(true);
          setCurrentId(id);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          setCurrentId(null);
          resolve();
        };

        utterance.onerror = (event) => {
          setIsSpeaking(false);
          setCurrentId(null);
          console.error('TTS error:', event);
          reject(new Error('Fout bij afspelen van audio'));
        };

        synth.speak(utterance);
      });
    },
    [currentId, isSupported, getDutchVoice]
  );

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentId(null);
    }
  }, [isSupported]);

  return {
    speak,
    stop,
    isSpeaking,
    currentId,
    isSupported,
  };
};
