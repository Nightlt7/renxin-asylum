import { X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playerProfile } from '../data/player';
import CharacterAvatar from './CharacterAvatar';
import TypewriterText from './TypewriterText';

interface PlayerIdentityCardProps {
  open: boolean;
  onClose: () => void;
}

export default function PlayerIdentityCard({ open, onClose }: PlayerIdentityCardProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/80 backdrop-blur"
          />
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-asylum-600 bg-asylum-800 p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-asylum-700 p-2">
                    <User size={20} className="text-asylum-paper" />
                  </div>
                  <div>
                    <div className="font-serif text-xl text-asylum-paper">角色档案</div>
                    <div className="text-xs text-asylum-muted">你正在扮演的调查者</div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="rounded p-1 text-asylum-muted hover:bg-asylum-700 hover:text-asylum-paper"
                  aria-label="关闭"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-5 flex items-center gap-4 rounded border border-asylum-600 bg-asylum-900/50 p-4">
                <CharacterAvatar text={playerProfile.avatarText} size="xl" showName={false} />
                <div>
                  <div className="text-2xl font-semibold text-asylum-paper">
                    {playerProfile.name}
                    <span className="ml-2 text-sm text-asylum-muted">真名：{playerProfile.realName}</span>
                  </div>
                  <div className="text-sm text-asylum-accent">{playerProfile.title}</div>
                </div>
              </div>

              <div className="space-y-4 text-sm leading-relaxed text-asylum-paper">
                <div className="rounded border-l-4 border-asylum-accent bg-asylum-900/40 p-3">
                  <div className="mb-1 text-xs font-bold text-asylum-muted">身份</div>
                  <TypewriterText text={playerProfile.identity} speed={24} />
                </div>
                <div className="rounded border-l-4 border-asylum-accent bg-asylum-900/40 p-3">
                  <div className="mb-1 text-xs font-bold text-asylum-muted">任务</div>
                  <TypewriterText text={playerProfile.mission} speed={24} />
                </div>
                <div className="rounded border-l-4 border-green-700 bg-green-900/10 p-3 text-green-100">
                  <div className="mb-1 text-xs font-bold text-green-300">特质</div>
                  <TypewriterText text={playerProfile.trait} speed={24} />
                </div>
              </div>

              <div className="mt-5 text-center text-xs text-asylum-muted">{playerProfile.note}</div>

              <button
                onClick={onClose}
                className="mt-5 w-full rounded bg-asylum-accent py-2 text-sm font-medium text-white hover:bg-red-800"
              >
                开始调查
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
