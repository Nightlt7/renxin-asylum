import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Chapter } from '../types/game';

interface ChapterTransitionProps {
  chapter: Chapter;
}

/** 章节主题配置 — 统一深色底，各章仅图标和强调色不同 */
const chapterThemes: Record<string, {
  accent: string;
  icon: string;
}> = {
  intro:    { accent: '#8b1e1e', icon: '📋' },
  news:     { accent: '#c9a54b', icon: '📰' },
  phone:    { accent: '#4a6741', icon: '📱' },
  dossier:  { accent: '#8b5e1e', icon: '📁' },
  letter:   { accent: '#5a3a6a', icon: '✉️' },
  patients: { accent: '#3a6a5a', icon: '🏥' },
  timeline: { accent: '#8b1e1e', icon: '⏱️' },
  deduction:{ accent: '#8b1e1e', icon: '⚖️' },
  ending:   { accent: '#c9a54b', icon: '📜' },
};

export default function ChapterTransition({ chapter }: ChapterTransitionProps) {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<'in' | 'show' | 'out'>('in');
  const theme = chapterThemes[chapter.id] || chapterThemes.intro;

  useEffect(() => {
    setVisible(true);
    setPhase('in');
    const t1 = setTimeout(() => setPhase('show'), 300);
    const t2 = setTimeout(() => setPhase('out'), 1200);
    const t3 = setTimeout(() => setVisible(false), 1700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [chapter.id]);

  if (!visible) return null;

  return (
    <motion.div
      animate={{ opacity: phase === 'out' ? 0 : 1 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="pointer-events-none fixed inset-0 z-30 flex flex-col items-center justify-center text-center"
      style={{
        backgroundColor: '#0f1115',
        backgroundImage: `
          radial-gradient(ellipse at 50% 40%, ${theme.accent}10 0%, transparent 60%),
          radial-gradient(ellipse at 50% 60%, ${theme.accent}08 0%, transparent 50%)
        `,
      }}
    >
      {/* 四角胶片框 */}
      <motion.div
        className="pointer-events-none absolute"
        style={{ top: 16, left: 16, right: 16, bottom: 16 }}
        animate={{ borderColor: [`${theme.accent}18`, `${theme.accent}0c`, `${theme.accent}18`] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="absolute top-0 left-0 w-12 h-px" style={{ background: `linear-gradient(90deg, ${theme.accent}40, transparent)` }} />
        <div className="absolute top-0 left-0 w-px h-12" style={{ background: `linear-gradient(180deg, ${theme.accent}40, transparent)` }} />
        <div className="absolute top-0 right-0 w-12 h-px" style={{ background: `linear-gradient(270deg, ${theme.accent}40, transparent)` }} />
        <div className="absolute top-0 right-0 w-px h-12" style={{ background: `linear-gradient(180deg, ${theme.accent}40, transparent)` }} />
        <div className="absolute bottom-0 left-0 w-12 h-px" style={{ background: `linear-gradient(90deg, ${theme.accent}40, transparent)` }} />
        <div className="absolute bottom-0 left-0 w-px h-12" style={{ background: `linear-gradient(0deg, ${theme.accent}40, transparent)` }} />
        <div className="absolute bottom-0 right-0 w-12 h-px" style={{ background: `linear-gradient(270deg, ${theme.accent}40, transparent)` }} />
        <div className="absolute bottom-0 right-0 w-px h-12" style={{ background: `linear-gradient(0deg, ${theme.accent}40, transparent)` }} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.94 }}
        animate={phase === 'in' ? { opacity: 1, y: 0, scale: 1 } : phase === 'show' ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="space-y-3"
      >
        {/* 章节图标 + 胶片颗粒闪烁 */}
        <motion.div
          className="text-4xl relative"
          animate={{ opacity: [0.4, 1, 0.4], filter: ['brightness(0.8)', 'brightness(1.1)', 'brightness(0.8)'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {theme.icon}
        </motion.div>

        <div
          className="text-sm uppercase tracking-[0.35em]"
          style={{ color: theme.accent }}
        >
          {chapter.title}
        </div>
        <div className="font-serif text-4xl text-asylum-paper md:text-5xl">
          {chapter.subtitle}
        </div>

        <motion.div
          className="mx-auto h-px"
          style={{ backgroundColor: theme.accent }}
          initial={{ width: 0 }}
          animate={{ width: 120 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
        />

        <motion.div
          className="text-[10px] tracking-[0.5em] text-asylum-muted/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          仁馨精神病院 · 卷宗档案
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
