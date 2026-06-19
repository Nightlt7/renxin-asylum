import { useEffect, useRef, useCallback } from 'react';
import * as Tone from 'tone';
import { useGameStore } from '../store/gameStore';

const chapterMoods: Record<string, { bpm: number; drone: string }> = {
  intro: { bpm: 55, drone: 'A1' },
  news: { bpm: 62, drone: 'G#1' },
  phone: { bpm: 58, drone: 'B1' },
  dossier: { bpm: 52, drone: 'A1' },
  letter: { bpm: 60, drone: 'C2' },
  patients: { bpm: 58, drone: 'A1' },
  timeline: { bpm: 70, drone: 'G1' },
  deduction: { bpm: 78, drone: 'F#1' },
  ending: { bpm: 48, drone: 'A1' },
};

export function useAudio() {
  const { audioEnabled, audioVolume } = useGameStore();
  const started = useRef(false);

  // 背景音乐相关引用
  const bgLoopRef = useRef<Tone.Loop | null>(null);
  const padSynthRef = useRef<Tone.PolySynth | null>(null);
  const melodySynthRef = useRef<Tone.Synth | null>(null);
  const bassSynthRef = useRef<Tone.Synth | null>(null);
  const droneRef = useRef<Tone.Oscillator | null>(null);

  const start = useCallback(async () => {
    if (started.current) return;
    await Tone.start();
    started.current = true;

    // 铺底 Pad：悠长、缓慢和弦，制造压抑氛围
    const pad = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 1.2, decay: 0.5, sustain: 0.6, release: 3 },
    }).toDestination();
    pad.volume.value = -28;
    padSynthRef.current = pad;

    // 旋律音色：略带金属感的长音
    const melody = new Tone.Synth({
      oscillator: { type: 'amsine' },
      envelope: { attack: 0.4, decay: 0.6, sustain: 0.4, release: 1.5 },
    }).toDestination();
    melody.volume.value = -22;
    melodySynthRef.current = melody;

    // 低音贝斯：每小节给一个沉重根音
    const bass = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.05, decay: 0.3, sustain: 0.5, release: 1 },
    }).toDestination();
    bass.volume.value = -20;
    bassSynthRef.current = bass;

    // 持续低频嗡鸣
    const drone = new Tone.Oscillator('A1', 'sine').toDestination();
    drone.volume.value = -32;
    droneRef.current = drone;

    // 悬疑旋律循环：4 小节，每小节 4 拍，BPM 很慢
    // 提供 3 组变奏，避免单调
    const melodyVariations = [
      [
        { time: '0:0', note: 'A4', dur: '2n' },
        { time: '0:2', note: 'G#4', dur: '2n' },
        { time: '1:0', note: 'E4', dur: '2n.' },
        { time: '1:3', note: 'C4', dur: '4n' },
        { time: '2:0', note: 'D4', dur: '2n' },
        { time: '2:2', note: 'F4', dur: '2n' },
        { time: '3:0', note: 'E4', dur: '1n' },
      ],
      [
        { time: '0:0', note: 'C5', dur: '2n' },
        { time: '0:2', note: 'A4', dur: '4n' },
        { time: '0:3', note: 'G#4', dur: '4n' },
        { time: '1:0', note: 'E4', dur: '2n' },
        { time: '1:2', note: 'F4', dur: '2n' },
        { time: '2:0', note: 'D4', dur: '2n.' },
        { time: '2:3', note: 'E4', dur: '4n' },
        { time: '3:0', note: 'A4', dur: '1n' },
      ],
      [
        { time: '0:0', note: 'E4', dur: '2n' },
        { time: '0:2', note: 'F4', dur: '4n' },
        { time: '0:3', note: 'E4', dur: '4n' },
        { time: '1:0', note: 'D4', dur: '2n' },
        { time: '1:2', note: 'C4', dur: '2n' },
        { time: '2:0', note: 'G#4', dur: '2n' },
        { time: '2:2', note: 'A4', dur: '2n' },
        { time: '3:0', note: 'G#4', dur: '1n' },
      ],
    ];

    // 铺底和弦变奏
    const padVariations = [
      [
        { time: '0:0', chord: ['A2', 'E3', 'C4'] },
        { time: '2:0', chord: ['A2', 'G#3', 'E4'] },
      ],
      [
        { time: '0:0', chord: ['A2', 'C4', 'E4'] },
        { time: '1:2', chord: ['D3', 'A3', 'F4'] },
        { time: '2:0', chord: ['E3', 'G#3', 'D4'] },
        { time: '3:2', chord: ['A2', 'E3', 'C4'] },
      ],
      [
        { time: '0:0', chord: ['F2', 'C3', 'A3'] },
        { time: '1:0', chord: ['E2', 'B2', 'G#3'] },
        { time: '2:0', chord: ['D2', 'A2', 'F3'] },
        { time: '3:0', chord: ['A1', 'E2', 'C3'] },
      ],
    ];

    // 低音根音变奏
    const bassVariations = [
      [
        { time: '0:0', note: 'A1' },
        { time: '1:0', note: 'A1' },
        { time: '2:0', note: 'G#1' },
        { time: '3:0', note: 'E1' },
      ],
      [
        { time: '0:0', note: 'A1' },
        { time: '0:2', note: 'C2' },
        { time: '1:0', note: 'E1' },
        { time: '1:2', note: 'G#1' },
        { time: '2:0', note: 'D2' },
        { time: '2:2', note: 'F1' },
        { time: '3:0', note: 'A1' },
      ],
      [
        { time: '0:0', note: 'F1' },
        { time: '1:0', note: 'E1' },
        { time: '2:0', note: 'D1' },
        { time: '3:0', note: 'A0' },
      ],
    ];

    // 随机装饰音/紧张音，每隔几小节触发一次
    const tensionNotes = ['C5', 'C#5', 'D5', 'F5', 'G#5'];

    Tone.Transport.bpm.value = 60;

    let variationIndex = 0;

    const loop = new Tone.Loop((time) => {
      // 每次循环切换变奏（按顺序轮播，比完全随机更音乐化）
      const melodyPattern = melodyVariations[variationIndex % melodyVariations.length];
      const padPattern = padVariations[variationIndex % padVariations.length];
      const bassPattern = bassVariations[variationIndex % bassVariations.length];
      variationIndex += 1;

      // Pad 和弦
      padPattern.forEach((evt) => {
        pad.triggerAttackRelease(evt.chord, '2n', time + Tone.Time(evt.time).toSeconds());
      });
      // 旋律
      melodyPattern.forEach((evt) => {
        melody.triggerAttackRelease(evt.note, evt.dur, time + Tone.Time(evt.time).toSeconds());
      });
      // 低音
      bassPattern.forEach((evt) => {
        bass.triggerAttackRelease(evt.note, '2n', time + Tone.Time(evt.time).toSeconds());
      });

      // 30% 概率在第 3 小节加入一个高紧张度的装饰长音
      if (Math.random() < 0.3) {
        const note = tensionNotes[Math.floor(Math.random() * tensionNotes.length)];
        melody.triggerAttackRelease(note, '1n', time + Tone.Time('2:0').toSeconds());
      }
    }, '4m').start(0);

    bgLoopRef.current = loop;

    if (audioEnabled) {
      Tone.Transport.start();
      drone.start();
    }
  }, [audioEnabled]);

  useEffect(() => {
    if (!started.current) return;
    const vol = Tone.gainToDb(Math.max(0.01, audioVolume));
    Tone.Destination.volume.rampTo(vol, 0.1);
    if (audioEnabled) {
      Tone.Transport.start();
      droneRef.current?.start();
    } else {
      Tone.Transport.pause();
      droneRef.current?.stop();
    }
  }, [audioEnabled, audioVolume]);

  const playClick = useCallback(() => {
    if (!audioEnabled || !started.current) return;
    const synth = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.005, decay: 0.05, sustain: 0, release: 0.05 },
    }).toDestination();
    synth.volume.value = -15;
    synth.triggerAttackRelease('C6', '32n');
  }, [audioEnabled]);

  const playSuccess = useCallback(() => {
    if (!audioEnabled || !started.current) return;
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    synth.volume.value = -12;
    synth.triggerAttackRelease(['C5', 'E5', 'G5'], '8n');
  }, [audioEnabled]);

  const playError = useCallback(() => {
    if (!audioEnabled || !started.current) return;
    const synth = new Tone.Synth({
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.01, decay: 0.25, sustain: 0, release: 0.25 },
    }).toDestination();
    synth.volume.value = -12;
    // 不协和的下行小二度，明确提示错误
    synth.triggerAttackRelease('G2', '16n');
    setTimeout(() => synth.triggerAttackRelease('F#2', '16n'), 120);
  }, [audioEnabled]);

  const playAdvance = useCallback(() => {
    if (!audioEnabled || !started.current) return;
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    synth.volume.value = -14;
    // 进入下一章：上升的悬疑和弦，类似拉开新场景
    synth.triggerAttackRelease(['A3', 'E4', 'C5'], '4n');
  }, [audioEnabled]);

  const playHeartbeat = useCallback(() => {
    if (!audioEnabled || !started.current) return;
    const membrane = new Tone.MembraneSynth().toDestination();
    membrane.volume.value = -10;
    membrane.triggerAttackRelease('C2', '8n');
    setTimeout(() => membrane.triggerAttackRelease('C2', '8n'), 300);
  }, [audioEnabled]);

  const playClueCollect = useCallback(() => {
    if (!audioEnabled || !started.current) return;
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    synth.volume.value = -14;
    synth.triggerAttackRelease(['E5', 'A5'], '16n');
  }, [audioEnabled]);

  const playTension = useCallback(() => {
    if (!audioEnabled || !started.current) return;
    const membrane = new Tone.MembraneSynth().toDestination();
    membrane.volume.value = -16;
    membrane.triggerAttackRelease('C1', '4n');
  }, [audioEnabled]);

  const setMood = useCallback((chapterId: string) => {
    if (!started.current) return;
    const mood = chapterMoods[chapterId] || chapterMoods.intro;
    Tone.Transport.bpm.rampTo(mood.bpm, 2);
    droneRef.current?.frequency.rampTo(mood.drone, 2);
  }, []);

  return { start, playClick, playSuccess, playError, playAdvance, playHeartbeat, playClueCollect, playTension, setMood };
}
