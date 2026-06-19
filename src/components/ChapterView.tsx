import { useState, useEffect, useMemo } from 'react';
import { Lock, Unlock, Pill, Plus, ChevronRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Chapter } from '../types/game';
import { useGameStore } from '../store/gameStore';
import { useAudio } from '../hooks/useAudio';
import { clueById } from '../data/clues';
import { puzzleById } from '../data/puzzles';
import { chapterById } from '../data/chapters';
import DocumentImage from './DocumentImage';
import HintButton from './HintButton';
import { HintPanel } from './HintButton';
import PuzzleRenderer from './puzzles/PuzzleRenderer';
import ChapterIllustration from './ChapterIllustration';
import AudioPlayer from './AudioPlayer';
import ChapterTransition from './ChapterTransition';
import TypewriterText from './TypewriterText';
import DiscoveryToast from './DiscoveryToast';
import SolutionNotes from './SolutionNotes';
import CharacterAvatar from './CharacterAvatar';
import DialogueView from './DialogueView';
import CharacterProfile from './CharacterProfile';
import StoryBeatPlayer from './StoryBeatPlayer';
import { characterById } from '../data/characters';

interface ChapterViewProps {
  chapter: Chapter;
}

export default function ChapterView({ chapter }: ChapterViewProps) {
  const {
    collectedClueIds,
    solvedPuzzleIds,
    hasPainProtection,
    painkillerTakenInChapter,
    viewedStoryBeatIds,
    answeredAdvanceQuestionIds,
    collectClue,
    solvePuzzle,
    unlockChapter,
    goToChapter,
    takePainkiller,
    setEnding,
    viewStoryBeat,
    answerAdvanceQuestion,
    recordWrongAttempt,
  } = useGameStore();
  const { playClick, playSuccess, playError, playAdvance, playClueCollect, playTension } = useAudio();
  const [tookPillHere, setTookPillHere] = useState(false);
  const [toastClueId, setToastClueId] = useState<string | null>(null);
  const [dialogueCharId, setDialogueCharId] = useState<string | null>(null);
  const [profileCharId, setProfileCharId] = useState<string | null>(null);
  const [advanceAnswer, setAdvanceAnswer] = useState('');
  const [advanceError, setAdvanceError] = useState(false);

  const pendingBeats = useMemo(
    () => (chapter.storyBeats || []).filter((b) => !viewedStoryBeatIds.includes(b.id)),
    [chapter.storyBeats, viewedStoryBeatIds]
  );
  const [showBeats, setShowBeats] = useState(pendingBeats.length > 0);

  useEffect(() => {
    setShowBeats(pendingBeats.length > 0);
  }, [pendingBeats.length]);

  useEffect(() => {
    if (chapter.id === 'deduction') {
      playTension();
    }
  }, [chapter.id, playTension]);

  const isSolved = chapter.puzzleId ? solvedPuzzleIds.includes(chapter.puzzleId) : true;
  const canAdvance = isSolved;
  const nextChapter = chapter.nextChapterId ? chapterById(chapter.nextChapterId) : undefined;

  const handleSolve = (result?: string) => {
    playSuccess();
    if (chapter.puzzleId) {
      solvePuzzle(chapter.puzzleId);
    }
    if (chapter.id === 'deduction') {
      // 最终指控：根据选择 + 疼痛状态决定结局
      const correct = result === '袁枝';
      if (correct && hasPainProtection) {
        setEnding('good');
      } else {
        setEnding('bad');
      }
      return;
    }
    if (chapter.nextChapterId) {
      unlockChapter(chapter.nextChapterId);
    }
  };

  const handleAdvance = () => {
    playAdvance();
    if (chapter.nextChapterId) {
      unlockChapter(chapter.nextChapterId);
      goToChapter(chapter.nextChapterId);
    }
  };

  const handleAnswerAdvance = () => {
    if (!chapter.advanceQuestion) return;
    const userAnswer = advanceAnswer.trim().toLowerCase();
    const correctAnswers = chapter.advanceQuestion.answer.split('/').map((a) => a.trim().toLowerCase());
    if (correctAnswers.includes(userAnswer)) {
      playSuccess();
      answerAdvanceQuestion(chapter.id);
      if (chapter.nextChapterId) {
        unlockChapter(chapter.nextChapterId);
      }
    } else {
      playError();
      recordWrongAttempt();
      setAdvanceError(true);
      setTimeout(() => setAdvanceError(false), 800);
    }
  };

  const handleTakePainkiller = () => {
    playClick();
    takePainkiller(chapter.id);
    setTookPillHere(true);
  };

  const puzzle = chapter.puzzleId ? puzzleById(chapter.puzzleId) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="mx-auto h-full max-w-4xl overflow-y-auto px-4 py-6"
    >
      {/* 章节转场标题卡 */}
      <ChapterTransition chapter={chapter} />

      {/* 章节叙事节拍 */}
      {showBeats && pendingBeats.length > 0 && (
        <StoryBeatPlayer
          beats={pendingBeats}
          onComplete={() => {
            pendingBeats.forEach((b) => viewStoryBeat(b.id));
            setShowBeats(false);
          }}
          onSkip={() => {
            pendingBeats.forEach((b) => viewStoryBeat(b.id));
          }}
        />
      )}

      {/* 章节插画 */}
      <div className="mb-4">
        <ChapterIllustration chapterId={chapter.id} />
      </div>

      {/* 章节标题 */}
      <div className="mb-6 text-center">
        <div className="text-sm uppercase tracking-widest text-asylum-muted">{chapter.title}</div>
        <h2 className="font-serif text-3xl text-asylum-paper">{chapter.subtitle}</h2>
        {chapter.storyBeats && chapter.storyBeats.length > 0 && (
          <button
            onClick={() => setShowBeats(true)}
            className="mt-2 text-xs text-asylum-muted underline hover:text-asylum-paper"
          >
            回放本章叙事
          </button>
        )}
      </div>

      {/* 叙事文本 */}
      {chapter.narrative && (
        <div className="mb-6 min-h-[4rem] rounded border-l-4 border-asylum-accent bg-asylum-800/50 p-4 text-base leading-relaxed text-asylum-paper">
          <TypewriterText text={chapter.narrative} speed={26} />
        </div>
      )}

      {/* 线索卡 */}
      {chapter.clueIds && chapter.clueIds.length > 0 && (
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {chapter.clueIds.map((cid) => {
            const clue = clueById(cid);
            if (!clue) return null;
            const collected = collectedClueIds.includes(cid);
            return (
              <motion.div
                key={cid}
                initial={false}
                animate={collected ? { scale: [1, 1.02, 1], borderColor: '#22c55e' } : {}}
                transition={{ duration: 0.4 }}
                className={`rounded border p-3 transition ${
                  collected
                    ? 'border-green-700/50 bg-green-900/10 opacity-80'
                    : 'border-asylum-600 bg-asylum-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {collected && <Check size={14} className="text-green-500" />}
                    <div>
                      <div className={`text-sm font-medium ${collected ? 'text-green-100' : ''}`}>{clue.title}</div>
                      <div className="text-xs text-asylum-muted">{clue.source}</div>
                    </div>
                  </div>
                  {!collected && (
                    <button
                      onClick={() => { playClueCollect(); collectClue(cid); setToastClueId(cid); }}
                      className="flex items-center gap-1 rounded bg-asylum-700 px-2 py-1 text-xs hover:bg-asylum-600"
                    >
                      <Plus size={12} /> 收入线索本
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 音频播放器 */}
      {chapter.audioClues && chapter.audioClues.length > 0 && (
        <div className="mb-6 grid gap-3">
          {chapter.audioClues.map((ac, idx) => (
            <AudioPlayer key={idx} title={ac.title} date={ac.date} duration={ac.duration} />
          ))}
        </div>
      )}

      {/* 文档图片 */}
      {chapter.images && chapter.images.length > 0 && (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {chapter.images.map((src, idx) => (
            <DocumentImage
              key={src}
              src={src}
              alt={`${chapter.subtitle} 资料 ${idx + 1}`}
              caption={`资料 ${idx + 1}`}
              hotspots={chapter.hotspots?.filter((h) => h.imageIndex === idx)}
            />
          ))}
        </div>
      )}

      {/* 本章可访谈角色 */}
      {chapter.interviewCharacterIds && chapter.interviewCharacterIds.length > 0 && (
        <div className="mb-6 rounded border border-asylum-600 bg-asylum-800/40 p-4">
          <div className="mb-3 text-sm font-medium text-asylum-paper">本章可访谈角色</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {chapter.interviewCharacterIds.map((charId) => {
              const char = characterById(charId);
              if (!char) return null;
              return (
                <div
                  key={charId}
                  className="flex flex-col gap-1 rounded border border-asylum-700 bg-asylum-800/60 p-2"
                >
                  <button
                    onClick={() => setProfileCharId(charId)}
                    className="flex items-center gap-2 rounded hover:bg-asylum-700/50"
                    title="查看档案"
                  >
                    <CharacterAvatar id={charId} size="sm" />
                    <span className="text-xs text-asylum-paper">{char.name}</span>
                  </button>
                  {char.interviewTopics && char.interviewTopics.length > 0 && (
                    <button
                      onClick={() => setDialogueCharId(charId)}
                      className="rounded bg-asylum-700/80 py-1 text-[10px] text-asylum-paper hover:bg-asylum-600"
                    >
                      访谈
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 疼痛/止痛药选择 */}
      {chapter.painChoice && hasPainProtection && !painkillerTakenInChapter && (
        <div className="mb-6 rounded border border-asylum-600 bg-asylum-800/50 p-4">
          <div className="mb-2 text-sm text-asylum-muted">
            疲惫与疼痛同时袭来，你看着包里的止痛药……
          </div>
          {!tookPillHere ? (
            <button
              onClick={handleTakePainkiller}
              className="flex items-center gap-2 rounded bg-asylum-600 px-4 py-2 text-sm hover:bg-asylum-500"
            >
              <Pill size={16} /> 服用止痛药，好好睡一觉
            </button>
          ) : (
            <div className="text-sm text-asylum-paper">你服下止痛药，疼痛慢慢退去。</div>
          )}
        </div>
      )}

      {/* 谜题区 */}
      {puzzle && (
        <div className="mb-6 rounded border border-asylum-600 bg-asylum-800/40 p-5">
          <div className="mb-2 flex items-center gap-2">
            {isSolved ? <Unlock size={18} className="text-green-400" /> : <Lock size={18} className="text-asylum-muted" />}
            <span className="font-medium">{isSolved ? '已解锁' : puzzle.title}</span>
          </div>
          {!isSolved ? (
            <>
              <p className="mb-4 text-sm leading-relaxed text-asylum-muted">{puzzle.description}</p>
              {puzzle.image && (
                <div className="mb-4 max-w-sm">
                  <DocumentImage src={puzzle.image} alt={puzzle.title} />
                </div>
              )}
              <PuzzleRenderer puzzle={puzzle} onSolve={handleSolve} />
              <div className="mt-4">
                <HintButton puzzle={puzzle} />
              </div>
            </>
          ) : (
            <div className="text-sm text-green-400">已完成本章推理，可以进入下一章。</div>
          )}
          {isSolved && puzzle?.solutionNotes && (
            <SolutionNotes notes={puzzle.solutionNotes} />
          )}
        </div>
      )}

      {/* 章节门槛问题 */}
      {chapter.advanceQuestion && !answeredAdvanceQuestionIds.includes(chapter.id) && (
        <div className={`mb-6 rounded border border-asylum-600 bg-asylum-800/50 p-5 ${advanceError ? 'animate-shake ring-1 ring-red-500' : ''}`}>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-asylum-paper">
            <Lock size={16} className="text-asylum-accent" />
            进入下一章前，请先回答：
          </div>
          <div className="mb-4 text-asylum-paper">{chapter.advanceQuestion.question}</div>
          <div className="mb-3 flex gap-2">
            <input
              type="text"
              value={advanceAnswer}
              onChange={(e) => { setAdvanceAnswer(e.target.value); setAdvanceError(false); }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAnswerAdvance(); }}
              placeholder="输入你的推理……"
              className="flex-1 rounded border border-asylum-600 bg-asylum-900 px-3 py-2 text-sm text-asylum-paper outline-none focus:border-asylum-accent"
            />
            <button
              onClick={handleAnswerAdvance}
              className="rounded bg-asylum-accent px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
            >
              提交
            </button>
          </div>
          <HintPanel
            id={`advance-${chapter.id}`}
            hints={chapter.advanceQuestion.hints}
            compact
          />
          {advanceError && (
            <div className="mt-3 text-sm text-red-400">答案不正确，再想想。你可以查看上方提示。</div>
          )}
        </div>
      )}

      {/* 前进按钮 */}
      {canAdvance && nextChapter && chapter.id !== 'deduction' && (!chapter.advanceQuestion || answeredAdvanceQuestionIds.includes(chapter.id)) && (
        <div className="flex justify-end">
          <button
            onClick={handleAdvance}
            className="flex items-center gap-2 rounded bg-asylum-accent px-6 py-2 font-medium text-white hover:bg-red-800"
          >
            进入{nextChapter.title} · {nextChapter.subtitle}
            <ChevronRight size={18} />
          </button>
        </div>
      )}
      <DiscoveryToast
        open={!!toastClueId}
        title={toastClueId ? clueById(toastClueId)?.title ?? '' : ''}
        subtitle={toastClueId ? clueById(toastClueId)?.source ?? '' : ''}
        onClose={() => setToastClueId(null)}
      />
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
  );
}
