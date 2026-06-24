/**
 * 全局动画常量
 * 统一管理 Framer Motion 弹簧参数和过渡时长，确保一致的交互感受
 */

// 弹簧参数
export const SPRING_MODAL = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 24,
};

export const SPRING_TOAST = {
  type: 'spring' as const,
  stiffness: 320,
  damping: 24,
};

export const SPRING_GENTLE = {
  type: 'spring' as const,
  stiffness: 200,
  damping: 20,
};

export const SPRING_SNAPPY = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 28,
};

// 过渡时长（秒）
export const DURATION = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
  chapter: 0.5,
  reveal: 0.8,
  pulse: 1.2,
} as const;

// 错落延迟（秒）
export const STAGGER = {
  micro: 0.03,
  small: 0.05,
  medium: 0.08,
  large: 0.12,
} as const;

// 容器动画变体 — 错落入场
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER.small,
      delayChildren: 0.1,
    },
  },
};

// 子元素动画变体 — 从下方淡入
export const fadeUpItem = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal },
  },
};

// 页面切换变体
export const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: DURATION.normal } },
  exit: { opacity: 0, y: -10, transition: { duration: DURATION.fast } },
};

// 微交互 whileHover/whileTap 预设
export const microHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
};

export const buttonHover = {
  whileHover: { scale: 1.03, transition: { duration: 0.15 } },
  whileTap: { scale: 0.96, transition: { duration: 0.1 } },
};
