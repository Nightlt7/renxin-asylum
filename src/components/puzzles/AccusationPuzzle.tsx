import { useState } from 'react';
import type { Puzzle } from '../../types/game';
import { useAudio } from '../../hooks/useAudio';
import { useGameStore } from '../../store/gameStore';
import CharacterAvatar from '../CharacterAvatar';
import WrongFeedback from '../WrongFeedback';

interface Props {
  puzzle: Puzzle;
  onSolve: (result?: string) => void;
}

export default function AccusationPuzzle({ puzzle, onSolve }: Props) {
  const suspects = puzzle.options?.from || [];
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [resolving, setResolving] = useState(false);
  const { playClick, playSuccess, playError, playHeartbeat } = useAudio();
  const wrongAttempts = useGameStore((state) => state.wrongAttempts);
  const recordWrongAttempt = useGameStore((state) => state.recordWrongAttempt);

  const submit = () => {
    if (!selected || resolving) return;
    if (selected === puzzle.answer) {
      playSuccess();
      onSolve(selected);
    } else {
      playError();
      playHeartbeat();
      recordWrongAttempt();
      setShowFeedback(true);
      setResolving(true);
      // 错误指控：先给剧情反馈，再进入坏结局
      setTimeout(() => {
        onSolve(selected);
      }, 1600);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {suspects.map((s) => (
          <button
            key={s}
            disabled={resolving}
            onClick={() => { playClick(); setSelected(s); }}
            className={`flex flex-col items-center justify-center gap-2 rounded border px-3 py-4 text-sm transition ${
              selected === s
                ? 'border-asylum-accent bg-asylum-accent/20 text-white'
                : 'border-asylum-600 bg-asylum-800 hover:bg-asylum-700'
            } ${resolving ? 'opacity-50' : ''}`}
          >
            <CharacterAvatar name={s} size="lg" />
            {s}
          </button>
        ))}
      </div>
      <button
        onClick={submit}
        disabled={!selected || resolving}
        className="rounded bg-asylum-accent px-6 py-2 text-sm font-medium text-white hover:bg-red-800 disabled:opacity-50"
      >
        提交指控
      </button>
      <WrongFeedback show={showFeedback} attemptCount={wrongAttempts} />
    </div>
  );
}
