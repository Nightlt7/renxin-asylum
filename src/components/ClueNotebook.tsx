import { useEffect, useState } from 'react';
import { X, BookOpen, LayoutGrid, List, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clues } from '../data/clues';
import { findCharacterInText } from '../data/characters';
import { useGameStore } from '../store/gameStore';
import CharacterAvatar from './CharacterAvatar';
import ClueBoard from './ClueBoard';
import DialogueView from './DialogueView';
import CharacterProfile from './CharacterProfile';

interface ClueNotebookProps {
  open: boolean;
  onClose: () => void;
}

export default function ClueNotebook({ open, onClose }: ClueNotebookProps) {
  const { collectedClueIds, seenClueIds, markCluesSeen } = useGameStore();
  const collected = clues.filter((c) => collectedClueIds.includes(c.id));
  const newClueIds = collectedClueIds.filter((id) => !seenClueIds.includes(id));
  const [view, setView] = useState<'board' | 'list'>('board');
  const [dialogueCharId, setDialogueCharId] = useState<string | null>(null);
  const [profileCharId, setProfileCharId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      markCluesSeen();
    }
  }, [open, markCluesSeen]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-4xl flex-col shadow-2xl"
            style={{
              background: 'linear-gradient(180deg, #181b21 0%, #15171d 100%)',
              borderLeft: '1px solid rgba(139,30,30,0.12)',
            }}
          >
            {/* 头部 */}
            <div
              className="flex items-center justify-between px-4 py-3.5"
              style={{ borderBottom: '1px solid rgba(46,52,61,0.5)' }}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen size={17} className="text-asylum-accent/60" />
                <span className="font-serif text-base tracking-wide">线索本</span>
                <span className="text-xs text-asylum-muted">
                  {collected.length}/{clues.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setView('board')}
                  className={`btn-ghost rounded-md p-1.5 !text-xs ${view === 'board' ? '!text-asylum-paper !border-asylum-accent/15 !bg-asylum-accent/5' : ''}`}
                  title="推理墙"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`btn-ghost rounded-md p-1.5 !text-xs ${view === 'list' ? '!text-asylum-paper !border-asylum-accent/15 !bg-asylum-accent/5' : ''}`}
                  title="列表"
                >
                  <List size={16} />
                </button>
                <button onClick={onClose} className="btn-ghost rounded-md p-1.5">
                  <X size={16} />
                </button>
              </div>
            </div>

            {collected.length === 0 ? (
              <div className="flex flex-1 items-center justify-center text-center text-asylum-muted">
                还没有收集线索。
                <br />
                在章节中点击“收入线索本”即可整理。
              </div>
            ) : view === 'board' ? (
              <ClueBoard
                collected={collected}
                newClueIds={newClueIds}
                onCharacterClick={setProfileCharId}
                onDialogueClick={setDialogueCharId}
              />
            ) : (
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {collected.map((clue) => {
                  const isNew = newClueIds.includes(clue.id);
                  const matchedChar = findCharacterInText(`${clue.title} ${clue.source} ${clue.description}`);
                  return (
                    <div
                      key={clue.id}
                      className={`rounded border bg-asylum-900/50 p-3 transition ${
                        isNew ? 'border-green-600/70 shadow-[0_0_12px_rgba(22,163,74,0.15)]' : 'border-asylum-600'
                      }`}
                    >
                      <div className="mb-2 flex items-start justify-between gap-2">
                        {matchedChar ? (
                          <button
                            onClick={() => setProfileCharId(matchedChar.id)}
                            className="flex items-center gap-2 rounded hover:bg-asylum-800"
                            title="查看角色档案"
                          >
                            <CharacterAvatar
                              text={`${clue.title} ${clue.source} ${clue.description}`}
                              size="sm"
                              showName
                            />
                          </button>
                        ) : (
                          <CharacterAvatar
                            text={`${clue.title} ${clue.source} ${clue.description}`}
                            size="sm"
                            showName
                          />
                        )}
                        <div className="flex items-center gap-2">
                          {matchedChar && matchedChar.interviewTopics && matchedChar.interviewTopics.length > 0 && (
                            <button
                              onClick={() => setDialogueCharId(matchedChar.id)}
                              className="rounded bg-asylum-700 px-2 py-1 text-xs text-asylum-paper hover:bg-asylum-600"
                              title="访谈"
                            >
                              访谈
                            </button>
                          )}
                          {isNew && (
                            <span className="flex items-center gap-1 rounded bg-green-800/60 px-1.5 py-0.5 text-xs font-medium text-green-200">
                              <Sparkles size={12} />
                              新
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="font-medium text-asylum-paper">{clue.title}</div>
                      <div className="text-xs text-asylum-muted">{clue.source}</div>
                      <p className="mt-1 text-sm leading-relaxed">{clue.description}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {clue.tags.map((tag) => (
                          <span key={tag} className="rounded bg-asylum-700 px-1.5 py-0.5 text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <DialogueView
              characterId={dialogueCharId}
              open={!!dialogueCharId}
              onClose={() => setDialogueCharId(null)}
            />
            <CharacterProfile
              characterId={profileCharId}
              open={!!profileCharId}
              onClose={() => setProfileCharId(null)}
              onOpenDialogue={() => {
                if (profileCharId) setDialogueCharId(profileCharId);
              }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
