import { useState, useEffect, useMemo, useCallback } from 'react';
import { X, MessageCircle, User, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { characterById } from '../data/characters';
import { useGameStore } from '../store/gameStore';
import { useAudio } from '../hooks/useAudio';
import CharacterAvatar from './CharacterAvatar';
import TypewriterText from './TypewriterText';
import type { DialogueLine, InterviewTopic } from '../data/characters';

interface DialogueViewProps {
  characterId: string | null;
  open: boolean;
  onClose: () => void;
  // 支持从外部打开指定话题
  initialTopicId?: string;
}

function isTopicUnlocked(
  topic: InterviewTopic,
  unlockedChapterIds: string[],
  collectedClueIds: string[],
  solvedPuzzleIds: string[]
): boolean {
  if (!topic.condition) return true;
  const cond = topic.condition;
  const chapterOk = !cond.chapterIds || cond.chapterIds.some((id) => unlockedChapterIds.includes(id));
  const clueOk = !cond.clueIds || cond.clueIds.some((id) => collectedClueIds.includes(id));
  const puzzleOk = !cond.puzzleIds || cond.puzzleIds.some((id) => solvedPuzzleIds.includes(id));
  return chapterOk && clueOk && puzzleOk;
}

export default function DialogueView({
  characterId,
  open,
  onClose,
  initialTopicId,
}: DialogueViewProps) {
  const character = characterId ? characterById(characterId) : undefined;
  const {
    collectedClueIds,
    collectClue,
    unlockedChapterIds,
    solvedPuzzleIds,
    viewedDialogueTopicIds,
    viewDialogueTopic,
  } = useGameStore();
  const { playClueCollect, playClick, playAdvance, playTypeTick } = useAudio();

  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  // displayedLines 是已经完整显示过的整句
  const [displayedLines, setDisplayedLines] = useState<DialogueLine[]>([]);
  // currentLine 是正在逐字显示的句子
  const [currentLine, setCurrentLine] = useState<DialogueLine | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const topics = character?.interviewTopics || [];

  const unlockedTopics = useMemo(
    () =>
      topics.filter((t) =>
        isTopicUnlocked(t, unlockedChapterIds, collectedClueIds, solvedPuzzleIds)
      ),
    [topics, unlockedChapterIds, collectedClueIds, solvedPuzzleIds]
  );

  const reset = useCallback(() => {
    setActiveTopicId(null);
    setDisplayedLines([]);
    setCurrentLine(null);
    setIsTyping(false);
  }, []);

  // 打开/切换角色时重置
  useEffect(() => {
    if (open) {
      reset();
      if (initialTopicId && topics.some((t) => t.id === initialTopicId)) {
        setActiveTopicId(initialTopicId);
      }
    }
  }, [open, characterId, initialTopicId, topics, reset]);

  // 选择话题
  const handleSelectTopic = useCallback(
    (topic: InterviewTopic) => {
      playClick();
      if (!viewedDialogueTopicIds.includes(topic.id)) {
        viewDialogueTopic(topic.id);
      }
      setActiveTopicId(topic.id);
      setDisplayedLines([]);
      setCurrentLine(topic.lines[0] || null);
      setIsTyping(true);
    },
    [playClick, viewDialogueTopic, viewedDialogueTopicIds]
  );

  // 继续下一句
  const handleAdvance = useCallback(() => {
    if (!activeTopicId) return;
    const topic = topics.find((t) => t.id === activeTopicId);
    if (!topic) return;

    // 如果正在打字，先完成当前句
    if (isTyping) {
      setIsTyping(false);
      return;
    }

    // 把 currentLine 移入历史
    const nextDisplayed = currentLine ? [...displayedLines, currentLine] : displayedLines;
    setDisplayedLines(nextDisplayed);

    const currentIdx = topic.lines.findIndex((l) => l === currentLine);
    const nextLine = topic.lines[currentIdx + 1];

    if (nextLine) {
      playAdvance();
      setCurrentLine(nextLine);
      setIsTyping(true);
    } else {
      setCurrentLine(null);
      // 处理 nextTopicId：如果存在且未解锁，则标记为已查看并返回话题列表
      const lastLine = nextDisplayed[nextDisplayed.length - 1];
      if (lastLine?.nextTopicId) {
        const nextTopic = topics.find((t) => t.id === lastLine.nextTopicId);
        if (nextTopic && !viewedDialogueTopicIds.includes(nextTopic.id)) {
          viewDialogueTopic(nextTopic.id);
        }
      }
    }
  }, [
    activeTopicId,
    topics,
    isTyping,
    currentLine,
    displayedLines,
    playAdvance,
    viewedDialogueTopicIds,
    viewDialogueTopic,
  ]);

  // 返回话题列表
  const handleBackToTopics = useCallback(() => {
    playClick();
    reset();
  }, [playClick, reset]);

  // 首次进入话题时，第一句的线索立即解锁
  useEffect(() => {
    if (currentLine && isTyping && currentLine.unlockClueId && !collectedClueIds.includes(currentLine.unlockClueId)) {
      playClueCollect();
      collectClue(currentLine.unlockClueId);
    }
  }, [currentLine, isTyping, collectedClueIds, collectClue, playClueCollect]);

  if (!character) return null;

  const activeTopic = topics.find((t) => t.id === activeTopicId);
  const isPlayerCharacter = character.role === 'player';

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
              className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-asylum-600 bg-asylum-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 头部 */}
              <div className="flex items-center justify-between border-b border-asylum-700 bg-asylum-900/50 p-4">
                <div className="flex items-center gap-3">
                  <CharacterAvatar id={character.id} size="md" />
                  <div>
                    <div className="font-medium text-asylum-paper">{character.name}</div>
                    <div className="flex flex-wrap items-center gap-1 text-xs text-asylum-muted">
                      <span>
                        {character.role === 'patient'
                          ? '病人'
                          : character.role === 'player'
                          ? '你'
                          : 'NPC'}
                      </span>
                      {character.personality?.slice(0, 3).map((p) => (
                        <span
                          key={p}
                          className="rounded bg-asylum-700/60 px-1.5 py-0.5 text-[10px]"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
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

              {/* 人物小传（仅在话题列表页展示） */}
              {!activeTopic && character.backstory && (
                <div className="border-b border-asylum-700/50 bg-asylum-800/50 px-4 py-3 text-xs leading-relaxed text-asylum-muted">
                  <BookOpen size={12} className="mb-1 inline text-asylum-accent" />
                  {' '}
                  {character.backstory}
                </div>
              )}

              {/* 对话内容区 */}
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {!activeTopic ? (
                  /* 话题列表 */
                  <div className="space-y-2">
                    {unlockedTopics.length > 0 ? (
                      unlockedTopics.map((topic, idx) => {
                        const viewed = viewedDialogueTopicIds.includes(topic.id);
                        return (
                          <motion.button
                            key={topic.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => handleSelectTopic(topic)}
                            className={`w-full rounded border p-3 text-left transition ${
                              viewed
                                ? 'border-asylum-600 bg-asylum-700/30 hover:bg-asylum-700/50'
                                : 'border-asylum-500 bg-asylum-700/60 hover:bg-asylum-600/80'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-asylum-paper">
                                {topic.title}
                              </span>
                              {!viewed && (
                                <span className="rounded-full bg-asylum-accent px-1.5 py-0.5 text-[10px] text-white">
                                  新
                                </span>
                              )}
                            </div>
                          </motion.button>
                        );
                      })
                    ) : (
                      <div className="py-8 text-center text-sm text-asylum-muted">
                        当前还没有可聊的话题，继续推进调查后会解锁。
                      </div>
                    )}

                    {/* 关系网入口 */}
                    {!isPlayerCharacter && character.relations && character.relations.length > 0 && (
                      <div className="mt-4 rounded border border-asylum-700/50 bg-asylum-800/30 p-3">
                        <div className="mb-2 text-xs text-asylum-muted">
                          <User size={12} className="inline" /> 关键关系
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {character.relations.map((r) => {
                            const target = characterById(r.targetId);
                            if (!target) return null;
                            return (
                              <span
                                key={r.targetId}
                                className="rounded bg-asylum-700/50 px-2 py-1 text-xs text-asylum-paper"
                              >
                                {target.name} · {r.label}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* 对话历史 + 当前句 */
                  <>
                    {displayedLines.map((line, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${line.speaker === 'player' ? 'flex-row-reverse' : ''}`}
                      >
                        <div className="flex-none pt-1">
                          <CharacterAvatar
                            id={line.speaker === 'player' ? 'yezhen' : character.id}
                            size="sm"
                          />
                        </div>
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                            line.speaker === 'player'
                              ? 'bg-asylum-accent/20 text-asylum-paper'
                              : 'bg-asylum-700/50 text-asylum-paper'
                          }`}
                        >
                          {line.text}
                          {line.unlockClueId && (
                            <div className="mt-1 flex items-center gap-1 text-xs text-green-300">
                              <MessageCircle size={12} />
                              已记入线索本
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}

                    {currentLine && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${currentLine.speaker === 'player' ? 'flex-row-reverse' : ''}`}
                      >
                        <div className="flex-none pt-1">
                          <CharacterAvatar
                            id={currentLine.speaker === 'player' ? 'yezhen' : character.id}
                            size="sm"
                          />
                        </div>
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                            currentLine.speaker === 'player'
                              ? 'bg-asylum-accent/20 text-asylum-paper'
                              : 'bg-asylum-700/50 text-asylum-paper'
                          }`}
                        >
                          {currentLine.speaker === 'npc' && isTyping ? (
                            <TypewriterText text={currentLine.text} speed={24} soundEnabled onTick={playTypeTick} skippable onDone={() => setIsTyping(false)} />
                          ) : (
                            currentLine.text
                          )}
                          {currentLine.unlockClueId && !isTyping && (
                            <div className="mt-1 flex items-center gap-1 text-xs text-green-300">
                              <MessageCircle size={12} />
                              已记入线索本
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </div>

              {/* 底部操作区 */}
              <div className="border-t border-asylum-700 bg-asylum-900/50 p-3">
                {!activeTopic ? (
                  <button
                    onClick={onClose}
                    className="w-full rounded bg-asylum-700 py-2 text-sm text-asylum-paper hover:bg-asylum-600"
                  >
                    关闭
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleBackToTopics}
                      className="rounded border border-asylum-600 bg-asylum-800 px-4 py-2 text-sm text-asylum-paper hover:bg-asylum-700"
                    >
                      返回话题
                    </button>
                    <button
                      onClick={handleAdvance}
                      disabled={!currentLine && displayedLines.length === activeTopic.lines.length}
                      className="btn-primary text-sm flex-1"
                    >
                      {isTyping ? '跳过打字' : currentLine ? '继续' : '结束对话'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
