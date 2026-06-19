import { useState } from 'react';
import { Check } from 'lucide-react';
import type { Puzzle } from '../../types/game';
import { useAudio } from '../../hooks/useAudio';

interface Props {
  puzzle: Puzzle;
  onSolve: () => void;
}

export default function HiddenObject({ puzzle, onSolve }: Props) {
  const image = puzzle.image || '';
  const targets = puzzle.targets || [];
  const [foundIds, setFoundIds] = useState<Set<string>>(new Set());
  const [lastFound, setLastFound] = useState<string | null>(null);
  const { playSuccess, playClick } = useAudio();

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    playClick();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    for (const t of targets) {
      if (foundIds.has(t.id)) continue;
      if (x >= t.x && x <= t.x + t.w && y >= t.y && y <= t.y + t.h) {
        const next = new Set(foundIds);
        next.add(t.id);
        setFoundIds(next);
        setLastFound(t.id);
        if (next.size === targets.length) {
          setTimeout(() => { playSuccess(); onSolve(); }, 400);
        }
        return;
      }
    }
  };

  return (
    <div className="space-y-3">
      <div
        className="relative inline-block w-full cursor-crosshair overflow-hidden rounded border border-asylum-600"
        onClick={handleImageClick}
      >
        <img src={image} alt="隐藏对象场景" className="block w-full" />
        {targets.map((t) => {
          const found = foundIds.has(t.id);
          if (!found && t.id !== lastFound) return null;
          return (
            <div
              key={t.id}
              className={`absolute flex items-center justify-center rounded border transition ${
                found
                  ? 'border-green-500/50 bg-green-900/30'
                  : 'border-asylum-accent/50 bg-asylum-accent/10'
              }`}
              style={{
                left: `${t.x}%`,
                top: `${t.y}%`,
                width: `${t.w}%`,
                height: `${t.h}%`,
              }}
            >
              {found && <Check size={16} className="text-green-400" />}
            </div>
          );
        })}
      </div>

      <div className="space-y-1">
        <div className="text-xs text-asylum-muted">找出以下目标：</div>
        <div className="flex flex-wrap gap-2">
          {targets.map((t) => (
            <span
              key={t.id}
              className={`rounded px-2 py-0.5 text-xs ${
                foundIds.has(t.id)
                  ? 'bg-green-900/30 text-green-400 line-through'
                  : 'bg-asylum-700 text-asylum-paper'
              }`}
            >
              {t.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
