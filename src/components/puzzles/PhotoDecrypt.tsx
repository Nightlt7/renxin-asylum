import { useState } from 'react';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Puzzle } from '../../types/game';
import { useAudio } from '../../hooks/useAudio';

interface Props {
  puzzle: Puzzle;
  onSolve: () => void;
}

export default function PhotoDecrypt({ puzzle, onSolve }: Props) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [found, setFound] = useState(false);
  const { playSuccess, playClick } = useAudio();

  const target = puzzle.targetRect || { x: 0.5, y: 0.5, w: 0.2, h: 0.2 };

  const handleToggleOverlay = () => {
    playClick();
    setShowOverlay((v) => !v);
  };

  const confirmFind = () => {
    playSuccess();
    setFound(true);
    setTimeout(onSolve, 600);
  };

  return (
    <div className="space-y-3">
      {/* 照片 + 解密卡叠加 */}
      <div className="relative mx-auto aspect-[4/3] w-full max-w-2xl overflow-hidden rounded border border-asylum-600 bg-asylum-900">
        {/* 病房照片 */}
        <img
          src={puzzle.image}
          alt="病房照片"
          className="h-full w-full object-contain"
          draggable={false}
        />

        {/* 解密卡叠加层 — 点击按钮后显示 */}
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0"
          >
            {/* 解密卡图片叠加 */}
            {puzzle.overlayImage ? (
              <img
                src={puzzle.overlayImage}
                alt="解密卡"
                className="absolute inset-0 h-full w-full object-contain opacity-85 mix-blend-multiply pointer-events-none"
              />
            ) : (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'rgba(200,30,30,0.15)',
                  mixBlendMode: 'multiply',
                }}
              />
            )}
            {/* 隐藏内容高亮区域 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute animate-pulse rounded border-2 border-yellow-400 bg-yellow-400/20"
              style={{
                left: `${target.x * 100}%`,
                top: `${target.y * 100}%`,
                width: `${target.w * 100}%`,
                height: `${target.h * 100}%`,
              }}
            >
              {/* 隐藏线索文字 */}
              {puzzle.hiddenClue && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-xs text-yellow-300">
                  {puzzle.hiddenClue}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={handleToggleOverlay}
          className={`btn-secondary text-sm ${showOverlay ? '!border-yellow-500/30 !text-yellow-200' : ''}`}
        >
          {showOverlay ? <EyeOff size={14} /> : <Eye size={14} />}
          {showOverlay ? '移除解密卡' : '使用解密卡'}
        </button>

        {showOverlay && !found && (
          <button onClick={confirmFind} className="btn-primary text-sm !py-2">
            <CheckCircle size={14} /> 确认发现：{puzzle.hiddenClue}
          </button>
        )}
      </div>

      {found && (
        <div className="text-center text-sm text-asylum-success">
          已确认：{puzzle.hiddenClue}
        </div>
      )}
    </div>
  );
}
