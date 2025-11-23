import { useState, useEffect } from 'react';
import type { Haiku } from '../types';
import { createHaikuShareUrl } from '../utils/haikuUrl';

export function useHaikuShare() {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(!!navigator.share);
  }, []);

  const share = async (haiku: Haiku): Promise<{ success: boolean; method: 'share' | 'copy' }> => {
    const url = createHaikuShareUrl(haiku);
    const shareData = {
      title: 'Hopeloze Haiku',
      text: haiku.text,
      url: url
    };

    if (isSupported) {
      try {
        await navigator.share(shareData);
        return { success: true, method: 'share' };
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return { success: false, method: 'share' };
        }
        console.error('Share failed, falling back to clipboard:', error);
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      return { success: true, method: 'copy' };
    } catch (error) {
      console.error('Clipboard write failed:', error);
      return { success: false, method: 'copy' };
    }
  };

  return { share, isSupported };
}
