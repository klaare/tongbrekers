import type { Fobie } from '../../types';
import { useTTS } from '../../hooks/useTTS';
import { useFobieShare } from '../../hooks/useFobieShare';
import { useState } from 'react';

interface FobieItemProps {
  fobie: Fobie;
  onDelete: (id: string) => void;
}

export const FobieItem = ({ fobie, onDelete }: FobieItemProps) => {
  const { speak, currentId, isSupported: ttsSupported } = useTTS();
  const { share, isSupported: shareSupported } = useFobieShare();
  const [notification, setNotification] = useState('');

  const isPlaying = currentId === fobie.id;

  const handlePlay = async () => {
    try {
      const fullText = `${fobie.naam}. ${fobie.beschrijving}`;
      await speak(fullText, fobie.id);
    } catch (error) {
      console.error('TTS error:', error);
      showNotification('❌ Audio afspelen mislukt');
    }
  };

  const handleShare = async () => {
    const result = await share(fobie);
    if (result.success) {
      if (result.method === 'copy') {
        showNotification('📋 Gekopieerd naar klembord!');
      }
    } else {
      showNotification('❌ Delen mislukt');
    }
  };

  const handleDelete = () => {
    onDelete(fobie.id);
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
    <div className="bg-teal-900/40 backdrop-blur-sm border-2 border-teal-700 rounded-2xl p-6 shadow-2xl hover:border-teal-500 hover:shadow-teal-500/30 hover:-translate-y-1 transition-all duration-300 animate-slide-in relative">
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-teal-100 mb-3">
          😰 {fobie.naam}
        </h3>
        <p className="text-teal-200 text-base leading-relaxed">
          {fobie.beschrijving}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-teal-500 text-sm">{formatDate(fobie.created_at)}</span>
        <div className="flex gap-2">
          <button
            onClick={handlePlay}
            disabled={!ttsSupported}
            className={`
              px-4 py-2 text-2xl rounded-lg border-2 border-teal-700
              bg-teal-800/50 hover:bg-teal-700/70 hover:border-teal-500
              transition-all duration-200 hover:scale-110 active:scale-95
              ${!ttsSupported ? 'opacity-40 cursor-not-allowed' : ''}
            `}
            title={ttsSupported ? 'Speel af' : 'TTS niet ondersteund'}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button
            onClick={handleShare}
            className="px-4 py-2 text-2xl rounded-lg border-2 border-teal-700 bg-teal-800/50 hover:bg-teal-700/70 hover:border-teal-500 transition-all duration-200 hover:scale-110 active:scale-95"
            title={shareSupported ? 'Delen' : 'Kopieer'}
          >
            {shareSupported ? '📤' : '📋'}
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-2xl rounded-lg border-2 border-teal-700 bg-teal-800/50 hover:bg-red-700/70 hover:border-red-500 transition-all duration-200 hover:scale-110 active:scale-95"
            title="Verwijder"
          >
            🗑️
          </button>
        </div>
      </div>

      {notification && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-teal-500 text-black px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap animate-slide-in z-10">
          {notification}
        </div>
      )}
    </div>
  );
};
