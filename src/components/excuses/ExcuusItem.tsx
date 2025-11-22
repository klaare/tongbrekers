import type { Excuus } from '../../types';
import { useTTS } from '../../hooks/useTTS';
import { useExcuusShare } from '../../hooks/useExcuusShare';
import { useState } from 'react';

interface ExcuusItemProps {
  excuus: Excuus;
  onDelete: (id: string) => void;
}

export const ExcuusItem = ({ excuus, onDelete }: ExcuusItemProps) => {
  const { speak, currentId, isSupported: ttsSupported } = useTTS();
  const { share, isSupported: shareSupported } = useExcuusShare();
  const [notification, setNotification] = useState('');

  const isPlaying = currentId === excuus.id;

  const handlePlay = async () => {
    try {
      await speak(excuus.excuus, excuus.id);
    } catch (error) {
      console.error('TTS error:', error);
      showNotification('❌ Audio afspelen mislukt');
    }
  };

  const handleShare = async () => {
    const result = await share(excuus);
    if (result.success) {
      if (result.method === 'copy') {
        showNotification('📋 Gekopieerd naar klembord!');
      }
    } else {
      showNotification('❌ Delen mislukt');
    }
  };

  const handleDelete = () => {
    onDelete(excuus.id);
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

  const lengteLabel = {
    kort: '📏 Kort',
    normaal: '📋 Normaal',
    episch: '📜 Episch'
  };

  return (
    <div className="bg-amber-900/30 backdrop-blur-sm border-2 border-amber-700 rounded-2xl p-6 shadow-2xl hover:border-amber-500 hover:shadow-amber-500/30 hover:-translate-y-1 transition-all duration-300 animate-slide-in relative">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-amber-100">
            🙏 {excuus.situatie}
          </h3>
          <span className="text-xs px-3 py-1 bg-amber-800/50 text-amber-200 rounded-full border border-amber-600">
            {lengteLabel[excuus.lengte]}
          </span>
        </div>
        <p className="text-amber-50 text-base leading-relaxed italic">
          {excuus.excuus}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-amber-500 text-sm">{formatDate(excuus.created_at)}</span>
        <div className="flex gap-2">
          <button
            onClick={handlePlay}
            disabled={!ttsSupported}
            className={`
              px-4 py-2 text-2xl rounded-lg border-2 border-amber-700
              bg-amber-800/50 hover:bg-amber-700/70 hover:border-amber-500
              transition-all duration-200 hover:scale-110 active:scale-95
              ${!ttsSupported ? 'opacity-40 cursor-not-allowed' : ''}
            `}
            title={ttsSupported ? 'Speel af' : 'TTS niet ondersteund'}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button
            onClick={handleShare}
            className="px-4 py-2 text-2xl rounded-lg border-2 border-amber-700 bg-amber-800/50 hover:bg-amber-700/70 hover:border-amber-500 transition-all duration-200 hover:scale-110 active:scale-95"
            title={shareSupported ? 'Delen' : 'Kopieer'}
          >
            {shareSupported ? '📤' : '📋'}
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-2xl rounded-lg border-2 border-amber-700 bg-amber-800/50 hover:bg-red-700/70 hover:border-red-500 transition-all duration-200 hover:scale-110 active:scale-95"
            title="Verwijder"
          >
            🗑️
          </button>
        </div>
      </div>

      {notification && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-amber-500 text-black px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap animate-slide-in z-10">
          {notification}
        </div>
      )}
    </div>
  );
};
