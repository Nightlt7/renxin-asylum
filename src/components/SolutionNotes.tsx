import { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SolutionNotesProps {
  notes?: string[];
}

export default function SolutionNotes({ notes }: SolutionNotesProps) {
  const [open, setOpen] = useState(false);
  if (!notes || notes.length === 0) return null;

  return (
    <div className="mt-4 rounded border border-asylum-600 bg-asylum-900/30">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-asylum-paper hover:bg-asylum-800/50"
      >
        <span className="flex items-center gap-2">
          <Lightbulb size={16} className="text-yellow-500" />
          推理回顾
        </span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 border-t border-asylum-700 p-4">
              {notes.map((note, idx) => (
                <div
                  key={idx}
                  className="flex gap-2 text-sm leading-relaxed text-asylum-paper/90"
                >
                  <span className="flex-none text-asylum-accent">{idx + 1}.</span>
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
