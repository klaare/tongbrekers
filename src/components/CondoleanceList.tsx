import type { Condoleance } from '../types';
import { CondoleanceItem } from './CondoleanceItem';

interface CondoleanceListProps {
  condoleances: Condoleance[];
}

export const CondoleanceList = ({ condoleances }: CondoleanceListProps) => {
  if (condoleances.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-ink-faded rounded-lg">
        <p className="text-ink-light italic text-lg">
          Nog geen condoleances gegenereerd. Klik op de knop hierboven! 👆
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {condoleances.map((condoleance) => (
        <CondoleanceItem key={condoleance.id} condoleance={condoleance} />
      ))}
    </div>
  );
};
