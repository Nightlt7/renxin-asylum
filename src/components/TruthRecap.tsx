import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Flame, FileQuestion, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { truth, timeline } from '../data/truth';

export default function TruthRecap() {
  const [activeTab, setActiveTab] = useState<'story' | 'events' | 'timeline' | 'qa'>('story');
  const [openQa, setOpenQa] = useState<Record<string, boolean>>({});

  const tabs = [
    { id: 'story' as const, label: '真相解析', icon: BookOpen },
    { id: 'events' as const, label: '案发夜事件链', icon: Flame },
    { id: 'timeline' as const, label: '完整时间线', icon: Clock },
    { id: 'qa' as const, label: '九题复盘', icon: FileQuestion },
  ];

  const qaList = [
    { q: 'Q1 案发前夜何秀文听到几个人起夜？', a: truth.q9.q1_footsteps },
    { q: 'Q2 罗昆山与柴靖分别做了什么？', a: truth.q9.q2_luo_chai },
    { q: 'Q3 游戏机视频内容是什么？目的是？', a: truth.q9.q3_video },
    { q: 'Q4 真凶是谁？', a: truth.q9.q4_culprit },
    { q: 'Q5 隐藏物品是什么？藏在哪？', a: `${truth.q9.q5_hidden.item}，位于${truth.q9.q5_hidden.location}。提示：${truth.q9.q5_hidden.hint}` },
    {
      q: 'Q6 七名病人的高功能/术后状态',
      a: truth.q9.q6_highFunctions.map((p) => `• ${p.name}：${p.highFunction}`).join('\n'),
    },
    { q: 'Q7 为什么崔哲金不是自杀？', a: truth.q9.q7_whyOnlyCui },
    {
      q: 'Q8 谁有催眠能力？受害者有谁？',
      a: `催眠者：${truth.q9.q8_hypnosis.who}\n受害者：${truth.q9.q8_hypnosis.victims.join('、')}`,
    },
    {
      q: 'Q9 七名病人的病症',
      a: truth.q9.q9_illnesses.map((p) => `• ${p.name}：${p.illness}（${p.tag}）`).join('\n'),
    },
  ];

  return (
    <div className="mt-6 w-full rounded border border-asylum-600 bg-asylum-800/50">
      <div className="border-b border-asylum-700">
        <div className="flex flex-wrap gap-1 p-2">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-sm transition ${
                  active
                    ? 'bg-asylum-600 text-asylum-paper'
                    : 'text-asylum-muted hover:bg-asylum-700'
                }`}
              >
                <Icon size={14} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-h-[60vh] overflow-y-auto p-4">
        {activeTab === 'story' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <section>
              <h3 className="mb-2 text-sm font-bold text-asylum-accent">故事梗概</h3>
              <p className="text-sm leading-relaxed text-asylum-paper">{truth.storyAnalysis.summary}</p>
            </section>

            <section>
              <h3 className="mb-2 text-sm font-bold text-asylum-accent">动机链条</h3>
              <div className="space-y-2">
                {truth.storyAnalysis.motiveChain.map((item, idx) => (
                  <div key={idx} className="rounded border-l-4 border-asylum-accent bg-asylum-900/40 p-3">
                    <div className="mb-1 text-sm font-medium text-asylum-paper">{item.who}</div>
                    <div className="text-sm leading-relaxed text-asylum-muted">{item.motive}</div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-sm font-bold text-asylum-accent">核心诡计</h3>
              <p className="text-sm leading-relaxed text-asylum-paper">{truth.storyAnalysis.coreTrick}</p>
            </section>

            <section>
              <h3 className="mb-2 text-sm font-bold text-asylum-accent">关键人物关系</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {truth.storyAnalysis.relationships.map((item, idx) => (
                  <div key={idx} className="rounded border border-asylum-700 bg-asylum-900/40 p-3">
                    <div className="mb-1 text-sm font-medium text-asylum-paper">{item.pair}</div>
                    <div className="text-xs leading-relaxed text-asylum-muted">{item.desc}</div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-sm font-bold text-asylum-accent">来因去果</h3>
              <div className="space-y-2">
                {truth.storyAnalysis.causeAndEffect.map((item, idx) => (
                  <div key={idx} className="flex gap-3 text-sm">
                    <div className="flex-none text-asylum-accent">→</div>
                    <div className="text-asylum-paper">
                      <span className="font-medium">因：</span>
                      <span className="text-asylum-muted">{item.cause}</span>
                      <br />
                      <span className="font-medium">果：</span>
                      <span className="text-asylum-muted">{item.effect}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'events' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {truth.nightEvents.map((evt, idx) => (
              <div key={idx} className="flex gap-3 rounded border-l-4 border-asylum-accent bg-asylum-900/40 p-3">
                <div className="flex-none pt-0.5 text-sm font-bold text-asylum-accent">{idx + 1}</div>
                <div className="text-sm leading-relaxed text-asylum-paper">{evt}</div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'timeline' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {timeline.map((item, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex-none pt-0.5 text-xs font-bold text-asylum-accent">{item.date}</div>
                <div className="text-sm leading-relaxed text-asylum-paper">{item.event}</div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'qa' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            {qaList.map((item, idx) => {
              const open = openQa[idx];
              return (
                <div key={idx} className="rounded border border-asylum-700 bg-asylum-900/40">
                  <button
                    onClick={() => setOpenQa((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-asylum-paper hover:bg-asylum-800"
                  >
                    {item.q}
                    {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="overflow-hidden border-t border-asylum-700"
                    >
                      <pre className="whitespace-pre-wrap p-3 text-sm leading-relaxed text-asylum-muted">
                        {item.a}
                      </pre>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
