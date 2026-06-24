import { useState } from 'react';
import { CheckCircle, Circle, ChevronRight } from 'lucide-react';
import type { Puzzle } from '../../types/game';
import { puzzleById } from '../../data/puzzles';
import PuzzleRenderer from './PuzzleRenderer';
import SolutionNotes from '../SolutionNotes';

interface Props {
  puzzle: Puzzle;
  onSolve: () => void;
}

export default function CompoundPuzzle({ puzzle, onSolve }: Props) {
  const ids = puzzle.subPuzzleIds || [];
  const [index, setIndex] = useState(0);
  const [showNotesFor, setShowNotesFor] = useState<number | null>(null);

  const current = puzzleById(ids[index]);
  if (!current) return null;

  const handleSubSolve = () => {
    if (index < ids.length - 1) {
      setShowNotesFor(index);
    } else {
      onSolve();
    }
  };

  const handleContinue = () => {
    setShowNotesFor(null);
    setIndex(index + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-asylum-muted">
        {ids.map((id, idx) => (
          <div key={id} className="flex items-center gap-1">
            {idx <= index ? (
              <CheckCircle size={14} className="text-green-400" />
            ) : (
              <Circle size={14} />
            )}
            <span className={idx === index ? 'text-asylum-paper' : ''}>{idx + 1}</span>
          </div>
        ))}
      </div>

      {showNotesFor === index ? (
        <div className="rounded border border-green-700/30 bg-green-900/10 p-4">
          <div className="mb-2 text-sm font-medium text-green-100">
            步骤 {index + 1} / {ids.length} 完成：{current.title}
          </div>
          <SolutionNotes notes={current.solutionNotes} />
          <button
            onClick={handleContinue}
            className="btn-primary mt-4 text-sm"
          >
            下一步
            <ChevronRight size={16} />
          </button>
        </div>
      ) : (
        <div className="rounded border border-asylum-600 bg-asylum-900/30 p-4">
          <div className="mb-2 text-sm font-medium text-asylum-paper">
            步骤 {index + 1} / {ids.length}：{current.title}
          </div>
          <PuzzleRenderer puzzle={current} onSolve={handleSubSolve} />
        </div>
      )}
    </div>
  );
}
