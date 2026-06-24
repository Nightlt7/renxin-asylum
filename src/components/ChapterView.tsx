import { useState, useEffect, useMemo, useCallback } from 'react';
import { Lock, Unlock, Pill, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Chapter } from '../types/game';
import { useGameStore } from '../store/gameStore';
import { useAudio } from '../hooks/useAudio';
import { clueById } from '../data/clues';
import { puzzleById } from '../data/puzzles';
import { chapterById } from '../data/chapters';
import { staggerContainer, fadeUpItem, DURATION } from '../utils/animation';
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
import ClueBag, { groupCluesBySource } from './ClueBag';
import PhoneInteraction from './PhoneInteraction';
import DossierInteraction from './DossierInteraction';
import ChapterCutscene from './ChapterCutscene';
import StoryBeatPlayer from './StoryBeatPlayer';
import { characterById } from '../data/characters';

interface ChapterViewProps {
  chapter: Chapter;
}

/** 判断线索是否为关键线索（tags 包含重要标签） */
function isKeyClue(clueId: string): boolean {
  const clue = clueById(clueId);
  if (!clue) return false;
  const keyTags = ['案件', '催眠', '动机', '真相'];
  return clue.tags?.some((t) => keyTags.includes(t)) ?? false;
}

/** 根据章节类型渲染不同的线索交互界面 */
function ClueSection({ chapterId, clueIds, collectedIds, onCollect }: {
  chapterId: string;
  clueIds: string[];
  collectedIds: string[];
  onCollect: (id: string) => void;
}) {
  const chapterClues = clueIds.map((cid) => clueById(cid)).filter(Boolean) as NonNullable<ReturnType<typeof clueById>>[];

  // 第2章：手机交互 — 线索全部整合进手机界面
  if (chapterId === 'phone') {
    const messages = [
      {
        id: 'msg1',
        clueId: 'clue_senior_sms',
        sender: '刘师姐',
        time: '9月10日 14:30',
        bubbles: [
          { text: '叶臻，我刚从仁馨回来。有个事一定要告诉你。', fromMe: false },
          { text: '我在仁馨建档的三天里，有一段记忆是空的。至少一个小时，完全想不起来发生了什么。', fromMe: false },
          { text: '我之前在仁馨的时候也有过类似感觉——被人催眠了。', fromMe: false },
          { text: '还有，仁馨的给药方式很奇怪。不是护士拿药，是一台机器臂直接从药局取药，自动送到病房。', fromMe: false },
          { text: '我查了一下他们的药品库存，存量大约够用五年。这不正常。', fromMe: false },
          { text: '你这次去一定要小心。如果发现什么不对劲，马上离开。', fromMe: false },
          { text: '好的，我知道了。谢谢你刘师姐。', fromMe: true },
        ],
      },
      {
        id: 'msg2',
        clueId: 'clue_wang_sms',
        sender: '王姐（检验科）',
        time: '9月8日 09:15',
        bubbles: [
          { text: '小叶，你的体检结果出来了，各项指标都正常。', fromMe: false },
          { text: '不过你的纤维肌痛……最近发作频率怎么样？', fromMe: false },
          { text: '你那个止痛药带够了吗？仁馨那边可能不方便开药。', fromMe: false },
          { text: '谢谢王姐，药我带了的，暂时不用了。', fromMe: true },
          { text: '你确定？疼起来可不是闹着玩的。', fromMe: false },
          { text: '嗯，我自有安排。', fromMe: true },
        ],
      },
    ];
    const calls = [
      {
        id: 'call1',
        clueId: 'clue_cui_message',
        caller: '崔哲金',
        type: 'voicemail' as const,
        time: '2017年11月6日 09:15',
        duration: '0:15',
        transcript: '小诣，是我。听好——不要相信除警察以外的任何陌生人。疼痛……疼痛可以保护你。记住这句话。',
      },
    ];
    if (chapterClues.length === 0) return null;
    return (
      <motion.div variants={fadeUpItem} className="mb-6">
        <PhoneInteraction messages={messages} calls={calls} collectedIds={collectedIds} onCollect={onCollect} />
      </motion.div>
    );
  }

  // 第3章：地图+档案柜交互
  if (chapterId === 'dossier') {
    const hotspots = [
      { id: 'h1', clueId: 'clue_rooftop_wire', x: 74, y: 82, label: '天台广告牌', description: chapterClues.find(c => c.id === 'clue_rooftop_wire')?.description || '' },
      { id: 'h2', clueId: 'clue_meeting_room_card', x: 24, y: 84, label: '501 会议室', description: chapterClues.find(c => c.id === 'clue_meeting_room_card')?.description || '' },
    ];
    const folders = chapterClues
      .filter(c => !['clue_rooftop_wire', 'clue_meeting_room_card'].includes(c.id))
      .map(c => ({
        id: c.id,
        clueId: c.id,
        title: c.title,
        description: c.description ? c.description.slice(0, 60) + '…' : '',
        tag: c.tags?.includes('案件') || c.tags?.includes('异常') ? '警方' :
             c.tags?.includes('医学') || c.tags?.includes('机制') ? '医疗' :
             c.tags?.includes('物品') ? '物证' : '记录',
      }));
    return (
      <motion.div variants={fadeUpItem} className="mb-6">
        <DossierInteraction hotspots={hotspots} folders={folders} collectedIds={collectedIds} onCollect={onCollect} />
      </motion.div>
    );
  }

  // 默认：线索袋
  const bags = groupCluesBySource(chapterClues);
  return (
    <motion.div variants={fadeUpItem} className="mb-6 space-y-2.5">
      {Array.from(bags.entries()).map(([source, clues]) => (
        <ClueBag
          key={source}
          label={source}
          clues={clues}
          collectedIds={collectedIds}
          isKey={clues.some((c) => isKeyClue(c.id))}
          onCollect={onCollect}
        />
      ))}
    </motion.div>
  );
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
  const { playClick, playSuccess, playError, playAdvance, playClueCollect, playTension, playTypeTick, playRevelation } = useAudio();
  const [tookPillHere, setTookPillHere] = useState(false);
  const [toastClueId, setToastClueId] = useState<string | null>(null);
  const [toastImportance, setToastImportance] = useState<'normal' | 'key'>('normal');
  const [dialogueCharId, setDialogueCharId] = useState<string | null>(null);
  const [profileCharId, setProfileCharId] = useState<string | null>(null);
  const [advanceAnswer, setAdvanceAnswer] = useState('');
  const [advanceError, setAdvanceError] = useState(false);
  const [advancePartial, setAdvancePartial] = useState(false);
  const [showCutscene, setShowCutscene] = useState(false);
  const [showRecap, setShowRecap] = useState(false);

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

  // 开发者后门：Ctrl+Shift+K 跳过当前非文本谜题
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        if (chapter.puzzleId && !solvedPuzzleIds.includes(chapter.puzzleId)) {
          playSuccess();
              solvePuzzle(chapter.puzzleId);
          if (chapter.id === 'deduction') {
            if (hasPainProtection) setEnding('good');
            else setEnding('bad');
          } else if (chapter.nextChapterId) {
            unlockChapter(chapter.nextChapterId);
          }
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [chapter.puzzleId, chapter.id, chapter.nextChapterId, solvedPuzzleIds, hasPainProtection, playSuccess, solvePuzzle, setEnding, unlockChapter]);

  const isSolved = chapter.puzzleId ? solvedPuzzleIds.includes(chapter.puzzleId) : true;
  const canAdvance = isSolved;
  const nextChapter = chapter.nextChapterId ? chapterById(chapter.nextChapterId) : undefined;

  const handleSolve = useCallback((result?: string) => {
    playSuccess();
    playRevelation();
    const el = document.getElementById('puzzle-area');
    if (el) { el.classList.add('success-flash'); setTimeout(() => el.classList.remove('success-flash'), 900); }
    if (chapter.puzzleId) {
      solvePuzzle(chapter.puzzleId);
    }
    if (chapter.id === 'deduction') {
      const correct = result === '袁枝';
      if (correct && hasPainProtection) {
        setEnding('good');
      } else {
        setEnding('bad');
      }
    } else if (chapter.nextChapterId) {
      unlockChapter(chapter.nextChapterId);
      setShowRecap(true);
    }
  }, [chapter.puzzleId, chapter.id, chapter.nextChapterId, hasPainProtection, playSuccess, playRevelation, solvePuzzle, setEnding, unlockChapter]);

  const handleAdvance = () => {
    playAdvance();
    if (chapter.nextChapterId) {
      unlockChapter(chapter.nextChapterId);
      goToChapter(chapter.nextChapterId);
    }
  };

  const handleAnswerAdvance = () => {
    if (!chapter.advanceQuestion) return;
    const userAnswer = advanceAnswer.trim();
    // 开发者后门
    if (userAnswer === '岚天666') {
      playSuccess();
      answerAdvanceQuestion(chapter.id);
      if (chapter.nextChapterId) unlockChapter(chapter.nextChapterId);
      setAdvanceAnswer('');
      return;
    }
    const normalized = userAnswer.toLowerCase();
    const correctAnswers = chapter.advanceQuestion.answer.split('/').map((a) => a.trim().toLowerCase());
    const matched = correctAnswers.some((a) => normalized === a || normalized.includes(a) || a.includes(normalized));
    if (matched) {
      playSuccess();
      answerAdvanceQuestion(chapter.id);
      if (chapter.nextChapterId) unlockChapter(chapter.nextChapterId);
      setAdvanceAnswer('');
      return;
    }
    // 部分正确：方向对了但不够精确
    const partialMatch = correctAnswers.some((a) => {
      const aChars = [...a].filter(c => c !== ' ');
      const uChars = [...normalized].filter(c => c !== ' ');
      const common = aChars.filter(c => uChars.includes(c)).length;
      return common >= Math.max(aChars.length, uChars.length) * 0.4;
    });
    if (partialMatch) {
      playClick();
      setAdvancePartial(true);
      setTimeout(() => setAdvancePartial(false), 2000);
    } else {
      playError();
      recordWrongAttempt();
      setAdvanceError(true);
      setTimeout(() => setAdvanceError(false), 800);
    }
  };

  const handleCollectClue = (cid: string) => {
    playClueCollect();
    collectClue(cid);
    setToastImportance(isKeyClue(cid) ? 'key' : 'normal');
    setToastClueId(cid);
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
      transition={{ duration: DURATION.normal }}
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

      {/* 章节内容 — 错落入场 */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* 章节插画 */}
        <motion.div variants={fadeUpItem} className="mb-4">
          <ChapterIllustration chapterId={chapter.id} />
        </motion.div>

        {/* 章节标题 — 带装饰分隔线 */}
        <motion.div variants={fadeUpItem} className="mb-8 text-center">
          <span
            className="inline-block text-xs uppercase tracking-[0.3em] px-3 py-0.5 rounded-sm mb-3"
            style={{
              background: 'rgba(139,30,30,0.08)',
              border: '1px solid rgba(139,30,30,0.12)',
              color: 'rgba(201,125,125,0.8)',
            }}
          >
            {chapter.title}
          </span>
          <h2 className="font-serif text-3xl text-asylum-paper tracking-wide">{chapter.subtitle}</h2>
          {/* 装饰线 */}
          <div className="mx-auto mt-4 flex items-center gap-2 justify-center">
            <div className="h-px w-8 bg-asylum-accent/30" />
            <div className="h-1 w-1 rotate-45 bg-asylum-accent/50" />
            <div className="h-px w-8 bg-asylum-accent/30" />
          </div>
          {chapter.storyBeats && chapter.storyBeats.length > 0 && (
            <button
              onClick={() => setShowBeats(true)}
              className="mt-3 text-xs text-asylum-muted/60 hover:text-asylum-paper transition-colors"
            >
              ⟳ 回放本章叙事
            </button>
          )}
        </motion.div>

        {/* 叙事文本 — 案卷备注风格 */}
        {chapter.narrative && (
          <motion.div
            variants={fadeUpItem}
            className="narrative-block mb-8 min-h-[4rem] rounded-md p-5 text-base leading-relaxed text-asylum-paper paper-texture relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(24,27,33,0.7) 0%, rgba(20,22,28,0.8) 100%)',
              borderLeft: '3px solid rgba(139,30,30,0.5)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.01), 0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            {/* 打字纸横线格背景 */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(232,228,220,0.5) 23px, rgba(232,228,220,0.5) 24px)',
              }}
            />
            <div className="relative z-[1]">
              <div
                className="mb-2 text-[10px] uppercase tracking-[0.2em]"
                style={{ color: 'rgba(139,30,30,0.6)' }}
              >
                案卷备注
              </div>
              <TypewriterText text={chapter.narrative} speed={20} soundEnabled onTick={playTypeTick} skippable />
            </div>
          </motion.div>
        )}

        {/* 线索区 — 根据章节类型渲染不同的交互界面 */}
        {chapter.clueIds && chapter.clueIds.length > 0 && (
          <ClueSection
            chapterId={chapter.id}
            clueIds={chapter.clueIds}
            collectedIds={collectedClueIds}
            onCollect={handleCollectClue}
          />
        )}

        {/* 音频播放器 */}
        {chapter.audioClues && chapter.audioClues.length > 0 && (
          <motion.div variants={fadeUpItem} className="mb-6 grid gap-3">
            {chapter.audioClues.map((ac, idx) => (
              <AudioPlayer key={idx} title={ac.title} date={ac.date} duration={ac.duration} />
            ))}
          </motion.div>
        )}

        {/* 文档图片 */}
        {chapter.images && chapter.images.length > 0 && (
          <motion.div variants={fadeUpItem} className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {chapter.images.map((src, idx) => (
              <DocumentImage
                key={src}
                src={src}
                alt={`${chapter.subtitle} 资料 ${idx + 1}`}
                caption={`资料 ${idx + 1}`}
                hotspots={chapter.hotspots?.filter((h) => h.imageIndex === idx)}
              />
            ))}
          </motion.div>
        )}

        {/* 本章可访谈角色 */}
        {chapter.interviewCharacterIds && chapter.interviewCharacterIds.length > 0 && (
          <motion.div
            variants={fadeUpItem}
            className="mb-6 rounded border border-asylum-600 bg-asylum-800/40 p-4 paper-texture"
          >
            <div className="mb-3 text-sm font-medium text-asylum-paper">本章可访谈角色</div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {chapter.interviewCharacterIds.map((charId) => {
                const char = characterById(charId);
                if (!char) return null;
                return (
                  <motion.div
                    key={charId}
                    className="flex flex-col gap-1 rounded border border-asylum-700 bg-asylum-800/60 p-2 card-lift"
                    whileHover={{ y: -2 }}
                  >
                    <button
                      onClick={() => setProfileCharId(charId)}
                      className="flex items-center gap-2 rounded p-1 hover:bg-asylum-700/50"
                      title="查看档案"
                    >
                      <CharacterAvatar id={charId} size="sm" />
                      <span className="text-xs text-asylum-paper">{char.name}</span>
                    </button>
                    {char.interviewTopics && char.interviewTopics.length > 0 && (
                      <motion.button
                        onClick={() => setDialogueCharId(charId)}
                        className="rounded bg-asylum-700/80 py-1 text-[10px] text-asylum-paper transition-colors hover:bg-asylum-600"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        访谈
                      </motion.button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* 疼痛/止痛药选择 */}
        {chapter.painChoice && hasPainProtection && !painkillerTakenInChapter && (
          <motion.div
            variants={fadeUpItem}
            className="mb-6 rounded border border-asylum-600 bg-asylum-800/50 p-4 paper-texture"
          >
            <div className="mb-2 text-sm text-asylum-muted">
              疲惫与疼痛同时袭来，你看着包里的止痛药……
            </div>
            {!tookPillHere ? (
              <motion.button
                onClick={handleTakePainkiller}
                className="flex items-center gap-2 rounded bg-asylum-600 px-4 py-2 text-sm transition-colors hover:bg-asylum-500"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <Pill size={16} /> 服用止痛药，好好睡一觉
              </motion.button>
            ) : (
              <div className="text-sm text-asylum-paper">你服下止痛药，疼痛慢慢退去。</div>
            )}
          </motion.div>
        )}

        {/* 谜题区 */}
        {puzzle && (
          <motion.div
            variants={fadeUpItem}
            id="puzzle-area"
            className="mb-6 rounded border border-asylum-600 bg-asylum-800/40 p-5 paper-texture transition-shadow duration-500"
          >
            <div className="mb-2 flex items-center gap-2">
              {isSolved ? (
                <Unlock size={18} className="text-asylum-success" />
              ) : (
                <Lock size={18} className="text-asylum-muted" />
              )}
              <span className="font-medium">{isSolved ? '已解锁' : puzzle.title}</span>
            </div>
            {!isSolved ? (
              <>
                <p className="mb-4 text-sm leading-relaxed text-asylum-muted">{puzzle.description}</p>
                {puzzle.solutionNotes && puzzle.solutionNotes.length > 0 && (
                  <div className="mb-4 text-xs text-asylum-muted/60 italic">
                    💡 解答后将揭示推理链条
                  </div>
                )}
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
              <div className="text-sm text-asylum-success">已完成本章推理，可以进入下一章。</div>
            )}
            {isSolved && puzzle?.solutionNotes && (
              <SolutionNotes notes={puzzle.solutionNotes} />
            )}
          </motion.div>
        )}

        {/* 章节门槛问题 */}
        {chapter.advanceQuestion && !answeredAdvanceQuestionIds.includes(chapter.id) && (
          <motion.div
            variants={fadeUpItem}
            className={`mb-6 rounded border border-asylum-600 bg-asylum-800/50 p-5 paper-texture ${advanceError ? 'animate-shake ring-1 ring-red-500' : ''}`}
          >
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
                className="input-asylum flex-1"
              />
              <motion.button
                onClick={handleAnswerAdvance}
                className="btn-primary text-sm !py-2 !px-5"
              >
                提交
              </motion.button>
            </div>
            <HintPanel
              id={`advance-${chapter.id}`}
              hints={chapter.advanceQuestion.hints}
              compact
            />
            {advanceError && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-sm text-red-400">
                答案不正确，再想想。你可以查看上方提示。
              </motion.div>
            )}
            {advancePartial && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-sm text-asylum-highlight">
                💡 方向对了，再精确一点。
              </motion.div>
            )}
          </motion.div>
        )}

        {/* 前进按钮 */}
        {canAdvance && nextChapter && chapter.id !== 'deduction' && (!chapter.advanceQuestion || answeredAdvanceQuestionIds.includes(chapter.id)) && (
          <motion.div variants={fadeUpItem} className="flex justify-end">
            <motion.button
              onClick={handleAdvance}
              className="btn-primary animate-pulse-glow"
            >
              进入{nextChapter.title} · {nextChapter.subtitle}
              <ChevronRight size={18} />
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      <DiscoveryToast
        open={!!toastClueId}
        title={toastClueId ? clueById(toastClueId)?.title ?? '' : ''}
        subtitle={toastClueId ? clueById(toastClueId)?.source ?? '' : ''}
        importance={toastImportance}
        duration={toastImportance === 'key' ? 4000 : 2500}
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
      {/* 章节回顾 */}
      {showRecap && puzzle?.solutionNotes && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[36] flex items-center justify-center bg-black/70"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card-asylum mx-4 max-w-md p-6 text-center"
          >
            <div className="mb-3 text-xs text-asylum-muted uppercase tracking-widest">本章关键发现</div>
            <div className="space-y-2 text-sm text-asylum-paper/90 leading-relaxed">
              {puzzle.solutionNotes.slice(0, 3).map((note, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.25 }}
                  className="flex items-start gap-2"
                >
                  <span className="text-asylum-accent mt-0.5">•</span>
                  <span>{note}</span>
                </motion.div>
              ))}
            </div>
            <button
              onClick={() => { setShowRecap(false); setShowCutscene(true); }}
              className="btn-primary mt-5 text-sm"
            >
              继续
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* 通关动画演出 */}
      {showCutscene && (
        <ChapterCutscene
          chapterId={chapter.id}
          onDone={() => setShowCutscene(false)}
        />
      )}
    </motion.div>
  );
}
