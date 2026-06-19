import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Chapter } from '../types/game';

interface ChapterTransitionProps {
  chapter: Chapter;
}

export default function ChapterTransition({ chapter }: ChapterTransitionProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 1400);
    return () => clearTimeout(timer);
  }, [chapter.id]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="pointer-events-none fixed inset-0 z-30 flex flex-col items-center justify-center bg-asylum-900/95 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <div className="text-sm uppercase tracking-[0.3em] text-asylum-muted">
              {chapter.title}
            </div>
            <div className="font-serif text-4xl text-asylum-paper md:text-5xl">
              {chapter.subtitle}
            </div>
            <div className="mx-auto mt-4 h-px w-24 bg-asylum-accent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
