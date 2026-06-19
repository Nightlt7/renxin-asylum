import { motion } from 'framer-motion';

interface AmbientBackgroundProps {
  chapterId?: string;
}

const palettes: Record<string, string[]> = {
  intro: ['#5a1a1a', '#1a2a4a'],
  news: ['#3a3a3a', '#1a3a5a'],
  phone: ['#1a4a4a', '#3a1a4a'],
  dossier: ['#2a4a2a', '#4a2a1a'],
  letter: ['#4a3a1a', '#1a3a4a'],
  patients: ['#3a1a3a', '#1a4a3a'],
  timeline: ['#4a1a1a', '#1a1a4a'],
  deduction: ['#5a0a0a', '#0a0a0a'],
  ending: ['#1a1a1a', '#4a3a1a'],
};

export default function AmbientBackground({ chapterId = 'intro' }: AmbientBackgroundProps) {
  const colors = palettes[chapterId] || palettes.intro;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* 基础渐变 */}
      <div
        className="absolute inset-0 transition-colors duration-1000"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${colors[0]}40 0%, transparent 50%),
                       radial-gradient(circle at 70% 80%, ${colors[1]}40 0%, transparent 50%),
                       #0f1115`,
        }}
      />

      {/* 漂浮光晕 */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: 300 + i * 100,
            height: 300 + i * 100,
            background: `radial-gradient(circle, ${colors[i % colors.length]}66 0%, transparent 70%)`,
            left: `${20 + i * 25}%`,
            top: `${15 + i * 20}%`,
          }}
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -30, 40, 0],
            opacity: [0.3, 0.6, 0.4, 0.3],
          }}
          transition={{
            duration: 12 + i * 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* 暗角 */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.7) 100%)',
        }}
      />
    </div>
  );
}
