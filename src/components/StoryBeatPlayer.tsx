import { useState, useCallback } from 'react';
import { ChevronRight, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { characterById } from '../data/characters';
import { useAudio } from '../hooks/useAudio';
import TypewriterText from './TypewriterText';
import CharacterAvatar from './CharacterAvatar';
import type { StoryBeat } from '../types/game';

interface StoryBeatPlayerProps {
  beats: StoryBeat[];
  onComplete: () => void;
  onSkip?: () => void;
}

const beatVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -16, scale: 0.98 },
};

export default function StoryBeatPlayer({ beats, onComplete, onSkip }: StoryBeatPlayerProps) {
  const [index, setIndex] = useState(0);
  const { playTypeTick } = useAudio();

  const current = beats[index];
  const isLast = index === beats.length - 1;

  const handleNext = useCallback(() => {
    if (isLast) {
      onComplete();
    } else {
      setIndex((i) => i + 1);
    }
  }, [isLast, onComplete]);

  const handleSkip = useCallback(() => {
    onSkip?.();
    onComplete();
  }, [onComplete, onSkip]);

  if (!current) return null;

  const char = current.characterId ? characterById(current.characterId) : undefined;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/88 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            variants={beatVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className={`
              relative min-h-[12rem] rounded-xl border p-6 shadow-2xl
              ${
                current.type === 'flashback'
                  ? 'border-amber-700/40 bg-amber-950/30 sepia'
                  : current.type === 'innerThought'
                  ? 'border-asylum-500/30 bg-asylum-900/60 italic'
                  : current.type === 'dialogue'
                  ? 'border-asylum-600 bg-asylum-800/80'
                  : 'border-asylum-600 bg-asylum-800/80'
              }
            `}
          >
            {current.type === 'flashback' && (
              <>
                {/* 回忆暗角 + 脉冲 */}
                <div className="absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.5)_100%)] pointer-events-none" />
                <motion.div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  animate={{ boxShadow: ['inset 0 0 20px rgba(180,150,80,0.05)', 'inset 0 0 40px rgba(180,150,80,0.12)', 'inset 0 0 20px rgba(180,150,80,0.05)'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
              </>
            )}

            {current.type === 'dialogue' && char && (
              <div className="mb-4 flex items-center gap-3">
                <CharacterAvatar id={char.id} size="md" />
                <div className="text-sm font-medium text-asylum-paper">{char.name}</div>
              </div>
            )}

            <div
              className={`
                text-lg leading-relaxed text-asylum-paper
                ${current.type === 'innerThought' ? 'text-asylum-paper/80' : ''}
                ${current.type === 'flashback' ? 'text-amber-100/90' : ''}
              `}
            >
              {current.type === 'dialogue' ? (
                current.content
              ) : (
                <TypewriterText text={current.content} speed={22} soundEnabled onTick={playTypeTick} skippable />
              )}
            </div>

            {current.type === 'flashback' && (
              <div className="mt-4 text-xs text-amber-300/60">—— 记忆闪回 ——</div>
            )}
            {current.type === 'innerThought' && (
              <div className="mt-4 text-xs text-asylum-muted">—— 叶臻的内心独白 ——</div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-xs text-asylum-muted">
            {index + 1} / {beats.length}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSkip}
              className="flex items-center gap-1 rounded border border-asylum-700 bg-asylum-800/80 px-3 py-2 text-xs text-asylum-muted hover:bg-asylum-700 hover:text-asylum-paper"
            >
              <SkipForward size={14} /> 跳过
            </button>
            <button
              onClick={handleNext}
              className="btn-primary text-sm"
            >
              {isLast ? '进入调查' : '继续'}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
