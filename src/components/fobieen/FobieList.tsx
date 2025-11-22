import type { Fobie } from '../../types';
import { FobieItem } from './FobieItem';

interface FobieListProps {
  fobieen: Fobie[];
  onDelete: (id: string) => void;
}

export const FobieList = ({ fobieen, onDelete }: FobieListProps) => {
  if (fobieen.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-teal-300 text-lg">
          Nog geen fobieën gegenereerd. Klik op de knop hierboven om te beginnen!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {fobieen.map((fobie) => (
        <FobieItem key={fobie.id} fobie={fobie} onDelete={onDelete} />
      ))}
    </div>
  );
};
