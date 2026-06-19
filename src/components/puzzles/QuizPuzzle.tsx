import { useState } from 'react';
import type { Puzzle } from '../../types/game';
import { useAudio } from '../../hooks/useAudio';
import { useGameStore } from '../../store/gameStore';
import WrongFeedback from '../WrongFeedback';

interface Props {
  puzzle: Puzzle;
  onSolve: () => void;
}

export default function QuizPuzzle({ puzzle, onSolve }: Props) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const { playSuccess, playError, playHeartbeat } = useAudio();
  const wrongAttempts = useGameStore((state) => state.wrongAttempts);
  const recordWrongAttempt = useGameStore((state) => state.recordWrongAttempt);

  const submit = () => {
    const normalized = input.trim().replace(/\s+/g, '');
    const answer = String(puzzle.answer).replace(/\s+/g, '');
    if (normalized === answer || normalized.includes(answer)) {
      playSuccess();
      onSolve();
    } else {
      playError();
      playHeartbeat();
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
        placeholder="输入答案"
        className={`w-full rounded border bg-asylum-900 px-3 py-2 text-sm outline-none transition ${
          error ? 'animate-shake border-red-500' : 'border-asylum-600 focus:border-asylum-500'
        }`}
      />
      <button
        onClick={submit}
        className="rounded bg-asylum-accent px-5 py-2 text-sm font-medium text-white hover:bg-red-800"
      >
        提交
      </button>
      <WrongFeedback show={error} attemptCount={wrongAttempts} />
    </div>
  );
}
