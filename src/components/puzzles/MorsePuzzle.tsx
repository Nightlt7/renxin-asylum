import { useState } from 'react';
import type { Puzzle } from '../../types/game';
import { useAudio } from '../../hooks/useAudio';

interface Props {
  puzzle: Puzzle;
  onSolve: () => void;
}

export default function MorsePuzzle({ puzzle, onSolve }: Props) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const { playSuccess, playError } = useAudio();

  const submit = () => {
    const normalized = input.trim().toLowerCase().replace(/\s+/g, ' ');
    const answer = String(puzzle.answer).toLowerCase();
    if (normalized === answer) {
      playSuccess();
      onSolve();
    } else {
      playError();
      setError(true);
      setTimeout(() => setError(false), 800);
    }
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder="输入解出的英文信息，例如 123 fridge brain"
        className={`w-full rounded border bg-asylum-900 px-3 py-2 text-sm outline-none transition ${
          error ? 'animate-shake border-red-500' : 'border-asylum-600 focus:border-asylum-500'
        }`}
      />
      <button
        onClick={submit}
        className="rounded bg-asylum-accent px-5 py-2 text-sm font-medium text-white hover:bg-red-800"
      >
        解码
      </button>
      {error && <div className="text-sm text-red-400">解码结果不正确。</div>}
    </div>
  );
}
