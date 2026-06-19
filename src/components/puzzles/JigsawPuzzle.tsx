import { useState } from 'react';
import { Shuffle } from 'lucide-react';
import type { Puzzle } from '../../types/game';
import { useAudio } from '../../hooks/useAudio';

interface Props {
  puzzle: Puzzle;
  onSolve: () => void;
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function JigsawPuzzle({ puzzle, onSolve }: Props) {
  const image = puzzle.image || '';
  const rows = puzzle.grid?.rows || 3;
  const cols = puzzle.grid?.cols || 3;
  const total = rows * cols;
  const [pieces, setPieces] = useState(() => shuffleArray(Array.from({ length: total }, (_, i) => i)));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { playSuccess, playClick } = useAudio();

  const isSolved = pieces.every((val, idx) => val === idx);

  const handleClick = (idx: number) => {
    playClick();
    if (selectedIndex === null) {
      setSelectedIndex(idx);
      return;
    }
    if (selectedIndex === idx) {
      setSelectedIndex(null);
      return;
    }
    const next = [...pieces];
    [next[selectedIndex], next[idx]] = [next[idx], next[selectedIndex]];
    setPieces(next);
    setSelectedIndex(null);

    const solved = next.every((val, i) => val === i);
    if (solved) {
      setTimeout(() => { playSuccess(); onSolve(); }, 300);
    }
  };

  const reset = () => {
    playClick();
    setPieces(shuffleArray(Array.from({ length: total }, (_, i) => i)));
    setSelectedIndex(null);
  };

  return (
    <div className="space-y-3">
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, aspectRatio: `${cols}/${rows}` }}
      >
        {pieces.map((pieceIdx, slotIdx) => {
          const originalRow = Math.floor(pieceIdx / cols);
          const originalCol = pieceIdx % cols;
          return (
            <button
              key={slotIdx}
              onClick={() => handleClick(slotIdx)}
              className={`relative overflow-hidden rounded border transition ${
                selectedIndex === slotIdx
                  ? 'border-asylum-accent ring-2 ring-asylum-accent/50'
                  : 'border-asylum-600 hover:border-asylum-500'
              }`}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: `${cols * 100}% ${rows * 100}%`,
                backgroundPosition: `${(originalCol / (cols - 1)) * 100}% ${(originalRow / (rows - 1)) * 100}%`,
              }}
            />
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-asylum-muted">
          {isSolved ? '拼图已还原！' : '点击两块碎片交换位置'}
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-1 rounded bg-asylum-700 px-2 py-1 text-xs hover:bg-asylum-600"
        >
          <Shuffle size={14} /> 重洗
        </button>
      </div>
    </div>
  );
}
