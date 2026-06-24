import { X, User, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { characterById } from '../data/characters';
import CharacterAvatar from './CharacterAvatar';

interface CharacterProfileProps {
  characterId: string | null;
  open: boolean;
  onClose: () => void;
  onOpenDialogue?: () => void;
}

export default function CharacterProfile({
  characterId,
  open,
  onClose,
  onOpenDialogue,
}: CharacterProfileProps) {
  const character = characterId ? characterById(characterId) : undefined;
  if (!character) return null;

  const isPlayer = character.role === 'player';

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
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-lg border border-asylum-600 bg-asylum-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 头部 */}
              <div className="relative overflow-hidden border-b border-asylum-700 bg-asylum-900/50 p-6">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    background: `radial-gradient(circle at 80% 20%, ${character.accent}, transparent 60%)`,
                  }}
                />
                <div className="relative flex items-center gap-4">
                  <CharacterAvatar id={character.id} size="xl" showName={false} />
                  <div>
                    <div className="font-serif text-2xl text-asylum-paper">{character.name}</div>
                    <div className="text-sm text-asylum-muted">
                      {isPlayer
                        ? '你 / 主治医师 / 崔诣'
                        : character.role === 'patient'
                        ? '病人'
                        : '关键人物'}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {character.personality?.map((p) => (
                        <span
                          key={p}
                          className="rounded-full border border-asylum-600 bg-asylum-800/80 px-2.5 py-0.5 text-[10px] text-asylum-paper"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 rounded p-1 text-asylum-muted hover:bg-asylum-700 hover:text-asylum-paper"
                >
                  <X size={20} />
                </button>
              </div>

              {/* 内容 */}
              <div className="flex-1 space-y-5 overflow-y-auto p-5">
                {/* 人物小传 */}
                {character.backstory && (
                  <div className="rounded border border-asylum-700/50 bg-asylum-800/50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs font-medium text-asylum-muted">
                      <User size={14} /> 人物小传
                    </div>
                    <p className="text-sm leading-relaxed text-asylum-paper/90">
                      {character.backstory}
                    </p>
                  </div>
                )}

                {/* 关系网 */}
                {character.relations && character.relations.length > 0 && (
                  <div>
                    <div className="mb-2 text-xs font-medium text-asylum-muted">关键关系</div>
                    <div className="space-y-2">
                      {character.relations.map((r) => {
                        const target = characterById(r.targetId);
                        if (!target) return null;
                        return (
                          <div
                            key={r.targetId}
                            className="flex items-center gap-3 rounded border border-asylum-700/50 bg-asylum-800/30 p-2"
                          >
                            <CharacterAvatar id={target.id} size="sm" showName={false} />
                            <div className="flex-1">
                              <div className="text-sm text-asylum-paper">
                                {target.name}
                                <span className="ml-2 rounded bg-asylum-700/60 px-1.5 py-0.5 text-[10px] text-asylum-muted">
                                  {r.label}
                                </span>
                              </div>
                              {r.description && (
                                <div className="text-xs text-asylum-muted">{r.description}</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 访谈入口提示 */}
                {!isPlayer && character.interviewTopics && character.interviewTopics.length > 0 && (
                  <div className="rounded border border-asylum-700/50 bg-asylum-800/30 p-3 text-xs leading-relaxed text-asylum-muted">
                    <MessageCircle size={12} className="mb-1 inline" />
                    {' '}
                    点击下方的「访谈」按钮，可与 {character.name} 进行对话，解锁更多线索。
                  </div>
                )}
              </div>

              {/* 底部 */}
              <div className="flex gap-2 border-t border-asylum-700 bg-asylum-900/50 p-3">
                {!isPlayer && onOpenDialogue && (
                  <button
                    onClick={() => { onClose(); onOpenDialogue(); }}
                    className="btn-primary text-sm flex-1 justify-center"
                  >
                    <MessageCircle size={16} /> 访谈 {character.name}
                  </button>
                )}
                <button
                  onClick={onClose}
                  className={`rounded border border-asylum-600 bg-asylum-800 px-5 py-2 text-sm text-asylum-paper hover:bg-asylum-700 ${
                    isPlayer ? 'flex-1' : ''
                  }`}
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
