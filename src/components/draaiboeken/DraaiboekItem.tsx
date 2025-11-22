import type { Draaiboek } from '../../types';
import { useTTS } from '../../hooks/useTTS';
import { useDraaiboekShare } from '../../hooks/useDraaiboekShare';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface DraaiboekItemProps {
  draaiboek: Draaiboek;
  onDelete: (id: string) => void;
}

export const DraaiboekItem = ({ draaiboek, onDelete }: DraaiboekItemProps) => {
  const { speak, currentId, isSupported: ttsSupported } = useTTS();
  const { share, isSupported: shareSupported } = useDraaiboekShare();
  const [notification, setNotification] = useState('');

  const isPlaying = currentId === draaiboek.id;

  const handlePlay = async () => {
    try {
      await speak(draaiboek.draaiboek, draaiboek.id);
    } catch (error) {
      console.error('TTS error:', error);
      showNotification('❌ Audio afspelen mislukt');
    }
  };

  const handleShare = async () => {
    const result = await share(draaiboek);
    if (result.success) {
      if (result.method === 'copy') {
        showNotification('📋 Gekopieerd naar klembord!');
      }
    } else {
      showNotification('❌ Delen mislukt');
    }
  };

  const handleDelete = () => {
    onDelete(draaiboek.id);
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

  const moeilijkheidsgraadLabel = {
    'lichte-mislukking': { label: '⚠️ Lichte Mislukking', color: 'yellow' },
    'gure-ramp': { label: '🔶 Gure Ramp', color: 'orange' },
    'volledige-catastrofe': { label: '🔴 Volledige Catastrofe', color: 'red' }
  };

  const graadInfo = moeilijkheidsgraadLabel[draaiboek.moeilijkheidsgraad];

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border-2 border-slate-600 rounded-lg p-6 shadow-2xl hover:border-red-500/50 hover:-translate-y-1 transition-all duration-300 animate-slide-in relative">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-slate-100 uppercase tracking-wide">
            💣 {draaiboek.taak}
          </h3>
          <span className={`text-xs px-3 py-1 rounded border font-mono uppercase tracking-wider
            ${graadInfo.color === 'yellow' ? 'bg-yellow-900/50 text-yellow-200 border-yellow-600' : ''}
            ${graadInfo.color === 'orange' ? 'bg-orange-900/50 text-orange-200 border-orange-600' : ''}
            ${graadInfo.color === 'red' ? 'bg-red-900/50 text-red-200 border-red-600' : ''}
          `}>
            {graadInfo.label}
          </span>
        </div>
        <div className="text-slate-300 text-sm prose prose-sm prose-invert max-w-none
          prose-strong:text-slate-100 prose-strong:font-bold
          prose-p:my-4 prose-p:text-slate-300 prose-p:leading-relaxed
          [&>p]:mb-4 [&>p]:block">
          <ReactMarkdown>{draaiboek.draaiboek}</ReactMarkdown>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
        <span className="text-slate-500 text-xs font-mono">{formatDate(draaiboek.created_at)}</span>
        <div className="flex gap-2">
          <button
            onClick={handlePlay}
            disabled={!ttsSupported}
            className={`
              px-3 py-2 text-lg rounded border-2 border-slate-600
              bg-slate-700/50 hover:bg-slate-600/70 hover:border-red-500
              transition-all duration-200 hover:scale-110 active:scale-95
              ${!ttsSupported ? 'opacity-40 cursor-not-allowed' : ''}
            `}
            title={ttsSupported ? 'Speel af' : 'TTS niet ondersteund'}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button
            onClick={handleShare}
            className="px-3 py-2 text-lg rounded border-2 border-slate-600 bg-slate-700/50 hover:bg-slate-600/70 hover:border-red-500 transition-all duration-200 hover:scale-110 active:scale-95"
            title={shareSupported ? 'Delen' : 'Kopieer'}
          >
            {shareSupported ? '📤' : '📋'}
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-2 text-lg rounded border-2 border-slate-600 bg-slate-700/50 hover:bg-red-700/70 hover:border-red-500 transition-all duration-200 hover:scale-110 active:scale-95"
            title="Verwijder"
          >
            🗑️
          </button>
        </div>
      </div>

      {notification && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded font-semibold text-sm whitespace-nowrap animate-slide-in z-10">
          {notification}
        </div>
      )}
    </div>
  );
};
