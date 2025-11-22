import type { Draaiboek } from '../../types';
import { DraaiboekItem } from './DraaiboekItem';

interface DraaiboekListProps {
  draaiboeken: Draaiboek[];
  onDelete: (id: string) => void;
}

export const DraaiboekList = ({ draaiboeken, onDelete }: DraaiboekListProps) => {
  if (draaiboeken.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 text-lg font-mono">
          Nog geen draaiboeken gegenereerd. Vul een taak in hierboven!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {draaiboeken.map((draaiboek) => (
        <DraaiboekItem key={draaiboek.id} draaiboek={draaiboek} onDelete={onDelete} />
      ))}
    </div>
  );
};
