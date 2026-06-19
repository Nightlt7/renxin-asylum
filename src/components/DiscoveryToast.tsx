import { useEffect } from 'react';
import { FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DiscoveryToastProps {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  duration?: number;
}

export default function DiscoveryToast({
  open,
  title,
  subtitle,
  onClose,
  duration = 2500,
}: DiscoveryToastProps) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          className="pointer-events-auto fixed bottom-6 right-6 z-50 flex max-w-xs items-start gap-3 rounded-lg border border-green-700/40 bg-green-900/90 px-4 py-3 text-green-50 shadow-2xl backdrop-blur"
        >
          <div className="mt-0.5 rounded-full bg-green-700/50 p-1.5">
            <FileText size={18} className="text-green-200" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">发现线索</div>
            <div className="text-base font-semibold text-green-100">{title}</div>
            {subtitle && (
              <div className="mt-0.5 text-xs text-green-200/80">{subtitle}</div>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-green-200/70 hover:bg-green-800/50 hover:text-green-100"
            aria-label="关闭提示"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
