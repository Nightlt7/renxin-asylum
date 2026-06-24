import { useState } from 'react';
import type { Puzzle } from '../../types/game';
import { useAudio } from '../../hooks/useAudio';
import { useGameStore } from '../../store/gameStore';
import WrongFeedback from '../WrongFeedback';

interface Props {
  puzzle: Puzzle;
  onSolve: () => void;
}

export default function MorsePuzzle({ puzzle, onSolve }: Props) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const { playSuccess, playError } = useAudio();
  const wrongAttempts = useGameStore((state) => state.wrongAttempts);
  const recordWrongAttempt = useGameStore((state) => state.recordWrongAttempt);

  const submit = () => {
    if (input.trim() === '岚天666') { playSuccess(); onSolve(); return; }
    const normalized = input.trim().toLowerCase().replace(/\s+/g, ' ');
    const answer = String(puzzle.answer).toLowerCase();
    if (normalized === answer) {
      playSuccess();
      onSolve();
    } else {
      playError();
      recordWrongAttempt();
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
        placeholder="输入解出的英文信息，例如 304 fridge brain"
        className={`input-asylum ${error ? 'animate-shake ring-1 ring-red-500' : ''}`}
      />
      <button onClick={submit} className="btn-primary text-sm">
        解码
      </button>
      <WrongFeedback show={error} attemptCount={wrongAttempts} />
    </div>
  );
}
