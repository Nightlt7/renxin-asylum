import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
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
  const { playSuccess, playError, playHeartbeat, playClick } = useAudio();
  const wrongAttempts = useGameStore((state) => state.wrongAttempts);
  const recordWrongAttempt = useGameStore((state) => state.recordWrongAttempt);

  const shuffledPatients = useMemo(() => shuffleArray(patients), [patients]);
  const shuffledIllnesses = useMemo(() => shuffleArray(illnesses), [illnesses]);

  // 还未被分配的病症
  const availableIllnesses = shuffledIllnesses.filter(
    (ill) => !Object.values(mapping).includes(ill)
  );

  const handleAssign = (patient: string, illness: string) => {
    playClick();
    // 如果该病人已有分配，先移除旧的
    const next = { ...mapping };
    // 移除旧值（释放病症）
    const oldIllness = next[patient];
    // 如果新病症被其他病人占用，也清除
    Object.keys(next).forEach((p) => {
      if (next[p] === illness) delete next[p];
      if (p === patient && oldIllness) delete next[p];
    });
    next[patient] = illness;
    setMapping(next);
  };

  const handleRemove = (patient: string) => {
    playClick();
    const next = { ...mapping };
    delete next[patient];
    setMapping(next);
  };

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

  const allAssigned = patients.every((p) => mapping[p]);

  return (
    <div className={`space-y-4 ${error ? 'animate-shake' : ''}`}>
      {/* 病人列表 + 已分配病症 */}
      <div className="space-y-2">
        {shuffledPatients.map((p) => (
          <div
            key={p}
            className="card-asylum flex items-center gap-3 p-2.5"
          >
            <CharacterAvatar name={p} size="sm" showName />
            <div className="flex-1" />
            {/* 已分配的病症标签 或 空位 */}
            {mapping[p] ? (
              <div className="flex items-center gap-1.5 rounded-full bg-asylum-accent/15 border border-asylum-accent/25 px-3 py-1.5 text-sm text-asylum-paper">
                <span>{mapping[p]}</span>
                <button
                  onClick={() => handleRemove(p)}
                  className="ml-1 rounded-full p-0.5 text-asylum-muted hover:bg-asylum-accent/20 hover:text-asylum-paper"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div className="rounded-full border border-dashed border-asylum-600/50 px-3 py-1.5 text-xs text-asylum-muted/50">
                拖入病症
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 可拖拽的病症卡片 */}
      <div className="rounded-lg border border-asylum-600/40 bg-asylum-800/30 p-3">
        <div className="mb-2 text-xs text-asylum-muted">可选病症（点击添加到病人）：</div>
        <div className="flex flex-wrap gap-2">
          {availableIllnesses.length > 0 ? (
            availableIllnesses.map((ill) => (
              <motion.button
                key={ill}
                className="rounded-full border border-asylum-600 bg-asylum-800/80 px-3 py-1.5 text-sm text-asylum-paper/80 transition-all hover:border-asylum-accent/40 hover:bg-asylum-700 hover:text-asylum-paper"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  // 找到第一个还没有分配的病人
                  const firstUnassigned = shuffledPatients.find((p) => !mapping[p]);
                  if (firstUnassigned) {
                    handleAssign(firstUnassigned, ill);
                  }
                }}
              >
                {ill}
              </motion.button>
            ))
          ) : (
            <span className="text-xs text-asylum-muted/50">所有病症已分配</span>
          )}
        </div>
      </div>

      {/* 提示：点击病症 → 添加到下一个空位；也可点击已分配标签的 X 移除 */}
      <div className="text-[11px] text-asylum-muted/60">
        点击病症卡片分配到下一个空位，点击已分配标签的 ✕ 可移除重选
      </div>

      {/* 提交按钮 */}
      <button
        onClick={submit}
        disabled={!allAssigned}
        className={`btn-primary text-sm w-full ${!allAssigned ? 'opacity-40 pointer-events-none' : ''}`}
      >
        {allAssigned ? '确认连线' : `还有 ${patients.length - Object.keys(mapping).length} 位病人未分配`}
      </button>

      <WrongFeedback show={error} attemptCount={wrongAttempts} />
    </div>
  );
}
