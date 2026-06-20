# natnifc.github.io

Personal website for Fintan Coyle — a black-and-white terminal-themed page
whose hero is a live **Flappy Bird game played by a neural network** that
teaches itself in the browser via neuroevolution, with the leading bird's
forward-pass math printed to a terminal readout.

Built with **React + TypeScript + Vite**.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
```

All editable copy (name, tagline, links, projects, descriptions) lives in
[`src/content.ts`](src/content.ts).

## How the game works

- [`src/flappy/nn.ts`](src/flappy/nn.ts) — a tiny from-scratch neural net
  (5 inputs → 8 hidden `tanh` → 1 `sigmoid`) with `forward`, `copy`,
  `mutate`, and `crossover`. No training library; the weights are evolved.
- [`src/flappy/sim.ts`](src/flappy/sim.ts) — the game + genetic algorithm:
  60 birds play simultaneously, fitness = frames survived + bonus per pipe,
  and when all die the next generation is bred (elitism + roulette selection
  + crossover + mutation).
- [`src/components/FlappyNN.tsx`](src/components/FlappyNN.tsx) — drives the
  loop, renders the game on a canvas, and prints the leader's live forward
  pass to a terminal.

## Deploy

The site is hosted on GitHub Pages from the `gh-pages` branch. Source lives
on `main`. To publish:

```bash
npm run deploy   # builds and pushes dist/ to the gh-pages branch
```
