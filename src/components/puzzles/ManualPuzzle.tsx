import type { Puzzle } from '../../types/game';

interface Props {
  puzzle: Puzzle;
  onSolve: () => void;
}

export default function ManualPuzzle({ onSolve }: Props) {
  return (
    <button
      onClick={onSolve}
      className="btn-primary text-sm"
    >
      完成整理
    </button>
  );
}
