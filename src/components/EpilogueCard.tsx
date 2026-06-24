import { motion } from 'framer-motion';
import { Users, X, ChevronRight } from 'lucide-react';
import { truth } from '../data/truth';
import CharacterAvatar from './CharacterAvatar';

interface EpilogueCardProps {
  onClose?: () => void;
  onContinue?: () => void;
}

export default function EpilogueCard({ onClose, onContinue }: EpilogueCardProps) {
  const epilogues = truth.epilogues || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="flex max-h-[70vh] w-full flex-col overflow-hidden rounded-lg border border-asylum-600 bg-asylum-800/90 shadow-2xl"
    >
      {/* 头部 */}
      <div className="flex items-center justify-between border-b border-asylum-700 bg-asylum-900/60 px-5 py-3">
        <div className="flex items-center gap-2 text-sm font-medium text-asylum-paper">
          <Users size={16} className="text-asylum-accent" />
          角色尾声
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded p-1 text-asylum-muted hover:bg-asylum-700 hover:text-asylum-paper"
            aria-label="关闭"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* 列表 */}
      <div className="flex-1 space-y-3 overflow-y-auto p-5">
        <div className="text-xs leading-relaxed text-asylum-muted">
          在另一个选择里，他们的结局或许不同。这里是真结局分支后，关键角色的去向。
        </div>
        {epilogues.map((ep, idx) => (
          <motion.div
            key={ep.characterId}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-start gap-3 rounded-lg border border-asylum-700/50 bg-asylum-800/60 p-3 transition hover:border-asylum-600"
          >
            <CharacterAvatar id={ep.characterId} size="md" />
            <div className="flex-1">
              <div className="mb-1 text-sm font-medium text-asylum-paper">{ep.title}</div>
              <div className="text-xs leading-relaxed text-asylum-muted">{ep.content}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 底部 */}
      <div className="flex items-center justify-end gap-2 border-t border-asylum-700 bg-asylum-900/60 px-5 py-3">
        {onClose && (
          <button
            onClick={onClose}
            className="rounded border border-asylum-600 bg-asylum-800 px-4 py-2 text-xs text-asylum-paper hover:bg-asylum-700"
          >
            收起
          </button>
        )}
        {onContinue && (
          <button
            onClick={onContinue}
            className="btn-primary text-xs"
          >
            查看真相解析
            <ChevronRight size={14} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
