import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface WrongFeedbackProps {
  show: boolean;
  attemptCount: number;
}

const messages = [
  '答案不对，再仔细检查手中的线索。',
  '叶臻感到一阵头痛——疼痛让她保持清醒，也提醒她不要轻信直觉。',
  '崔哲金留下的提示不会骗人，换个角度再读一遍。',
  '你的推理出现偏差，真相似乎更远了。',
  '心底的怀疑在蔓延……再试一次。',
];

export default function WrongFeedback({ show, attemptCount }: WrongFeedbackProps) {
  const text = messages[Math.min(attemptCount, messages.length) - 1] || messages[0];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="flex items-start gap-2 rounded border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-200"
        >
          <AlertTriangle size={16} className="mt-0.5 flex-none text-red-400" />
          <span>{text}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
