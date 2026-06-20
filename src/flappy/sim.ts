import { NeuralNet } from './nn';
import type { Forward } from './nn';

// Game geometry (logical units; rendering scales to fit).
export const W = 320;
export const H = 260;
export const BIRD_X = 64;

const GRAVITY = 0.45;
const FLAP = -7;
const VY_CLAMP = 12;
const BIRD_R = 5;

const PIPE_W = 34;
const GAP = 96;
const SPEED = 2.2;
const SPAWN_FRAMES = 95;
const PIPE_MARGIN = 36; // keep gap away from top/bottom edges

const POP = 60;
const PIPE_BONUS = 25;
const MUTATE_RATE = 0.12;
const MUTATE_AMOUNT = 0.5;

export interface Pipe {
  x: number;
  gapTop: number;
  scored: boolean;
}

export interface Bird {
  y: number;
  vy: number;
  alive: boolean;
  fitness: number;
  score: number;
  nn: NeuralNet;
  lastForward: Forward | null;
}

function newBird(nn: NeuralNet): Bird {
  return {
    y: H / 2,
    vy: 0,
    alive: true,
    fitness: 0,
    score: 0,
    nn,
    lastForward: null,
  };
}

function randomGapTop(): number {
  return PIPE_MARGIN + Math.random() * (H - GAP - PIPE_MARGIN * 2);
}

export class World {
  birds: Bird[];
  pipes: Pipe[] = [];
  generation = 1;
  score = 0; // pipes passed this generation
  bestScore = 0;
  bestFitnessEver = 0;
  private frame = 0;

  constructor() {
    this.birds = Array.from({ length: POP }, () =>
      newBird(new NeuralNet(5, 8, 1))
    );
    this.spawnPipe();
  }

  get aliveCount(): number {
    return this.birds.reduce((n, b) => n + (b.alive ? 1 : 0), 0);
  }

  // The alive bird with the highest fitness — the one we showcase.
  get leader(): Bird {
    let best = this.birds[0];
    for (const b of this.birds) {
      if (b.alive && (!best.alive || b.fitness > best.fitness)) best = b;
    }
    return best;
  }

  private spawnPipe(): void {
    this.pipes.push({ x: W + PIPE_W, gapTop: randomGapTop(), scored: false });
  }

  private nextPipeAhead(): Pipe {
    for (const p of this.pipes) {
      if (p.x + PIPE_W >= BIRD_X) return p;
    }
    return this.pipes[this.pipes.length - 1];
  }

  step(): void {
    this.frame++;

    // Move pipes, spawn, cull.
    for (const p of this.pipes) p.x -= SPEED;
    if (this.frame % SPAWN_FRAMES === 0) this.spawnPipe();
    this.pipes = this.pipes.filter((p) => p.x + PIPE_W > -10);

    const pipe = this.nextPipeAhead();
    const gapTop = pipe.gapTop;
    const gapBottom = pipe.gapTop + GAP;

    // Score when a pipe clears the bird line.
    for (const p of this.pipes) {
      if (!p.scored && p.x + PIPE_W < BIRD_X) {
        p.scored = true;
        this.score++;
        if (this.score > this.bestScore) this.bestScore = this.score;
        for (const b of this.birds) if (b.alive) b.fitness += PIPE_BONUS;
      }
    }

    for (const b of this.birds) {
      if (!b.alive) continue;

      const inputs = [
        b.y / H,
        b.vy / VY_CLAMP,
        (pipe.x - BIRD_X) / W,
        gapTop / H,
        gapBottom / H,
      ];
      const fwd = b.nn.forward(inputs);
      b.lastForward = fwd;
      if (fwd.output > 0.5) b.vy = FLAP;

      b.vy = Math.min(VY_CLAMP, b.vy + GRAVITY);
      b.y += b.vy;
      b.fitness += 1;

      // Collisions: floor / ceiling.
      if (b.y - BIRD_R < 0 || b.y + BIRD_R > H) {
        b.alive = false;
        continue;
      }
      // Pipe collision (bird x is fixed at BIRD_X).
      const inPipeX = pipe.x < BIRD_X + BIRD_R && pipe.x + PIPE_W > BIRD_X - BIRD_R;
      if (inPipeX && (b.y - BIRD_R < gapTop || b.y + BIRD_R > gapBottom)) {
        b.alive = false;
      }
    }

    if (this.aliveCount === 0) this.nextGeneration();
  }

  private nextGeneration(): void {
    const sorted = [...this.birds].sort((a, b) => b.fitness - a.fitness);
    const best = sorted[0];
    this.bestFitnessEver = Math.max(this.bestFitnessEver, best.fitness);

    // Roulette-wheel selection weighted by fitness.
    const total = sorted.reduce((s, b) => s + b.fitness, 0) || 1;
    const pick = (): Bird => {
      let r = Math.random() * total;
      for (const b of sorted) {
        r -= b.fitness;
        if (r <= 0) return b;
      }
      return sorted[0];
    };

    const nextNets: NeuralNet[] = [best.nn.copy()]; // elitism
    while (nextNets.length < POP) {
      const child = NeuralNet.crossover(pick().nn, pick().nn);
      child.mutate(MUTATE_RATE, MUTATE_AMOUNT);
      nextNets.push(child);
    }

    this.birds = nextNets.map(newBird);
    this.pipes = [];
    this.frame = 0;
    this.score = 0;
    this.generation++;
    this.spawnPipe();
  }
}

export const GEOM = { W, H, BIRD_X, BIRD_R, PIPE_W, GAP };
