import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link2, Trash2, X, Move, Sparkles } from 'lucide-react';
import type { Clue } from '../types/game';
import { findCharacterInText } from '../data/characters';
import CharacterAvatar from './CharacterAvatar';

interface ClueBoardProps {
  collected: Clue[];
  newClueIds?: string[];
  onCharacterClick?: (characterId: string) => void;
  onDialogueClick?: (characterId: string) => void;
}

interface Pos {
  x: number;
  y: number;
  group: string;
}

interface BoardState {
  positions: Record<string, Pos>;
  connections: [string, string][];
}

const STORAGE_KEY = 'renxin-clue-board';

const GROUPS = [
  { id: 'person', label: '人物', tags: ['人物', '身份', '玩家'], color: 'rgba(74,111,165,0.14)' },
  { id: 'case', label: '案件', tags: ['案件', '异常', '新闻', '动机'], color: 'rgba(139,30,30,0.14)' },
  { id: 'place', label: '地点', tags: ['地点'], color: 'rgba(93,122,93,0.14)' },
  { id: 'time', label: '时间', tags: ['时间', '时间线'], color: 'rgba(107,91,139,0.14)' },
  { id: 'mechanism', label: '机制', tags: ['机制', '催眠', '医学'], color: 'rgba(77,110,122,0.14)' },
  { id: 'item', label: '物品', tags: ['物品', '谜题'], color: 'rgba(139,107,58,0.14)' },
  { id: 'other', label: '其他', tags: [], color: 'rgba(128,128,128,0.10)' },
];

const COL_WIDTH = 280;
const CARD_MIN_HEIGHT = 120;
const HEADER_HEIGHT = 44;
const MARGIN = 16;

function defaultGroup(clue: Clue): string {
  for (const g of GROUPS) {
    if (g.tags.some((t) => clue.tags.includes(t as any))) return g.id;
  }
  return 'other';
}

function buildDefaultPositions(clues: Clue[]): Record<string, Pos> {
  const positions: Record<string, Pos> = {};
  const perGroup: Record<string, Clue[]> = {};
  for (const c of clues) {
    const g = defaultGroup(c);
    if (!perGroup[g]) perGroup[g] = [];
    perGroup[g].push(c);
  }
  for (let gi = 0; gi < GROUPS.length; gi++) {
    const g = GROUPS[gi];
    const list = perGroup[g.id] || [];
    list.forEach((c, i) => {
      positions[c.id] = {
        x: gi * COL_WIDTH + MARGIN,
        y: HEADER_HEIGHT + MARGIN + i * (CARD_MIN_HEIGHT + MARGIN),
        group: g.id,
      };
    });
  }
  return positions;
}

function loadState(clues: Clue[]): BoardState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as BoardState;
      // 过滤掉已不存在的线索，补充新增线索的默认位置
      const existing = new Set(clues.map((c) => c.id));
      const positions: Record<string, Pos> = {};
      const defaults = buildDefaultPositions(clues);
      for (const c of clues) {
        positions[c.id] = parsed.positions[c.id] || defaults[c.id];
      }
      const connections = (parsed.connections || []).filter(
        ([a, b]) => existing.has(a) && existing.has(b)
      );
      return { positions, connections };
    }
  } catch {
    // ignore
  }
  return { positions: buildDefaultPositions(clues), connections: [] };
}

