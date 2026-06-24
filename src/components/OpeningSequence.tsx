import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cross } from 'lucide-react';
import { useAudio } from '../hooks/useAudio';

// 当前会话是否已播放过开场（重置后重新播放）
let sessionShown = false;

export default function OpeningSequence() {
  const [visible, setVisible] = useState(!sessionShown);
  const { playAdvance } = useAudio();

  const dismiss = () => {
    sessionShown = true;
    setVisible(false);
  };

  // 安全兜底：10秒后自动消失
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(dismiss, 10000);
    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{ background: '#0f1115' }}
    >
      <motion.div
        className="flex flex-col items-center gap-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <div
          className="flex h-14 w-14 items-center justify-center rounded-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(139,30,30,0.15), rgba(139,30,30,0.03))',
            border: '1px solid rgba(139,30,30,0.2)',
          }}
        >
          <Cross size={26} className="text-asylum-accent/80" />
        </div>
        <div className="space-y-1">
          <h1 className="font-serif text-4xl tracking-[0.08em] text-asylum-paper">仁馨精神病院</h1>
          <div className="text-xs tracking-[0.4em] text-asylum-accent/50">案卷编号 #2016-1106</div>
        </div>
        <div className="h-px w-32 bg-asylum-accent/15" />
        <motion.button
          onClick={() => { playAdvance(); dismiss(); }}
          className="btn-ghost text-sm text-asylum-muted hover:text-asylum-paper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          进入调查
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
