import type { Haiku } from '../../types';
import { useTTS } from '../../hooks/useTTS';
import { useHaikuShare } from '../../hooks/useHaikuShare';
import { useState } from 'react';

interface HaikuItemProps {
  haiku: Haiku;
  onDelete: (id: string) => void;
}

export const HaikuItem = ({ haiku, onDelete }: HaikuItemProps) => {
  const { speak, currentId, isSupported: ttsSupported } = useTTS();
  const { share, isSupported: shareSupported } = useHaikuShare();
  const [notification, setNotification] = useState('');

  const isPlaying = currentId === haiku.id;

  const handlePlay = async () => {
    try {
      await speak(haiku.text, haiku.id);
    } catch (error) {
      console.error('TTS error:', error);
      showNotification('❌ Audio afspelen mislukt');
    }
  };

  const handleShare = async () => {
    const result = await share(haiku);
    if (result.success) {
      if (result.method === 'copy') {
        showNotification('📋 Gekopieerd naar klembord');
      }
    } else {
      showNotification('❌ Delen mislukt');
    }
  };

  const handleDelete = () => {
    onDelete(haiku.id);
    showNotification('🗑️ Verwijderd');
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
    <div className="bg-gray-50 border border-gray-200 rounded-sm p-8 shadow-sm hover:shadow-md transition-shadow duration-300 relative">
      <div className="mb-6">
        {haiku.extraHopeloosheid && (
          <span className="inline-block text-xs px-2 py-1 mb-4 bg-gray-200 text-gray-600 rounded-sm font-mono uppercase tracking-wider">
            🍂 Extra Hopeloosheid
          </span>
        )}
        <div className="text-gray-700 text-lg leading-loose font-serif italic whitespace-pre-line text-center">
          {haiku.text}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <span className="text-gray-400 text-xs font-mono">{formatDate(haiku.created_at)}</span>
        <div className="flex gap-2">
          <button
            onClick={handlePlay}
            disabled={!ttsSupported}
            className={`
              px-3 py-2 text-sm rounded-sm border border-gray-300
              bg-white hover:bg-gray-100 hover:border-gray-400
              transition-all duration-200 hover:scale-105 active:scale-95
              ${!ttsSupported ? 'opacity-40 cursor-not-allowed' : ''}
            `}
            title={ttsSupported ? 'Speel af' : 'TTS niet ondersteund'}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button
            onClick={handleShare}
            className="px-3 py-2 text-sm rounded-sm border border-gray-300 bg-white hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 hover:scale-105 active:scale-95"
            title={shareSupported ? 'Delen' : 'Kopieer'}
          >
            {shareSupported ? '📤' : '📋'}
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-2 text-sm rounded-sm border border-gray-300 bg-white hover:bg-red-50 hover:border-red-300 transition-all duration-200 hover:scale-105 active:scale-95"
            title="Verwijder"
          >
            🗑️
          </button>
        </div>
      </div>

      {notification && (
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white px-4 py-2 rounded-sm font-mono text-xs whitespace-nowrap animate-slide-in z-10">
          {notification}
        </div>
      )}
    </div>
  );
};