function saveState(state: BoardState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export default function ClueBoard({ collected, newClueIds = [], onCharacterClick, onDialogueClick }: ClueBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [state, setState] = useState<BoardState>(() => loadState(collected));
  const [centers, setCenters] = useState<Record<string, { cx: number; cy: number }>>({});
  const [connectMode, setConnectMode] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  // 重新收集线索时补充默认位置
  useEffect(() => {
    setState((prev) => {
      const defaults = buildDefaultPositions(collected);
      const next: Record<string, Pos> = {};
      let changed = false;
      for (const c of collected) {
        if (prev.positions[c.id]) {
          next[c.id] = prev.positions[c.id];
        } else {
          next[c.id] = defaults[c.id];
          changed = true;
        }
      }
      if (!changed) return prev;
      return { ...prev, positions: next };
    });
  }, [collected]);

  // 测量每张卡片中心，用于连线
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const next: Record<string, { cx: number; cy: number }> = {};
    Object.entries(cardRefs.current).forEach(([id, el]) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      next[id] = {
        cx: rect.left - containerRect.left + rect.width / 2,
        cy: rect.top - containerRect.top + rect.height / 2,
      };
    });
    setCenters(next);
  }, [state.positions, collected.length]);

  const moveToGroup = (id: string, groupId: string) => {
    setState((prev) => {
      const gi = GROUPS.findIndex((g) => g.id === groupId);
      const sameGroupCount = Object.values(prev.positions).filter((p) => p.group === groupId).length;
      return {
        ...prev,
        positions: {
          ...prev.positions,
          [id]: {
            x: gi * COL_WIDTH + MARGIN,
            y: HEADER_HEIGHT + MARGIN + sameGroupCount * (CARD_MIN_HEIGHT + MARGIN),
            group: groupId,
          },
        },
      };
    });
  };

  const handleCardClick = (id: string) => {
    if (!connectMode) return;
    if (!selectedId) {
      setSelectedId(id);
      return;
    }
    if (selectedId === id) {
      setSelectedId(null);
      return;
    }
    const a = selectedId;
    const b = id;
    setState((prev) => {
      const exists = prev.connections.some(
        ([x, y]) => (x === a && y === b) || (x === b && y === a)
      );
      if (exists) return prev;
      return { ...prev, connections: [...prev.connections, [a, b]] };
    });
    setSelectedId(null);
  };

  const removeConnection = (idx: number) => {
    setState((prev) => ({
      ...prev,
      connections: prev.connections.filter((_, i) => i !== idx),
    }));
  };

  const clearConnections = () => {
    setState((prev) => ({ ...prev, connections: [] }));
    setSelectedId(null);
  };

  const boardWidth = GROUPS.length * COL_WIDTH + MARGIN * 2;

  // 关联线索智能检测：同标签>=3条线索时，这些线索互相脉冲提示
  const relatedClueIds = new Set<string>();
  const tagCounts = new Map<string, string[]>();
  collected.forEach((c) => c.tags.forEach((t) => {
    if (!tagCounts.has(t)) tagCounts.set(t, []);
    tagCounts.get(t)!.push(c.id);
  }));
  tagCounts.forEach((ids) => { if (ids.length >= 3) ids.forEach((id) => relatedClueIds.add(id)); });

  return (
    <div className="flex h-full flex-col">
      {/* 工具栏 */}
      <div className="flex flex-wrap items-center gap-2 border-b border-asylum-700 bg-asylum-900/50 px-4 py-2">
        <button
          onClick={() => { setConnectMode((v) => !v); setSelectedId(null); }}
          className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition ${
            connectMode ? 'bg-asylum-accent text-white' : 'bg-asylum-700 hover:bg-asylum-600'
          }`}
        >
          <Link2 size={14} />
          {connectMode ? '退出连线' : '连线模式'}
        </button>
        {connectMode && (
          <span className="text-xs text-asylum-muted">
            {selectedId ? '再点另一张线索建立连线' : '点击一张线索开始连线'}
          </span>
        )}
        {state.connections.length > 0 && (
          <button
            onClick={clearConnections}
            className="ml-auto flex items-center gap-1 rounded px-2 py-1 text-xs text-red-400 hover:bg-asylum-800"
          >
            <Trash2 size={14} /> 清除全部连线
          </button>
        )}
      </div>

      {/* 画板 */}
      <div ref={containerRef} className="relative flex-1 overflow-auto bg-asylum-900">
        <div className="relative" style={{ width: boardWidth, minHeight: '100%' }}>
          {/* 分组背景 */}
          {GROUPS.map((g, idx) => (
            <div
              key={g.id}
              className="absolute top-0 bottom-0 border-r border-asylum-700/50"
              style={{
                left: idx * COL_WIDTH,
                width: COL_WIDTH,
                backgroundColor: g.color,
              }}
            >
              <div className="sticky top-0 z-10 border-b border-asylum-700/50 bg-asylum-800/80 px-3 py-2 text-sm font-medium text-asylum-paper backdrop-blur">
                {g.label}
              </div>
            </div>
          ))}

          {/* 连线 SVG — 带绘制动画和光晕 */}
          {state.connections.length > 0 && (
            <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full">
              <defs>
                <filter id="line-glow">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {state.connections.map(([a, b], idx) => {
                const ca = centers[a];
                const cb = centers[b];
                if (!ca || !cb) return null;
                const length = Math.sqrt(
                  Math.pow(cb.cx - ca.cx, 2) + Math.pow(cb.cy - ca.cy, 2)
                );
                return (
                  <g key={`${a}-${b}-${idx}`}>
                    {/* 光晕层 — 脉冲 */}
                    <line
                      x1={ca.cx}
                      y1={ca.cy}
                      x2={cb.cx}
                      y2={cb.cy}
                      stroke="#8b1e1e"
                      strokeWidth={6}
                      opacity={0.12}
                      filter="url(#line-glow)"
                      style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}
                    />
                    {/* 主线 — 带动画绘制 */}
                    <line
                      x1={ca.cx}
                      y1={ca.cy}
                      x2={cb.cx}
                      y2={cb.cy}
                      stroke="#8b1e1e"
                      strokeWidth={2}
                      strokeDasharray={`${length}`}
                      strokeDashoffset={`${length}`}
                      opacity={0.8}
                      style={{
                        animation: 'draw-line 0.6s ease-out forwards',
                      }}
                    />
                  </g>
                );
              })}
            </svg>
          )}

          {/* 连线中点删除按钮 */}
          {state.connections.map(([a, b], idx) => {
            const ca = centers[a];
            const cb = centers[b];
            if (!ca || !cb) return null;
            const mx = (ca.cx + cb.cx) / 2;
            const my = (ca.cy + cb.cy) / 2;
            return (
              <button
                key={`del-${a}-${b}-${idx}`}
                onClick={() => removeConnection(idx)}
                className="absolute z-20 flex h-5 w-5 items-center justify-center rounded-full bg-asylum-800 text-red-400 shadow hover:bg-red-900/50 hover:text-white"
                style={{ left: mx - 10, top: my - 10 }}
                title="删除连线"
              >
                <X size={12} />
              </button>
            );
          })}

          {/* 线索卡片 */}
          {collected.map((clue) => {
            const pos = state.positions[clue.id];
            if (!pos) return null;
            const isSelected = selectedId === clue.id;
            const isNew = newClueIds.includes(clue.id);
            const isRelated = relatedClueIds.has(clue.id);
            const matchedChar = findCharacterInText(`${clue.title} ${clue.source} ${clue.description}`);
            return (
              <motion.div
                key={clue.id}
                ref={(el) => { cardRefs.current[clue.id] = el; }}
                drag
                dragMomentum={false}
                onDragEnd={(_, info) => {
                  setState((prev) => ({
                    ...prev,
                    positions: {
                      ...prev.positions,
                      [clue.id]: {
                        ...prev.positions[clue.id],
                        x: prev.positions[clue.id].x + info.offset.x,
                        y: prev.positions[clue.id].y + info.offset.y,
                      },
                    },
                  }));
                }}
                onClick={() => handleCardClick(clue.id)}
                initial={false}
                animate={{ x: pos.x, y: pos.y }}
                className={`absolute z-10 w-60 cursor-grab rounded border bg-asylum-800 p-3 shadow-lg active:cursor-grabbing ${
                  isSelected
                    ? 'border-asylum-accent ring-2 ring-asylum-accent/50'
                    : isNew
                    ? 'border-asylum-success shadow-[0_0_14px_rgba(74,103,65,0.25)]'
                    : isRelated
                    ? 'border-asylum-accent/30 animate-pulse-glow'
                    : 'border-asylum-600'
                }`}
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  {matchedChar ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCharacterClick?.(matchedChar.id);
                        }}
                        className="flex items-center gap-1 rounded hover:bg-asylum-700"
                        title="查看角色档案"
                      >
                        <CharacterAvatar
                          text={`${clue.title} ${clue.source} ${clue.description}`}
                          size="sm"
                          showName
                        />
                      </button>
                      {onDialogueClick && matchedChar.interviewTopics && matchedChar.interviewTopics.length > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDialogueClick(matchedChar.id);
                          }}
                          className="rounded bg-asylum-700 px-1.5 py-0.5 text-[10px] text-asylum-paper hover:bg-asylum-600"
                          title="访谈"
                        >
                          访谈
                        </button>
                      )}
                    </div>
                  ) : (
                    <CharacterAvatar
                      text={`${clue.title} ${clue.source} ${clue.description}`}
                      size="sm"
                      showName
                    />
                  )}
                  <div className="flex items-center gap-1">
                    {isNew && (
                      <span className="flex items-center gap-0.5 rounded bg-asylum-success/30 px-1 py-0.5 text-[10px] font-medium text-green-200">
                        <Sparkles size={10} />新
                      </span>
                    )}
                    {isRelated && !isNew && (
                      <span className="flex items-center gap-0.5 rounded bg-asylum-accent/10 px-1 py-0.5 text-[10px] text-red-200/70">
                        <Link2 size={10} />关联
                      </span>
                    )}
                    <Move size={14} className="mt-1 text-asylum-muted" />
                  </div>
                </div>
                <div className="text-sm font-medium text-asylum-paper">{clue.title}</div>
                <div className="text-xs text-asylum-muted">{clue.source}</div>
                <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-asylum-paper/80">
                  {clue.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {clue.tags.map((tag) => (
                    <span key={tag} className="rounded bg-asylum-700 px-1 py-0.5 text-[10px]">
                      {tag}
                    </span>
                  ))}
                </div>
                <select
                  value={pos.group}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => moveToGroup(clue.id, e.target.value)}
                  className="mt-2 w-full rounded border border-asylum-600 bg-asylum-900 px-1 py-0.5 text-[10px] outline-none"
                >
                  {GROUPS.map((g) => (
                    <option key={g.id} value={g.id}>{g.label}</option>
                  ))}
                </select>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
