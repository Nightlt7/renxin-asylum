import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Package } from 'lucide-react';
import type { Clue } from '../types/game';

interface ClueBagProps {
  /** 袋名 */
  label: string;
  /** 线索列表 */
  clues: Clue[];
  /** 已收集的 clue id */
  collectedIds: string[];
  /** 是否为关键线索袋 */
  isKey?: boolean;
  /** 收集回调 */
  onCollect: (clueId: string) => void;
}

export default function ClueBag({ label, clues, collectedIds, isKey, onCollect }: ClueBagProps) {
  const [open, setOpen] = useState(false);
  const allCollected = clues.every((c) => collectedIds.includes(c.id));
  const collectedCount = clues.filter((c) => collectedIds.includes(c.id)).length;

  const handleToggle = () => {
    if (!open) {
      // 展开时自动收集袋内所有线索
      clues.forEach((c) => {
        if (!collectedIds.includes(c.id)) onCollect(c.id);
      });
    }
    setOpen(!open);
  };

  return (
    <motion.div
      className={`card-asylum overflow-hidden ${
        isKey ? 'border-asylum-accent/20 shadow-[0_0_6px_rgba(139,30,30,0.04)]' : ''
      }`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button
        onClick={handleToggle}
        className="flex w-full items-center gap-2.5 px-3.5 py-3 text-left transition-colors hover:bg-asylum-800/40"
      >
        <div className={`flex h-7 w-7 items-center justify-center rounded-md ${
          isKey ? 'bg-asylum-accent/15' : 'bg-asylum-700/50'
        }`}>
          <Package size={14} className={isKey ? 'text-asylum-accent' : 'text-asylum-muted'} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-asylum-paper truncate">{label}</span>
            {isKey && (
              <span className="rounded-full bg-asylum-accent/20 px-1.5 text-[10px] text-red-200/80 flex-none">
                关键
              </span>
            )}
          </div>
          <div className="text-[11px] text-asylum-muted">
            {allCollected ? '已全部收集' : `${collectedCount}/${clues.length} 已收集`}
          </div>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-asylum-muted"
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>

      {/* 袋内容 — 展开动画 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="space-y-1.5 border-t border-asylum-700/30 px-3.5 pb-3 pt-2">
              {clues.map((clue) => {
                const collected = collectedIds.includes(clue.id);
                return (
                  <div
                    key={clue.id}
                    className={`flex items-start justify-between gap-2 rounded-md p-2.5 transition-colors ${
                      collected
                        ? 'bg-asylum-success/5 border border-asylum-success/20'
                        : 'bg-asylum-900/40 border border-asylum-700/30'
                    }`}
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      {collected && <Check size={13} className="mt-0.5 flex-none text-asylum-success" />}
                      <div className="min-w-0">
                        <div className={`text-xs font-medium ${collected ? 'text-green-100' : 'text-asylum-paper'}`}>
                          {clue.title}
                        </div>
                        <div className="mt-0.5 text-[10px] text-asylum-muted/80 line-clamp-1">
                          {clue.description || clue.source}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/** 将线索按 source 分组 */
export function groupCluesBySource(clues: Clue[]): Map<string, Clue[]> {
  const map = new Map<string, Clue[]>();
  for (const clue of clues) {
    const source = clue.source || '其他';
    if (!map.has(source)) map.set(source, []);
    map.get(source)!.push(clue);
  }
  return map;
}
