import { useState, useMemo } from 'react';
import type { Puzzle } from '../../types/game';
import { useAudio } from '../../hooks/useAudio';
import { useGameStore } from '../../store/gameStore';
import CharacterAvatar from '../CharacterAvatar';
import WrongFeedback from '../WrongFeedback';

interface Props {
  puzzle: Puzzle;
  onSolve: () => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function ConnectPuzzle({ puzzle, onSolve }: Props) {
  const answer = puzzle.answer as Record<string, string>;
  const patients = puzzle.options?.from || [];
  const illnesses = puzzle.options?.to || [];
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [error, setError] = useState(false);
  const { playSuccess, playError, playHeartbeat } = useAudio();
  const wrongAttempts = useGameStore((state) => state.wrongAttempts);
  const recordWrongAttempt = useGameStore((state) => state.recordWrongAttempt);

  const shuffledPatients = useMemo(() => shuffleArray(patients), [patients]);
  const shuffledIllnesses = useMemo(() => shuffleArray(illnesses), [illnesses]);

  const submit = () => {
    const allCorrect = patients.every((p) => mapping[p] === answer[p]);
    if (allCorrect) {
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
    <div className={`space-y-3 ${error ? 'animate-shake' : ''}`}>
      <div className="space-y-2">
        {shuffledPatients.map((p) => (
          <div key={p} className="flex items-center gap-3">
            <CharacterAvatar name={p} size="md" showName />
            <select
              value={mapping[p] || ''}
              onChange={(e) => setMapping({ ...mapping, [p]: e.target.value })}
              className="flex-1 rounded border border-asylum-600 bg-asylum-900 px-2 py-1 text-sm outline-none"
            >
              <option value="">请选择病症</option>
              {shuffledIllnesses.map((ill) => (
                <option key={ill} value={ill}>{ill}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <button
        onClick={submit}
        className="rounded bg-asylum-accent px-5 py-2 text-sm font-medium text-white hover:bg-red-800"
      >
        提交连线
      </button>
      <WrongFeedback show={error} attemptCount={wrongAttempts} />
    </div>
  );
}
