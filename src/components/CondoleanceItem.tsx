import type { Condoleance } from '../types';
import { useTTS } from '../hooks/useTTS';
import { useShare } from '../hooks/useShare';
import { useState } from 'react';

interface CondoleanceItemProps {
  condoleance: Condoleance;
}

export const CondoleanceItem = ({ condoleance }: CondoleanceItemProps) => {
  const { speak, currentId, isSupported: ttsSupported } = useTTS();
  const { share, isSupported: shareSupported } = useShare();
  const [notification, setNotification] = useState('');

  const isPlaying = currentId === condoleance.id;

  const handlePlay = async () => {
    try {
      await speak(condoleance.text, condoleance.id);
    } catch (error) {
      console.error('TTS error:', error);
      showNotification('❌ Audio afspelen mislukt');
    }
  };

  const handleShare = async () => {
    const result = await share(condoleance);
    if (result.success) {
      if (result.method === 'copy') {
        showNotification('📋 Gekopieerd naar klembord!');
      }
    } else {
      showNotification('❌ Delen mislukt');
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Zojuist';
    if (minutes < 60) return `${minutes}m geleden`;
    if (hours < 24) return `${hours}u geleden`;
    if (days < 7) return `${days}d geleden`;

    return date.toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="bg-paper-aged border-2 border-ink rounded-lg p-6 shadow-lg hover:shadow-xl hover:border-accent transition-all duration-300 animate-slide-in relative">
      <p className="text-ink text-base leading-relaxed mb-4 font-serif italic">
        {condoleance.text}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-ink-faded text-xs uppercase tracking-wide">
          {formatDate(condoleance.created_at)}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handlePlay}
            disabled={!ttsSupported}
            className={`
              px-3 py-2 text-xl rounded border-2 border-ink
              bg-paper hover:bg-paper-dark hover:border-accent-border
              transition-all duration-200 hover:scale-110 active:scale-95
              ${!ttsSupported ? 'opacity-40 cursor-not-allowed' : ''}
            `}
            title={ttsSupported ? 'Speel af' : 'TTS niet ondersteund'}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button
            onClick={handleShare}
            className="px-3 py-2 text-xl rounded border-2 border-ink bg-paper hover:bg-paper-dark hover:border-accent-border transition-all duration-200 hover:scale-110 active:scale-95"
            title={shareSupported ? 'Delen' : 'Kopieer'}
          >
            {shareSupported ? '📤' : '📋'}
          </button>
        </div>
      </div>

      {notification && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-accent text-paper px-4 py-2 rounded font-semibold text-sm whitespace-nowrap animate-slide-in z-10">
          {notification}
        </div>
      )}
    </div>
  );
};
