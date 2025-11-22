import { useCallback } from 'react';
import type { Draaiboek } from '../types';
import { createDraaiboekShareUrl } from '../utils/draaiboekUrl';

export const useDraaiboekShare = () => {
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
    async (draaiboek: Draaiboek): Promise<{ success: boolean; method: 'share' | 'copy' }> => {
      const shareUrl = createDraaiboekShareUrl(draaiboek);
      const shareText = `${draaiboek.taak}\n\n${draaiboek.draaiboek}`;

      if (isSupported) {
        try {
          await navigator.share({
            title: `💣 Destructief Draaiboek: ${draaiboek.taak}`,
            text: shareText,
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

      const fullShareText = `${shareText}\n\n${shareUrl}`;
      const success = await copyToClipboard(fullShareText);
      return { success, method: 'copy' };
    },
    [isSupported]
  );

  return {
    share,
    isSupported,
  };
};
