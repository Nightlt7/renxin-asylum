import { motion } from 'framer-motion';

interface ChapterIllustrationProps {
  chapterId: string;
}

const sharedBg = { fill: '#181b21' };

export default function ChapterIllustration({ chapterId }: ChapterIllustrationProps) {
  switch (chapterId) {
    case 'intro':
      return (
        <svg viewBox="0 0 800 200" className="h-40 w-full rounded border border-asylum-700 bg-asylum-900/50">
          <rect x="0" y="0" width="800" height="200" {...sharedBg} />
          {/* 窗户月光 */}
          <rect x="60" y="30" width="120" height="100" fill="#0f1115" stroke="#2e343d" strokeWidth="2" />
          <circle cx="120" cy="60" r="25" fill="#e8e4dc" opacity="0.15" />
          {/* 桌子 */}
          <rect x="40" y="140" width="300" height="8" fill="#3e4651" />
          <rect x="70" y="148" width="12" height="42" fill="#2e343d" />
          <rect x="290" y="148" width="12" height="42" fill="#2e343d" />
          {/* 信封 */}
          <polygon points="180,110 230,110 230,145 180,145" fill="#e8e4dc" opacity="0.9" />
          <polygon points="180,110 205,128 230,110" fill="#c4c0b8" />
          {/* 药瓶 */}
          <rect x="260" y="115" width="24" height="30" rx="3" fill="#8b1e1e" opacity="0.8" />
          <rect x="264" y="110" width="16" height="5" fill="#e8e4dc" opacity="0.7" />
          {/* 台灯 */}
          <path d="M340 148 L360 100 L380 148" stroke="#5a6370" strokeWidth="4" fill="none" />
          <path d="M360 100 L340 80 L380 80 Z" fill="#e8e4dc" opacity="0.25" />
          <motion.circle
            cx="360" cy="110" r="40" fill="url(#lampGlow)" opacity="0.2"
            animate={{ opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <defs>
            <radialGradient id="lampGlow">
              <stop offset="0%" stopColor="#e8e4dc" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
        </svg>
      );

    case 'news':
      return (
        <svg viewBox="0 0 800 200" className="h-40 w-full rounded border border-asylum-700 bg-asylum-900/50">
          <rect x="0" y="0" width="800" height="200" {...sharedBg} />
          {/* 报纸 */}
          <rect x="200" y="30" width="400" height="140" fill="#e8e4dc" opacity="0.9" />
          <rect x="220" y="45" width="360" height="18" fill="#1a1a1a" />
          <text x="240" y="58" fill="#e8e4dc" fontSize="12" fontFamily="serif">香北都市报 · 仁馨精神病院纵火致死案一周年</text>
          {/* 标题栏 */}
          <rect x="220" y="72" width="220" height="12" fill="#3e4651" />
          <rect x="220" y="90" width="360" height="6" fill="#5a6370" />
          <rect x="220" y="102" width="340" height="6" fill="#5a6370" />
          <rect x="220" y="114" width="350" height="6" fill="#5a6370" />
          {/* 照片占位 */}
          <rect x="460" y="80" width="120" height="70" fill="#2e343d" />
          <rect x="470" y="90" width="100" height="50" fill="#1a1a1a" />
        </svg>
      );

    case 'phone':
      return (
        <svg viewBox="0 0 800 200" className="h-40 w-full rounded border border-asylum-700 bg-asylum-900/50">
          <rect x="0" y="0" width="800" height="200" {...sharedBg} />
          {/* 手机 */}
          <rect x="330" y="20" width="140" height="160" rx="14" fill="#0f1115" stroke="#3e4651" strokeWidth="2" />
          <rect x="340" y="35" width="120" height="130" fill="#1a2332" />
          {/* 短信气泡 */}
          <rect x="350" y="50" width="80" height="22" rx="8" fill="#2e343d" />
          <rect x="370" y="80" width="80" height="22" rx="8" fill="#1a2e1a" />
          <rect x="350" y="110" width="70" height="22" rx="8" fill="#2e343d" />
          {/* 音频图标 */}
          <circle cx="360" cy="145" r="8" fill="#3e4651" />
          <path d="M357 145 L363 145 M360 142 L360 148" stroke="#e8e4dc" strokeWidth="1.5" />
        </svg>
      );

    case 'dossier':
      return (
        <svg viewBox="0 0 800 200" className="h-40 w-full rounded border border-asylum-700 bg-asylum-900/50">
          <rect x="0" y="0" width="800" height="200" {...sharedBg} />
          {/* 文件柜 */}
          <rect x="250" y="30" width="300" height="140" fill="#2e343d" stroke="#3e4651" strokeWidth="2" />
          <rect x="270" y="45" width="260" height="28" fill="#3e4651" />
          <rect x="270" y="86" width="260" height="28" fill="#3e4651" />
          <rect x="270" y="127" width="260" height="28" fill="#3e4651" />
          {/* 抽屉把手 */}
          <rect x="300" y="55" width="30" height="6" fill="#5a6370" />
          <rect x="300" y="96" width="30" height="6" fill="#5a6370" />
          <rect x="300" y="137" width="30" height="6" fill="#5a6370" />
          {/* 散落的纸张 */}
          <rect x="200" y="120" width="60" height="45" fill="#e8e4dc" opacity="0.8" transform="rotate(-12 230 142)" />
          <rect x="540" y="110" width="60" height="45" fill="#e8e4dc" opacity="0.8" transform="rotate(8 570 132)" />
          {/* 放大镜 */}
          <circle cx="620" cy="60" r="22" stroke="#5a6370" strokeWidth="4" fill="none" />
          <line x1="636" y1="76" x2="660" y2="100" stroke="#5a6370" strokeWidth="4" />
        </svg>
      );

    case 'letter':
      return (
        <svg viewBox="0 0 800 200" className="h-40 w-full rounded border border-asylum-700 bg-asylum-900/50">
          <rect x="0" y="0" width="800" height="200" {...sharedBg} />
          {/* 信封 */}
          <rect x="220" y="60" width="120" height="80" fill="#e8e4dc" opacity="0.9" />
          <polygon points="220,60 280,100 340,60" fill="#c4c0b8" />
          {/* 明信片 */}
          <rect x="420" y="50" width="140" height="90" fill="#e8e4dc" opacity="0.95" />
          {/* 蛇杖 */}
          <line x1="490" y1="70" x2="490" y2="120" stroke="#8b1e1e" strokeWidth="3" />
          <path d="M470 85 Q490 75 510 85" stroke="#1a1a1a" strokeWidth="2" fill="none" />
          <circle cx="490" cy="95" r="3" fill="#1a1a1a" />
          {/* 摩尔斯点划 */}
          <text x="430" y="140" fill="#1a1a1a" fontSize="10" fontFamily="monospace">· · · — — — · · ·</text>
        </svg>
      );

    case 'patients':
      return (
        <svg viewBox="0 0 800 200" className="h-40 w-full rounded border border-asylum-700 bg-asylum-900/50">
          <rect x="0" y="0" width="800" height="200" {...sharedBg} />
          {/* 病房墙 */}
          <rect x="100" y="20" width="600" height="160" fill="#1a2332" stroke="#2e343d" strokeWidth="2" />
          {/* 三张床 */}
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${180 + i * 180}, 80)`}>
              <rect x="0" y="20" width="100" height="8" fill="#3e4651" />
              <rect x="0" y="28" width="100" height="35" fill="#2e343d" />
              <rect x="90" y="0" width="10" height="63" fill="#3e4651" />
              <circle cx="50" cy="-5" r="12" fill="#3e4651" />
            </g>
          ))}
          {/* 顶灯 */}
          <motion.rect
            x="360" y="10" width="80" height="8" fill="#e8e4dc" opacity="0.3"
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </svg>
      );

    case 'timeline':
      return (
        <svg viewBox="0 0 800 200" className="h-40 w-full rounded border border-asylum-700 bg-asylum-900/50">
          <rect x="0" y="0" width="800" height="200" {...sharedBg} />
          {/* 时间线 */}
          <line x1="80" y1="100" x2="720" y2="100" stroke="#3e4651" strokeWidth="2" />
          {[120, 250, 380, 510, 640].map((x, i) => (
            <g key={i}>
              <circle cx={x} cy="100" r="6" fill="#5a6370" />
              <rect x={x - 30} y={i % 2 === 0 ? 55 : 125} width="60" height="24" rx="4" fill="#2e343d" />
              <line x1={x} y1="100" x2={x} y2={i % 2 === 0 ? 79 : 121} stroke="#5a6370" strokeWidth="1" />
            </g>
          ))}
          {/* 时钟背景 */}
          <circle cx="400" cy="100" r="60" stroke="#2e343d" strokeWidth="2" fill="none" opacity="0.5" />
          <line x1="400" y1="100" x2="400" y2="70" stroke="#5a6370" strokeWidth="2" />
          <line x1="400" y1="100" x2="425" y2="100" stroke="#5a6370" strokeWidth="2" />
        </svg>
      );

    case 'deduction':
      return (
        <svg viewBox="0 0 800 200" className="h-40 w-full rounded border border-asylum-700 bg-asylum-900/50">
          <rect x="0" y="0" width="800" height="200" {...sharedBg} />
          {/* 城市天际线 */}
          <polygon points="0,200 0,120 60,120 60,80 120,80 120,140 180,140 180,60 260,60 260,200" fill="#0f1115" />
          <polygon points="260,200 260,90 340,90 340,130 420,130 420,70 500,70 500,200" fill="#14161c" />
          <polygon points="500,200 500,100 580,100 580,50 660,50 660,110 740,110 740,80 800,80 800,200" fill="#0f1115" />
          {/* 天台边缘 */}
          <rect x="0" y="170" width="800" height="30" fill="#2e343d" />
          <rect x="0" y="160" width="800" height="10" fill="#5a6370" />
          {/* 人物剪影 */}
          <circle cx="400" cy="130" r="12" fill="#1a1a1a" />
          <rect x="388" y="142" width="24" height="30" fill="#1a1a1a" />
          {/* 紧张红光 */}
          <motion.circle
            cx="400" cy="100" r="80" fill="url(#redGlow)" opacity="0.15"
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <defs>
            <radialGradient id="redGlow">
              <stop offset="0%" stopColor="#8b1e1e" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
        </svg>
      );

    case 'ending':
      return (
        <svg viewBox="0 0 800 200" className="h-40 w-full rounded border border-asylum-700 bg-asylum-900/50">
          <rect x="0" y="0" width="800" height="200" {...sharedBg} />
          {/* 天平 */}
          <line x1="400" y1="50" x2="400" y2="140" stroke="#5a6370" strokeWidth="3" />
          <line x1="340" y1="80" x2="460" y2="80" stroke="#5a6370" strokeWidth="3" />
          <polygon points="340,80 330,110 350,110" fill="#2e343d" />
          <polygon points="460,80 450,110 470,110" fill="#2e343d" />
          {/* 底座 */}
          <polygon points="380,140 420,140 410,160 390,160" fill="#3e4651" />
          {/* 光 */}
          <motion.circle
            cx="400" cy="80" r="60" fill="url(#goldGlow)" opacity="0.1"
            animate={{ opacity: [0.08, 0.15, 0.08] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <defs>
            <radialGradient id="goldGlow">
              <stop offset="0%" stopColor="#e8e4dc" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
        </svg>
      );

    default:
      return null;
  }
}
