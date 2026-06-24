import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [showConfirm, setShowConfirm] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [resolving, setResolving] = useState(false);
  const { playClick, playSuccess, playError, playHeartbeat } = useAudio();
  const wrongAttempts = useGameStore((state) => state.wrongAttempts);
  const recordWrongAttempt = useGameStore((state) => state.recordWrongAttempt);

  const handleSelect = (name: string) => {
    if (resolving) return;
    playClick();
    setSelected(name);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (!selected || resolving) return;
    setShowConfirm(false);
    if (selected === puzzle.answer) {
      playSuccess();
      setResolving(true);
      // 短暂延迟让成功音效播放
      setTimeout(() => onSolve(selected), 400);
    } else {
      playError();
      playHeartbeat();
      recordWrongAttempt();
      setShowFeedback(true);
      setResolving(true);
      setTimeout(() => onSolve(selected), 1800);
    }
  };

  return (
    <div className="space-y-4">
      {/* 嫌疑人网格 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {suspects.map((s) => {
          const isPatient = !['崔哲金', '曹怀敬'].includes(s);
          return (
            <motion.button
              key={s}
              disabled={resolving}
              onClick={() => handleSelect(s)}
              whileHover={!resolving ? { y: -2, boxShadow: '0 4px 12px rgba(139,30,30,0.2)' } : {}}
              whileTap={!resolving ? { scale: 0.97 } : {}}
              className={`flex flex-col items-center justify-center gap-2 rounded-lg border px-3 py-4 text-sm transition-all ${
                selected === s
                  ? 'border-asylum-accent bg-asylum-accent/20 text-white shadow-[0_0_12px_rgba(139,30,30,0.15)]'
                  : 'border-asylum-600 bg-asylum-800 hover:border-asylum-500 hover:bg-asylum-700'
              } ${resolving && selected !== s ? 'opacity-40' : ''}`}
            >
              <CharacterAvatar name={s} size="lg" />
              <span className="text-xs">{s}</span>
              {isPatient && (
                <span className="text-[10px] text-asylum-muted">
                  {s === '袁枝' ? '2016G' : s === '冯思雅' ? '2016A' : s === '姚欢' ? '2016B' : s === '罗昆山' ? '2016C' : s === '何秀文' ? '2016D' : s === '戴先中' ? '2016E' : '2016F'}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* 确认弹窗 — 戏剧化确认 */}
      <AnimatePresence>
        {showConfirm && selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[85] flex items-center justify-center bg-black/60"
          >
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              className="card-asylum mx-4 max-w-sm p-6 text-center"
            >
              <div className="mb-3 text-xs text-asylum-muted uppercase tracking-widest">最终指控</div>
              <div className="mb-4 text-lg font-serif text-asylum-paper">
                你确定真凶是
              </div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-lg bg-asylum-accent/5 border border-asylum-accent/15 px-4 py-2">
                <CharacterAvatar name={selected} size="sm" />
                <span className="text-base font-medium text-red-100">{selected}</span>
              </div>
              <div className="flex gap-3 justify-center">
                <button onClick={() => { playClick(); setShowConfirm(false); }} className="btn-secondary text-sm">再想想</button>
                <button onClick={handleConfirm} className="btn-primary text-sm">确认指控</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 错误反馈 */}
      <WrongFeedback show={showFeedback} attemptCount={wrongAttempts} />

      {resolving && selected !== puzzle.answer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-red-400"
        >
          指控错误……真相即将揭晓……
        </motion.div>
      )}
    </div>
  );
}
