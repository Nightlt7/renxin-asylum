import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, FolderOpen, ChevronRight, X, Check } from 'lucide-react';
import { imagePath } from '../utils/imagePath';

interface HotspotItem {
  id: string;
  clueId: string;
  x: number; // 百分比
  y: number; // 百分比
  label: string;
  description: string;
}

interface FolderItem {
  id: string;
  clueId: string;
  title: string;
  description: string;
  tag: string; // 档案袋标签颜色
}

interface DossierInteractionProps {
  hotspots: HotspotItem[];
  folders: FolderItem[];
  collectedIds: string[];
  onCollect: (clueId: string) => void;
}

export default function DossierInteraction({ hotspots, folders, collectedIds, onCollect }: DossierInteractionProps) {
  const [view, setView] = useState<'map' | 'files'>('map');
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotItem | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<FolderItem | null>(null);

  const collectedCount = [...hotspots, ...folders].filter((h) => collectedIds.includes(h.clueId)).length;
  const totalCount = hotspots.length + folders.length;

  // 地图视图
  if (view === 'map' && !selectedHotspot) {
    const mapImage = imagePath('4-零号研究所平面图.jpg');
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-asylum overflow-hidden"
      >
        {/* 工具栏 */}
        <div className="flex items-center justify-between border-b border-asylum-700/50 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-asylum-accent/70" />
            <span className="text-sm font-medium text-asylum-paper">零号研究所 · 平面图</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-asylum-muted">{collectedCount}/{totalCount}</span>
            <button
              onClick={() => setView('files')}
              className="btn-ghost !text-xs !py-1 !px-2.5"
            >
              <FolderOpen size={14} /> 档案柜
            </button>
          </div>
        </div>

        {/* 地图 */}
        <div className="relative">
          <img src={mapImage} alt="平面图" className="w-full" />
          {hotspots.map((h) => {
            const collected = collectedIds.includes(h.clueId);
            return (
              <button
                key={h.id}
                onClick={() => !collected && setSelectedHotspot(h)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all ${
                  collected ? 'opacity-50 pointer-events-none' : 'hover:scale-125'
                }`}
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
                title={h.label}
              >
                <div className={`relative flex items-center justify-center rounded-full ${
                  collected ? 'bg-asylum-success/30' : 'bg-asylum-accent/40 animate-pulse'
                }`} style={{ width: 28, height: 28 }}>
                  <MapPin size={14} className={collected ? 'text-asylum-success' : 'text-red-200'} />
                </div>
                {!collected && (
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-1.5 py-0.5 text-[10px] text-red-200">
                    {h.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 图例 */}
        <div className="border-t border-asylum-700/50 px-4 py-2 text-[10px] text-asylum-muted">
          🔴 红色标记 = 案发关键地点（点击探索）  ·  点击下方按钮切换至档案柜视图
        </div>
      </motion.div>
    );
  }

  // 热点详情弹窗
  if (selectedHotspot) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-asylum p-4"
      >
        <button onClick={() => setSelectedHotspot(null)} className="btn-ghost mb-3 !text-xs">
          <X size={14} /> 返回地图
        </button>
        <div className="rounded-lg border border-asylum-700/50 bg-asylum-800/40 p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={16} className="text-asylum-accent" />
            <span className="text-base font-medium text-asylum-paper">{selectedHotspot.label}</span>
          </div>
          <p className="text-sm text-asylum-paper/80 leading-relaxed">{selectedHotspot.description}</p>
        </div>
        {!collectedIds.includes(selectedHotspot.clueId) && (
          <button
            onClick={() => { onCollect(selectedHotspot.clueId); setSelectedHotspot(null); }}
            className="btn-primary mt-3 w-full text-sm"
          >
            记录此地点信息到线索本
          </button>
        )}
      </motion.div>
    );
  }

  // 档案柜视图
  if (view === 'files' && !selectedFolder) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-asylum overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-asylum-700/50 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <FolderOpen size={15} className="text-asylum-accent/70" />
            <span className="text-sm font-medium text-asylum-paper">卷宗档案柜</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-asylum-muted">{collectedCount}/{totalCount}</span>
            <button
              onClick={() => setView('map')}
              className="btn-ghost !text-xs !py-1 !px-2.5"
            >
              <MapPin size={14} /> 平面图
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2">
          {folders.map((f) => {
            const collected = collectedIds.includes(f.clueId);
            const tagColors: Record<string, string> = {
              '警方': 'border-l-blue-500/50 bg-blue-500/5',
              '医疗': 'border-l-asylum-success/50 bg-asylum-success/5',
              '物证': 'border-l-yellow-500/50 bg-yellow-500/5',
              '记录': 'border-l-asylum-accent/50 bg-asylum-accent/5',
            };
            const tagStyle = tagColors[f.tag] || 'border-l-asylum-muted/30 bg-asylum-800/30';
            return (
              <button
                key={f.id}
                onClick={() => setSelectedFolder(f)}
                className={`flex items-center gap-3 rounded-lg border border-asylum-700/40 p-3 text-left transition-all hover:bg-asylum-800/40 ${
                  collected ? 'opacity-60' : ''
                } ${tagStyle} border-l-2`}
              >
                <FolderOpen size={18} className={collected ? 'text-asylum-muted' : 'text-asylum-accent/60'} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-asylum-paper">{f.title}</div>
                  <div className="text-[10px] text-asylum-muted truncate">{f.description}</div>
                </div>
                <div className="flex items-center gap-1">
                  {collected ? (
                    <Check size={14} className="text-asylum-success" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-asylum-accent" />
                  )}
                  <ChevronRight size={14} className="text-asylum-muted" />
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // 档案详情
  if (selectedFolder) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-asylum p-4"
      >
        <button onClick={() => setSelectedFolder(null)} className="btn-ghost mb-3 !text-xs">
          <X size={14} /> 返回档案柜
        </button>
        <div className="rounded-lg border border-asylum-700/50 bg-asylum-800/40 p-4">
          <div className="flex items-center gap-2 mb-2">
            <FolderOpen size={16} className="text-asylum-accent/70" />
            <span className="text-base font-medium text-asylum-paper">{selectedFolder.title}</span>
            <span className="tag-asylum">{selectedFolder.tag}</span>
          </div>
          <p className="text-sm text-asylum-paper/80 leading-relaxed">{selectedFolder.description}</p>
        </div>
        {!collectedIds.includes(selectedFolder.clueId) && (
          <button
            onClick={() => { onCollect(selectedFolder.clueId); setSelectedFolder(null); }}
            className="btn-primary mt-3 w-full text-sm"
          >
            将此档案收入线索本
          </button>
        )}
      </motion.div>
    );
  }

  return null;
}
