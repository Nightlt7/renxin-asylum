import { useEffect } from 'react';
import { FileText, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SPRING_TOAST } from '../utils/animation';

interface DiscoveryToastProps {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  duration?: number;
  /** 线索重要性：normal 为绿色普通提示，key 为红色关键线索提示 */
  importance?: 'normal' | 'key';
}

export default function DiscoveryToast({
  open,
  title,
  subtitle,
  onClose,
  duration = 2500,
  importance = 'normal',
}: DiscoveryToastProps) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  const isKey = importance === 'key';

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 相机闪光效果 — 关键线索时屏幕闪白 */}
          {isKey && (
            <motion.div
              initial={{ opacity: 0.25 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="pointer-events-none fixed inset-0 z-[55] bg-white"
            />
          )}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={SPRING_TOAST}
            className={`pointer-events-auto fixed bottom-6 right-6 z-50 flex max-w-xs items-start gap-3 rounded-lg px-4 py-3 shadow-2xl backdrop-blur ${
              isKey
                ? 'border border-asylum-accent/60 bg-asylum-accent/20 text-red-50'
                : 'border border-asylum-success/40 bg-asylum-success/15 text-green-50'
            }`}
          >
          <div className={`mt-0.5 rounded-full p-1.5 ${
            isKey ? 'bg-asylum-accent/40' : 'bg-asylum-success/30'
          }`}>
            {isKey ? (
              <AlertTriangle size={18} className="text-red-200" />
            ) : (
              <FileText size={18} className="text-asylum-success" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium">
                {isKey ? '关键线索' : '发现线索'}
              </span>
              {isKey && (
                <motion.span
                  className="rounded-full bg-asylum-accent/60 px-1.5 text-[10px] font-bold text-red-100"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  重要
                </motion.span>
              )}
            </div>
            <div className={`text-base font-semibold ${isKey ? 'text-red-100' : 'text-green-100/80'}`}>
              {title}
            </div>
            {subtitle && (
              <div className={`mt-0.5 text-xs ${isKey ? 'text-red-200/70' : 'text-green-200/80'}`}>
                {subtitle}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className={`rounded p-1 transition-colors ${
              isKey
                ? 'text-red-200/70 hover:bg-red-900/30 hover:text-red-100'
                : 'text-green-200/70 hover:bg-green-900/30 hover:text-green-100'
            }`}
            aria-label="关闭提示"
          >
            <X size={16} />
          </button>
        </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
