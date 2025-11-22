import type { Excuus } from '../../types';
import { ExcuusItem } from './ExcuusItem';

interface ExcuusListProps {
  excuses: Excuus[];
  onDelete: (id: string) => void;
}

export const ExcuusList = ({ excuses, onDelete }: ExcuusListProps) => {
  if (excuses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-amber-300 text-lg">
          Nog geen excuses gegenereerd. Vul een situatie in hierboven!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {excuses.map((excuus) => (
        <ExcuusItem key={excuus.id} excuus={excuus} onDelete={onDelete} />
      ))}
    </div>
  );
};
