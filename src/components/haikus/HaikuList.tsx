import type { Haiku } from '../../types';
import { HaikuItem } from './HaikuItem';

interface HaikuListProps {
  haikus: Haiku[];
  onDelete: (id: string) => void;
}

export const HaikuList = ({ haikus, onDelete }: HaikuListProps) => {
  if (haikus.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 font-serif italic">Nog geen haiku's gegenereerd...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {haikus.map((haiku) => (
        <HaikuItem key={haiku.id} haiku={haiku} onDelete={onDelete} />
      ))}
    </div>
  );
};
