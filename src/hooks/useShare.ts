import { useCallback } from 'react';
import type { Condoleance } from '../types';
import { createShareUrl } from '../utils/url';

export const useShare = () => {
  const isSupported = 'share' in navigator;

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);

      return successful;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  };

  const share = useCallback(
    async (condoleance: Condoleance): Promise<{ success: boolean; method: 'share' | 'copy' }> => {
      // Create shareable URL with condoleance encoded
      const shareUrl = createShareUrl(condoleance);

      if (isSupported) {
        try {
          await navigator.share({
            title: '🕊️ Curieuze Condoleance',
            text: condoleance.text,
            url: shareUrl,
          });
          return { success: true, method: 'share' };
        } catch (error: any) {
          if (error.name === 'AbortError') {
            return { success: false, method: 'share' };
          }
          console.error('Error sharing:', error);
        }
      }

      // Fallback to clipboard - copy the URL with the condoleance
      const shareText = `${condoleance.text}\n\n${shareUrl}`;
      const success = await copyToClipboard(shareText);
      return { success, method: 'copy' };
    },
    [isSupported]
  );

  return {
    share,
    isSupported,
  };
};
