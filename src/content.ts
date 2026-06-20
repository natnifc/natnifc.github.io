// All editable site text lives here. Change copy in this file and it
// updates everywhere it's used — no need to touch component code.

export const hero = {
  prompt: '$ whoami',
  name: 'Fintan Coyle',
  tagline:
    "CS student @ University of Victoria ",
  links: [
    { label: 'github.com/natnifc', href: 'https://github.com/natnifc' },
    { label: 'natnifc@gmail.com', href: 'mailto:natnifc@gmail.com' },
  ],
  hint: '(a neural network learning flappy bird — live)',
};

export interface Project {
  title: string;
  subtitle?: string;
  points: string[];
  tags: string[];
}

export const projectsHeading = '$ ls ./projects';

export const projects: Project[] = [
  {
    title: 'Healthcare AI Research',
    subtitle: 'University of Victoria',
    points: [
      'AI pipeline for improving medical service delivery using deidentified patient data, built with a UVic professor.',
      'Designing optimization workflows with LoRA and RAG to reduce diagnostic delays.',
      'Applied game theory across graphRAG to find better results at quicker speeds.',
    ],
    tags: ['LoRA', 'RAG', 'graphRAG', 'Python'],
  },
  {
    title: 'Offline LLM for Students Pipeline',
    points: [
      'Custom pipeline for deploying and running LLMs fully offline, no external API dependencies, using Qwen 2.5.',
      'Quantization and memory optimization with LoRA fine-tuning to shrink the model footprint without losing quality.',
      'Dynamic RAG database that lets users instantly drop in the subject they want to study.',
      'Lightweight CLI supporting multiple model formats, including GGUF.',
    ],
    tags: ['Qwen 2.5', 'LoRA', 'RAG', 'GGUF', 'CLI'],
  },
  {
    title: 'Swipeify',
    subtitle: 'Intelligent Music Recommendation App',
    points: [
      'PyTorch neural network suggesting songs from audio features, artist popularity, and genre.',
      'Flask backend for authentication, data processing, and serving recommendations.',
      'Spotify API integration for real-time track data and user interaction.',
    ],
    tags: ['PyTorch', 'Flask', 'Spotify API'],
  },
  {
    title: 'YouTube Audio Leveling',
    subtitle: 'Chrome Extension',
    points: [
      'Published with 1,500+ active users and a 4.2 star rating.',
      'Dynamic JavaScript injection for real-time audio transformation using logarithmic scaling algorithms.',
    ],
    tags: ['JavaScript', 'Chrome Extension'],
  },
];

export interface ColophonEntry {
  file: string;
  description: string;
}

export const colophonHeading = '$ cat how-it-works.md';

export const colophon: ColophonEntry[] = [
  {
    file: 'src/flappy/nn.ts',
    description:
      'A tiny from-scratch neural net (5 inputs → 8 hidden tanh → 1 sigmoid) with forward, copy, mutate, and crossover. No training library; the weights are evolved.',
  },
  {
    file: 'src/flappy/sim.ts',
    description:
      'The game + genetic algorithm: 60 birds play simultaneously, fitness = frames survived + bonus per pipe, and when all die the next generation is bred (elitism + roulette selection + crossover + mutation).',
  },
  {
    file: 'src/components/FlappyNN.tsx',
    description:
      'Drives the loop, renders the game on a canvas (bright leader bird, dim flock, white pipes), and prints the leader’s live forward pass to a <pre> terminal: generation, alive count, score, then inputs → hidden activations → σ output → FLAP/----.',
  },
];

export const footer = {
  name: 'Fintan Coyle',
};
