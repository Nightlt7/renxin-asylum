import { useEffect, useRef } from 'react';

interface DynamicBackgroundProps {
  chapterId: string;
}

/** 场景模式 */
type SceneMode = 'rain' | 'corridor' | 'truth' | 'default'

function getSceneMode(chapterId: string): SceneMode {
  switch (chapterId) {
    case 'intro':
    case 'phone':
      return 'rain';
    case 'dossier':
    case 'patients':
      return 'corridor';
    case 'timeline':
    case 'deduction':
      return 'truth';
    default:
      return 'default';
  }
}

/** 雨夜效果 */
class RainScene {
  private ctx: CanvasRenderingContext2D;
  private drops: { x: number; y: number; speed: number; length: number; opacity: number }[] = [];
  private lightningAlpha = 0;
  private lightningTimer = 0;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.drops = Array.from({ length: 80 }, () => ({
      x: Math.random() * ctx.canvas.width,
      y: Math.random() * ctx.canvas.height,
      speed: 4 + Math.random() * 8,
      length: 8 + Math.random() * 16,
      opacity: 0.1 + Math.random() * 0.25,
    }));
  }

  resize(w: number, h: number) {
    this.drops.forEach((d) => {
      d.x = Math.random() * w;
      d.y = Math.random() * h;
    });
  }

  update(dt: number) {
    const { canvas } = this.ctx;
    for (const d of this.drops) {
      d.y += d.speed * dt * 60;
      if (d.y > canvas.height) {
        d.y = -d.length;
        d.x = Math.random() * canvas.width;
      }
    }
    // 闪电
    this.lightningTimer -= dt;
    if (this.lightningTimer <= 0) {
      if (Math.random() < 0.03) {
        this.lightningAlpha = 0.06 + Math.random() * 0.08;
        this.lightningTimer = 0.08 + Math.random() * 0.15;
      } else {
        this.lightningAlpha = 0;
        this.lightningTimer = 1 + Math.random() * 4;
      }
    } else if (this.lightningAlpha > 0) {
      this.lightningAlpha *= 0.85;
    }
  }

  draw() {
    const ctx = this.ctx;
    const { canvas } = ctx;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 闪电闪光
    if (this.lightningAlpha > 0.001) {
      ctx.fillStyle = `rgba(180,200,230,${this.lightningAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 雨滴
    ctx.strokeStyle = 'rgba(180,200,220,0.4)';
    ctx.lineWidth = 1;
    for (const d of this.drops) {
      ctx.globalAlpha = d.opacity;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - 1, d.y + d.length);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // 底部雾气
    const fogGrad = ctx.createLinearGradient(0, canvas.height * 0.7, 0, canvas.height);
    fogGrad.addColorStop(0, 'rgba(15,17,21,0)');
    fogGrad.addColorStop(1, 'rgba(15,17,21,0.6)');
    ctx.fillStyle = fogGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

/** 走廊灯光效果 */
class CorridorScene {
  private ctx: CanvasRenderingContext2D;
  private lights: { x: number; y: number; radius: number; baseAlpha: number; phase: number; speed: number }[] = [];
  private flickerGlobal = 0;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.lights = Array.from({ length: 5 }, (_, i) => ({
      x: (ctx.canvas.width / 6) * (i + 0.5),
      y: ctx.canvas.height * (0.2 + Math.random() * 0.3),
      radius: 60 + Math.random() * 80,
      baseAlpha: 0.03 + Math.random() * 0.04,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.5,
    }));
  }

  resize(w: number, h: number) {
    this.lights.forEach((l, i) => {
      l.x = (w / 6) * (i + 0.5);
      l.y = h * (0.2 + Math.random() * 0.3);
    });
  }

  update(dt: number) {
    this.flickerGlobal += dt;
    // 全局荧光灯闪烁
    const flicker = Math.sin(this.flickerGlobal * 2.5) * 0.3 + 0.7;
    for (const l of this.lights) {
      const individual = Math.sin(this.flickerGlobal * l.speed + l.phase) * 0.4 + 0.6;
      l.radius = 60 + 80 * individual * flicker;
    }
  }

  draw() {
    const ctx = this.ctx;
    const { canvas } = ctx;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const l of this.lights) {
      const grad = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.radius);
      grad.addColorStop(0, `rgba(200,210,180,${l.baseAlpha * 3})`);
      grad.addColorStop(0.5, `rgba(180,190,150,${l.baseAlpha})`);
      grad.addColorStop(1, 'rgba(15,17,21,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 暗角
    const vignette = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, canvas.width * 0.3,
      canvas.width / 2, canvas.height / 2, canvas.width * 0.8
    );
    vignette.addColorStop(0, 'rgba(15,17,21,0)');
    vignette.addColorStop(1, 'rgba(15,17,21,0.5)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

/** 真相揭示效果 — 暗红脉冲 + 漂浮粒子 */
class TruthScene {
  private ctx: CanvasRenderingContext2D;
  private particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; life: number; maxLife: number }[] = [];
  private pulse = 0;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.spawnParticles(15);
  }

  private spawnParticles(count: number) {
    const { canvas } = this.ctx;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 40,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(0.3 + Math.random() * 0.8),
        size: 1 + Math.random() * 2,
        alpha: 0.1 + Math.random() * 0.3,
        life: 0,
        maxLife: 6 + Math.random() * 10,
      });
    }
  }

  resize(w: number, _h: number) {
    this.particles.forEach((p) => { p.x = Math.random() * w; });
  }

  update(dt: number) {
    const { canvas } = this.ctx;
    this.pulse += dt;
    for (const p of this.particles) {
      p.x += p.vx * dt * 60;
      p.y += p.vy * dt * 60;
      p.life += dt;
      if (p.life > p.maxLife || p.y < -10 || p.x < -10 || p.x > canvas.width + 10) {
        p.x = Math.random() * canvas.width;
        p.y = canvas.height + 10;
        p.life = 0;
        p.maxLife = 6 + Math.random() * 10;
      }
    }
    // 维持粒子数量
    while (this.particles.length < 15) {
      this.spawnParticles(1);
    }
    this.particles = this.particles.slice(0, 25);
  }

  draw() {
    const ctx = this.ctx;
    const { canvas } = ctx;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 暗红脉冲
    const pulseAlpha = 0.02 + Math.sin(this.pulse * 1.2) * 0.015;
    const pulseGrad = ctx.createRadialGradient(
      canvas.width / 2, canvas.height * 0.6, 50,
      canvas.width / 2, canvas.height * 0.6, canvas.width * 0.8
    );
    pulseGrad.addColorStop(0, `rgba(139,30,30,${pulseAlpha * 3})`);
    pulseGrad.addColorStop(1, 'rgba(15,17,21,0)');
    ctx.fillStyle = pulseGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 漂浮真相碎片粒子
    for (const p of this.particles) {
      const lifeRatio = 1 - p.life / p.maxLife;
      const alpha = p.alpha * lifeRatio;
      ctx.fillStyle = `rgba(201,165,75,${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export default function DynamicBackground({ chapterId }: DynamicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<RainScene | CorridorScene | TruthScene | null>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      sceneRef.current?.resize(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    // 根据章节创建对应场景
    const mode = getSceneMode(chapterId);
    if (mode === 'rain') {
      sceneRef.current = new RainScene(ctx);
    } else if (mode === 'corridor') {
      sceneRef.current = new CorridorScene(ctx);
    } else if (mode === 'truth') {
      sceneRef.current = new TruthScene(ctx);
    } else {
      sceneRef.current = null;
    }

    const loop = (time: number) => {
      const dt = lastTimeRef.current ? Math.min((time - lastTimeRef.current) / 1000, 0.1) : 0.016;
      lastTimeRef.current = time;
      sceneRef.current?.update(dt);
      sceneRef.current?.draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [chapterId]);

  const mode = getSceneMode(chapterId);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-[5] transition-opacity duration-1000"
      style={{ opacity: mode === 'default' ? 0 : 0.85 }}
      aria-hidden="true"
    />
  );
}
