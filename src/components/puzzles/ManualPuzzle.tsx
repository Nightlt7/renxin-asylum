import type { Puzzle } from '../../types/game';

interface Props {
  puzzle: Puzzle;
  onSolve: () => void;
}

export default function ManualPuzzle({ onSolve }: Props) {
  return (
    <button
      onClick={onSolve}
      className="rounded bg-asylum-accent px-6 py-2 text-sm font-medium text-white hover:bg-red-800"
    >
      完成整理
    </button>
  );
}
