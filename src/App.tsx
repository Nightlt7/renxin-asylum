import { useEffect, useState } from 'react';
import { BookOpen, RotateCcw, Volume2, VolumeX, Menu, X, User, Target, Cross } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import { useAudio } from './hooks/useAudio';
import { chapters } from './data/chapters';
import ChapterView from './components/ChapterView';
import ClueNotebook from './components/ClueNotebook';
import EndingView from './components/EndingView';
import Scanlines from './components/Scanlines';
import AmbientBackground from './components/AmbientBackground';
import FilmGrain from './components/effects/FilmGrain';
import DynamicBackground from './components/effects/DynamicBackground';
import OpeningSequence from './components/OpeningSequence';
import PlayerIdentityCard from './components/PlayerIdentityCard';

function App() {
  const {
    currentChapterId,
    unlockedChapterIds,
    collectedClueIds,
    seenClueIds,
    hasViewedIdentityCard,
    ending,
    audioEnabled,
    setAudioEnabled,
    goToChapter,
    resetGame,
    viewIdentityCard,
  } = useGameStore();
  const hasNewClues = collectedClueIds.some((id) => !seenClueIds.includes(id));
  const { start, playClick, setMood } = useAudio();
  const [showNotebook, setShowNotebook] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showIdentity, setShowIdentity] = useState(false);

  const currentChapter = chapters.find((c) => c.id === currentChapterId);

  useEffect(() => {
    const handler = () => {
      start();
      window.removeEventListener('click', handler);
    };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [start]);

  useEffect(() => {
    setMood(ending || currentChapterId);
  }, [ending, currentChapterId, setMood]);

  useEffect(() => {
    if (currentChapterId === 'intro' && !hasViewedIdentityCard) {
      const timer = setTimeout(() => setShowIdentity(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [currentChapterId, hasViewedIdentityCard]);

  const handleNav = (id: string) => {
    playClick();
    goToChapter(id);
    setShowMenu(false);
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-asylum-900 text-asylum-paper">
      <OpeningSequence />
      <AmbientBackground chapterId={ending ? 'ending' : currentChapterId} />
      <DynamicBackground chapterId={ending ? 'ending' : currentChapterId} />
      <FilmGrain />
      <Scanlines />

      {/* ====== 页头 — 案卷档案夹风格 ====== */}
      <header className="relative flex-none select-none">
        {/* 顶部暗红装饰线 */}
        <div
          className="h-0.5 w-full"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(139,30,30,0.6) 15%, rgba(139,30,30,0.8) 50%, rgba(139,30,30,0.6) 85%, transparent 100%)',
          }}
        />

        {/* 主体 */}
        <div
          className="relative flex items-center justify-between px-5 py-2.5"
          style={{
            background: 'linear-gradient(180deg, rgba(20,22,28,0.95) 0%, rgba(24,27,33,0.92) 100%)',
            borderBottom: '1px solid rgba(46,52,61,0.4)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
          }}
        >
          {/* 左侧：菜单 + 标题区 */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => { playClick(); setShowMenu(true); }}
              className="btn-ghost rounded-md p-2"
              aria-label="章节菜单"
            >
              <Menu size={18} />
            </button>

            {/* 标题 — 案卷风格 */}
            <div className="flex items-center gap-2.5">
              {/* 红十字图标 */}
              <div
                className="flex h-7 w-7 items-center justify-center rounded-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(139,30,30,0.3), rgba(139,30,30,0.1))',
                  border: '1px solid rgba(139,30,30,0.25)',
                }}
              >
                <Cross size={14} className="text-asylum-accent" />
              </div>

              {/* 主标题 */}
              <div className="flex flex-col leading-tight">
                <h1 className="font-serif text-base tracking-[0.08em] text-asylum-paper">
                  仁馨精神病院
                </h1>
                <span
                  className="text-[10px] tracking-[0.25em] uppercase"
                  style={{ color: 'rgba(139,30,30,0.7)' }}
                >
                  案卷编号 #2016-1106
                </span>
              </div>
            </div>
          </div>

          {/* 右侧：操作按钮组 */}
          <div className="flex items-center gap-1">
            {/* 身份档案 */}
            <button
              onClick={() => { playClick(); setShowIdentity(true); }}
              className="btn-ghost rounded-md px-3 py-1.5 text-xs"
            >
              <User size={14} />
              <span className="hidden sm:inline ml-1.5">身份档案</span>
            </button>

            {/* 线索本 — 带未读红点 */}
            <button
              onClick={() => { playClick(); setShowNotebook(true); }}
              className="btn-ghost relative rounded-md px-3 py-1.5 text-xs"
            >
              <BookOpen size={14} />
              <span className="hidden sm:inline ml-1.5">线索本</span>
              {hasNewClues && (
                <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                </span>
              )}
            </button>

            {/* 分隔线 */}
            <div className="mx-1 h-5 w-px bg-asylum-700/60" />

            {/* 音频 */}
            <button
              onClick={() => { playClick(); setAudioEnabled(!audioEnabled); }}
              className="btn-ghost rounded-md p-2"
              aria-label={audioEnabled ? '静音' : '开启声音'}
            >
              {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* 重置 */}
            <button
              onClick={() => { playClick(); if (confirm('确定要重置游戏进度吗？')) resetGame(); }}
              className="btn-ghost rounded-md p-2"
              aria-label="重置游戏"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* ====== 当前目标提示条 ====== */}
      {currentChapter?.objective && !ending && (
        <div
          className="flex-none border-b px-5 py-1.5 text-xs backdrop-blur"
          style={{
            background: 'rgba(12,14,18,0.6)',
            borderColor: 'rgba(46,52,61,0.3)',
          }}
        >
          <div className="mx-auto flex max-w-6xl items-center gap-2">
            <Target size={11} className="text-asylum-accent/60" />
            <span className="font-medium text-asylum-paper/50 tracking-wide">当前目标</span>
            <span className="text-asylum-paper/80">{currentChapter.objective}</span>
          </div>
        </div>
      )}

      {/* ====== 主内容区 ====== */}
      <main className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {ending ? (
            <EndingView key="ending" />
          ) : currentChapter ? (
            <ChapterView key={currentChapterId} chapter={currentChapter} />
          ) : (
            <motion.div
              key="not-found"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex h-full flex-col items-center justify-center p-6 text-center"
            >
              <div className="mb-4 text-6xl text-asylum-muted">?</div>
              <h2 className="mb-2 font-serif text-2xl text-asylum-paper">章节未找到</h2>
              <p className="mb-6 text-sm text-asylum-muted">当前章节 ID「{currentChapterId}」不存在</p>
              <button
                onClick={() => { playClick(); goToChapter('intro'); }}
                className="btn-secondary"
              >
                返回序章
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ====== 章节菜单（左侧滑入） ====== */}
      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="fixed left-0 top-0 z-50 h-full w-72 overflow-y-auto shadow-2xl"
              style={{
                background: 'linear-gradient(180deg, #181b21 0%, #14171d 100%)',
                borderRight: '1px solid rgba(139,30,30,0.12)',
              }}
            >
              {/* 菜单头部 */}
              <div
                className="flex items-center justify-between px-4 py-3.5"
                style={{ borderBottom: '1px solid rgba(46,52,61,0.5)' }}
              >
                <div className="flex items-center gap-2">
                  <Cross size={14} className="text-asylum-accent/50" />
                  <span className="font-serif text-base tracking-wide">卷宗目录</span>
                </div>
                <button
                  onClick={() => setShowMenu(false)}
                  className="btn-ghost rounded-md p-1.5"
                >
                  <X size={16} />
                </button>
              </div>

              {/* 菜单列表 */}
              <div className="space-y-0.5 p-2.5">
                {chapters.map((ch, i) => {
                  const unlocked = unlockedChapterIds.includes(ch.id);
                  const isCurrent = currentChapterId === ch.id;
                  return (
                    <motion.button
                      key={ch.id}
                      disabled={!unlocked}
                      onClick={() => unlocked && handleNav(ch.id)}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`w-full rounded-md px-3 py-2.5 text-left transition-all ${
                        unlocked
                          ? isCurrent
                            ? 'relative border border-asylum-accent/20'
                            : 'hover:bg-asylum-800/60'
                          : 'cursor-not-allowed text-asylum-muted/40'
                      }`}
                      style={isCurrent ? {
                        background: 'linear-gradient(135deg, rgba(139,30,30,0.1), rgba(139,30,30,0.03))',
                      } : undefined}
                    >
                      <div className="flex items-center gap-2">
                        {/* 当前章节指示点 */}
                        <div
                          className={`h-1.5 w-1.5 rounded-full flex-none ${
                            isCurrent ? 'bg-asylum-accent' : unlocked ? 'bg-asylum-600' : 'bg-asylum-700'
                          }`}
                        />
                        <div>
                          <div className={`text-sm ${isCurrent ? 'font-medium text-asylum-paper' : unlocked ? 'text-asylum-paper/80' : ''}`}>
                            {ch.title}
                          </div>
                          <div className={`text-xs mt-0.5 ${isCurrent ? 'text-asylum-accent/70' : unlocked ? 'text-asylum-muted/70' : 'text-asylum-muted/40'}`}>
                            {ch.subtitle}
                          </div>
                        </div>
                      </div>
                      {!unlocked && (
                        <span className="text-[10px] text-asylum-muted/30">🔒</span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* 菜单底部装饰 */}
              <div
                className="absolute bottom-0 left-0 w-full h-12 pointer-events-none"
                style={{
                  background: 'linear-gradient(0deg, rgba(20,23,29,1) 0%, transparent 100%)',
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 线索本抽屉 */}
      <ClueNotebook open={showNotebook} onClose={() => setShowNotebook(false)} />

      {/* 角色档案弹窗 */}
      <PlayerIdentityCard
        open={showIdentity}
        onClose={() => {
          setShowIdentity(false);
          viewIdentityCard();
        }}
      />

      {/* 作者水印 */}
      <motion.div
        className="pointer-events-none fixed bottom-4 right-4 z-50 select-none text-xs tracking-[0.3em]"
        style={{ color: 'rgba(138,145,153,0.2)' }}
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        岚天 · 作品
      </motion.div>
    </div>
  );
}

export default App;
