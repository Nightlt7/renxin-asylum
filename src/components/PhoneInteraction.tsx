import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, Voicemail, ChevronLeft, Wifi, Battery, Signal, Play, User } from 'lucide-react';

interface PhoneMessage {
  id: string;
  clueId: string;
  sender: string;
  time: string;
  /** 多条气泡组成的对话 */
  bubbles: { text: string; fromMe: boolean }[];
}

interface PhoneCall {
  id: string;
  clueId: string;
  caller: string;
  type: 'missed' | 'voicemail';
  time: string;
  duration?: string;
  /** 语音留言的文字稿 */
  transcript?: string;
}

interface PhoneInteractionProps {
  messages: PhoneMessage[];
  calls: PhoneCall[];
  collectedIds: string[];
  onCollect: (clueId: string) => void;
  onAudioPlay?: (callId: string) => void;
}

type PhoneTab = 'messages' | 'calls';

export default function PhoneInteraction({ messages, calls, collectedIds, onCollect, onAudioPlay }: PhoneInteractionProps) {
  const [tab, setTab] = useState<PhoneTab>('messages');
  const [selectedMsg, setSelectedMsg] = useState<PhoneMessage | null>(null);
  const [selectedCall, setSelectedCall] = useState<PhoneCall | null>(null);
  const [playingCallId, setPlayingCallId] = useState<string | null>(null);

  // 进入详情时自动收集线索
  const handleMsgOpen = (msg: PhoneMessage) => {
    setSelectedMsg(msg);
    if (!collectedIds.includes(msg.clueId)) {
      onCollect(msg.clueId);
    }
  };

  const handleCallOpen = (call: PhoneCall) => {
    setSelectedCall(call);
    if (!collectedIds.includes(call.clueId)) {
      onCollect(call.clueId);
    }
  };

  const handlePlay = (callId: string) => {
    setPlayingCallId(callId);
    onAudioPlay?.(callId);
    setTimeout(() => setPlayingCallId(null), 3000);
  };

  const unreadMsgs = messages.filter((m) => !collectedIds.includes(m.clueId)).length;
  const unreadCalls = calls.filter((c) => !collectedIds.includes(c.clueId)).length;

  // ==== 短信对话视图 ====
  if (selectedMsg) {
    const allCollected = collectedIds.includes(selectedMsg.clueId);
    return (
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="mx-auto max-w-md rounded-2xl border border-asylum-600 shadow-2xl overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #0d1117 0%, #111820 100%)' }}
      >
        {/* 对话头部 */}
        <div className="flex items-center gap-3 border-b border-asylum-700/50 px-4 py-3">
          <button onClick={() => setSelectedMsg(null)} className="text-asylum-accent">
            <ChevronLeft size={18} />
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-asylum-700">
            <User size={14} className="text-asylum-muted" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-asylum-paper">{selectedMsg.sender}</div>
            <div className="text-[10px] text-asylum-muted">{selectedMsg.time}</div>
          </div>
          {allCollected && (
            <span className="rounded-full bg-asylum-success/20 px-2 py-0.5 text-[10px] text-asylum-success">
              已记录
            </span>
          )}
        </div>

        {/* 气泡对话 */}
        <div className="flex flex-col gap-2.5 p-4 min-h-[200px]">
          {selectedMsg.bubbles.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`flex ${b.fromMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  b.fromMe
                    ? 'rounded-br-md bg-asylum-accent/80 text-white'
                    : 'rounded-bl-md bg-[#1e2532] text-asylum-paper'
                }`}
              >
                {b.text}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  // ==== 通话详情视图 ====
  if (selectedCall) {
    const allCollected = collectedIds.includes(selectedCall.clueId);
    return (
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="mx-auto max-w-md rounded-2xl border border-asylum-600 shadow-2xl overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #0d1117 0%, #111820 100%)' }}
      >
        <div className="flex items-center gap-3 border-b border-asylum-700/50 px-4 py-3">
          <button onClick={() => setSelectedCall(null)} className="text-asylum-accent">
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium text-asylum-paper">通话详情</span>
        </div>

        <div className="flex flex-col items-center px-6 py-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-asylum-700">
            {selectedCall.type === 'voicemail' ? (
              <Voicemail size={28} className="text-asylum-accent/70" />
            ) : (
              <Phone size={28} className="text-red-400" />
            )}
          </div>
          <div className="text-lg font-medium text-asylum-paper mb-1">{selectedCall.caller}</div>
          <div className="text-sm text-asylum-muted mb-3">{selectedCall.time}</div>

          {selectedCall.type === 'missed' && (
            <div className="rounded-full bg-red-500/10 px-4 py-1.5 text-sm text-red-400">
              未接来电 · 对方已挂断
            </div>
          )}

          {selectedCall.type === 'voicemail' && (
            <>
              <button
                onClick={() => handlePlay(selectedCall.id)}
                className="mb-4 flex items-center gap-2 rounded-full bg-asylum-accent/15 px-5 py-2.5 text-sm text-asylum-accent hover:bg-asylum-accent/25 transition-colors"
              >
                {playingCallId === selectedCall.id ? (
                  <>⏸ 播放中…</>
                ) : (
                  <><Play size={14} /> 播放语音留言 · {selectedCall.duration}</>
                )}
              </button>
              {selectedCall.transcript && (
                <div className="rounded-xl bg-[#1e2532] p-4 text-sm leading-relaxed text-asylum-paper/80 text-left">
                  <div className="mb-1 text-[10px] text-asylum-muted uppercase tracking-wider">语音转文字</div>
                  {selectedCall.transcript}
                </div>
              )}
            </>
          )}

          {!allCollected && (
            <div className="mt-4 text-[11px] text-asylum-muted/60">
              此通话信息已自动记录到线索本
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // ==== 手机主界面 ====
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-md rounded-2xl border border-asylum-600 shadow-2xl overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0d1117 0%, #111820 100%)' }}
    >
      {/* 状态栏 */}
      <div className="flex items-center justify-between px-5 pt-3 pb-1.5 text-[11px] text-asylum-muted">
        <span>09:41</span>
        <div className="flex items-center gap-1.5">
          <Signal size={11} />
          <Wifi size={11} />
          <Battery size={11} />
        </div>
      </div>

      {/* 标题 */}
      <div className="px-5 pb-3">
        <div className="text-lg font-semibold text-asylum-paper">叶臻的手机</div>
        <div className="text-xs text-asylum-muted">
          {unreadMsgs + unreadCalls > 0
            ? `${unreadMsgs + unreadCalls} 条新通知`
            : '全部已查看'}
        </div>
      </div>

      {/* 标签页 */}
      <div className="flex border-b border-asylum-700/50">
        <button
          onClick={() => setTab('messages')}
          className={`relative flex flex-1 items-center justify-center gap-1.5 py-3 text-sm transition-colors ${
            tab === 'messages'
              ? 'text-asylum-paper after:absolute after:bottom-0 after:h-0.5 after:w-12 after:bg-asylum-accent'
              : 'text-asylum-muted hover:text-asylum-paper/70'
          }`}
        >
          <MessageCircle size={15} />
          短信
          {unreadMsgs > 0 && (
            <span className="absolute -top-0.5 right-8 flex h-4 min-w-4 items-center justify-center rounded-full bg-asylum-accent px-1 text-[10px] text-white">
              {unreadMsgs}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('calls')}
          className={`relative flex flex-1 items-center justify-center gap-1.5 py-3 text-sm transition-colors ${
            tab === 'calls'
              ? 'text-asylum-paper after:absolute after:bottom-0 after:h-0.5 after:w-12 after:bg-asylum-accent'
              : 'text-asylum-muted hover:text-asylum-paper/70'
          }`}
        >
          <Phone size={15} />
          通话
          {unreadCalls > 0 && (
            <span className="absolute -top-0.5 right-8 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] text-white">
              {unreadCalls}
            </span>
          )}
        </button>
      </div>

      {/* 列表 */}
      <div className="max-h-[360px] overflow-y-auto">
        <AnimatePresence mode="wait">
          {tab === 'messages' ? (
            <motion.div key="msg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {messages.map((msg) => {
                const collected = collectedIds.includes(msg.clueId);
                const lastBubble = msg.bubbles[msg.bubbles.length - 1];
                return (
                  <button
                    key={msg.id}
                    onClick={() => handleMsgOpen(msg)}
                    className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-asylum-800/30 border-b border-asylum-700/20"
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full flex-none ${
                      collected ? 'bg-asylum-success/10' : 'bg-asylum-accent/10'
                    }`}>
                      <MessageCircle size={17} className={collected ? 'text-asylum-success/60' : 'text-asylum-accent/60'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${collected ? 'text-asylum-muted' : 'text-asylum-paper font-medium'}`}>
                          {msg.sender}
                        </span>
                        <span className="text-[10px] text-asylum-muted">{msg.time}</span>
                      </div>
                      <div className={`text-xs mt-0.5 truncate ${collected ? 'text-asylum-muted/60' : 'text-asylum-paper/60'}`}>
                        {lastBubble?.text.slice(0, 40)}
                      </div>
                    </div>
                    {!collected && (
                      <div className="h-2.5 w-2.5 rounded-full bg-asylum-accent flex-none" />
                    )}
                    {collected && (
                      <span className="text-[10px] text-asylum-muted/40 flex-none">已读</span>
                    )}
                  </button>
                );
              })}
            </motion.div>
          ) : (
            <motion.div key="calls" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {calls.map((call) => {
                const collected = collectedIds.includes(call.clueId);
                return (
                  <button
                    key={call.id}
                    onClick={() => handleCallOpen(call)}
                    className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-asylum-800/30 border-b border-asylum-700/20"
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full flex-none ${
                      collected
                        ? 'bg-asylum-success/10'
                        : call.type === 'missed'
                          ? 'bg-red-500/10'
                          : 'bg-asylum-accent/10'
                    }`}>
                      {call.type === 'voicemail' ? (
                        <Voicemail size={17} className={collected ? 'text-asylum-success/60' : 'text-asylum-accent/60'} />
                      ) : (
                        <Phone size={17} className={collected ? 'text-asylum-success/60' : 'text-red-400'} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${collected ? 'text-asylum-muted' : 'text-asylum-paper font-medium'}`}>
                          {call.caller}
                        </span>
                        <span className="text-[10px] text-asylum-muted">{call.time}</span>
                      </div>
                      <div className={`text-xs mt-0.5 ${
                        call.type === 'missed'
                          ? 'text-red-400'
                          : 'text-asylum-accent/70'
                      }`}>
                        {call.type === 'missed' ? '未接来电' : `语音留言 · ${call.duration}`}
                      </div>
                    </div>
                    {!collected && (
                      <div className={`h-2.5 w-2.5 rounded-full flex-none ${
                        call.type === 'missed' ? 'bg-red-400' : 'bg-asylum-accent'
                      }`} />
                    )}
                    {collected && (
                      <span className="text-[10px] text-asylum-muted/40 flex-none">已读</span>
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 底部提示 */}
      <div className="border-t border-asylum-700/30 px-4 py-2.5 text-center text-[10px] text-asylum-muted/50">
        点击短信或通话记录查看详情 · 查看后自动收集为线索
      </div>
    </motion.div>
  );
}
