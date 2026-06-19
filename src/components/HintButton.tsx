import { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useAudio } from '../hooks/useAudio';
import type { Puzzle } from '../types/game';

interface HintPanelProps {
  id: string;
  hints: [string, string, string, string];
  compact?: boolean;
}

export function HintPanel({ id, hints, compact = false }: HintPanelProps) {
  const [open, setOpen] = useState(false);
  const { hintLevels, useHint } = useGameStore();
  const { playClick } = useAudio();
  const revealed = hintLevels[id] || 0;

  const revealNext = () => {
    playClick();
    const next = Math.min(revealed + 1, 4);
    useHint(id, next);
  };

  return (
    <div className={`rounded border border-asylum-600 bg-asylum-800 ${compact ? 'text-xs' : ''}`}>
      <button
        onClick={() => { playClick(); setOpen(!open); }}
        className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-asylum-700"
      >
        <span className="flex items-center gap-2 font-medium">
          <Lightbulb size={compact ? 12 : 16} className="text-yellow-500" />
          提示 {revealed > 0 ? `（已揭示 ${revealed}/4）` : ''}
        </span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 border-t border-asylum-700 p-3">
              {hints.map((hint, idx) => {
                const level = idx + 1;
                const unlocked = level <= revealed;
                return (
                  <div
                    key={idx}
                    className={`rounded p-2 ${
                      unlocked ? 'bg-asylum-700/50 text-asylum-paper' : 'bg-asylum-900/50 text-asylum-muted'
                    }`}
                  >
                    <div className="mb-1 text-[10px] font-bold">第 {level} 级</div>
                    <div className={compact ? 'text-xs' : 'text-sm'}>{unlocked ? hint : '???'}</div>
                  </div>
                );
              })}
              {revealed < 4 && (
                <button
                  onClick={revealNext}
                  className="w-full rounded bg-asylum-700 py-1.5 text-xs hover:bg-asylum-600"
                >
                  揭示下一级提示
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface HintButtonProps {
  puzzle: Puzzle;
}

export default function HintButton({ puzzle }: HintButtonProps) {
  return <HintPanel id={puzzle.id} hints={puzzle.hints} />;
}
