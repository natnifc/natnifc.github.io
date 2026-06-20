import { useEffect, useRef, useState } from 'react';
import { World, W, H, BIRD_X, GEOM } from '../flappy/sim';
import './FlappyNN.css';

const { BIRD_R, PIPE_W, GAP } = GEOM;

// Right-aligned fixed-width signed number, e.g. " 0.41" / "-0.58".
function fmt(n: number): string {
  const s = (n >= 0 ? ' ' : '-') + Math.abs(n).toFixed(2);
  return s;
}

function buildReadout(world: World): string {
  const leader = world.leader;
  const f = leader.lastForward;
  const lines: string[] = [];
  lines.push('$ ./flappy --train');
  lines.push('');
  lines.push(
    `GEN ${String(world.generation).padStart(3, '0')}    ` +
      `ALIVE ${world.aliveCount}/${world.birds.length}`
  );
  lines.push(
    `SCORE ${world.score}    BEST ${world.bestScore}    ` +
      `FIT ${Math.round(leader.fitness)}`
  );
  lines.push('');

  if (f) {
    const labels = ['y  ', 'vy ', 'dx ', 'top', 'bot'];
    lines.push('── leader forward pass ──');
    lines.push('in   ' + labels[0] + ' ' + fmt(f.inputs[0]));
    for (let i = 1; i < f.inputs.length; i++) {
      lines.push('     ' + labels[i] + ' ' + fmt(f.inputs[i]));
    }
    lines.push('');
    lines.push(`hidden tanh[${f.hidden.length}]`);
    for (let i = 0; i < f.hidden.length; i += 4) {
      lines.push(
        ' ' +
          f.hidden
            .slice(i, i + 4)
            .map(fmt)
            .join(' ')
      );
    }
    lines.push('');
    const flap = f.output > 0.5;
    lines.push(
      `out  σ(Σ) =${fmt(f.output)}  →  ${flap ? 'FLAP' : '----'}`
    );
  }
  return lines.join('\n');
}

export default function FlappyNN() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [readout, setReadout] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;

    const fg =
      getComputedStyle(canvas).getPropertyValue('--fg').trim() || '#ffffff';
    const dim =
      getComputedStyle(canvas).getPropertyValue('--dim').trim() || '#888888';

    const world = new World();

    let raf = 0;
    let lastReadout = 0;

    const render = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // border
      ctx.strokeStyle = dim;
      ctx.lineWidth = 1;
      ctx.strokeRect(0.5, 0.5, W - 1, H - 1);

      // pipes
      ctx.strokeStyle = fg;
      for (const p of world.pipes) {
        ctx.strokeRect(p.x, 0, PIPE_W, p.gapTop);
        ctx.strokeRect(p.x, p.gapTop + GAP, PIPE_W, H - (p.gapTop + GAP));
      }

      // birds — flock dim, leader bright
      const leader = world.leader;
      for (const b of world.birds) {
        if (!b.alive) continue;
        if (b === leader) continue;
        ctx.fillStyle = dim;
        ctx.globalAlpha = 0.35;
        ctx.fillRect(BIRD_X - BIRD_R, b.y - BIRD_R, BIRD_R * 2, BIRD_R * 2);
      }
      ctx.globalAlpha = 1;
      if (leader.alive) {
        ctx.fillStyle = fg;
        ctx.fillRect(
          BIRD_X - BIRD_R,
          leader.y - BIRD_R,
          BIRD_R * 2,
          BIRD_R * 2
        );
      }
    };

    const tick = (t: number) => {
      world.step();
      render();
      if (t - lastReadout > 80) {
        lastReadout = t;
        setReadout(buildReadout(world));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="flappy">
      <canvas
        ref={canvasRef}
        className="flappy-canvas"
        aria-label="Flappy Bird game played by a neural network"
        role="img"
      />
      <pre className="flappy-terminal" aria-hidden="true">
        {readout}
      </pre>
    </div>
  );
}
