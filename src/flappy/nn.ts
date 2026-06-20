// Tiny feed-forward neural network for neuroevolution.
// Architecture: nIn -> nHid (tanh) -> nOut (sigmoid). No training/backprop —
// these are evolved with a genetic algorithm (copy + mutate + crossover).

function gaussian(): number {
  // Box-Muller
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const tanh = Math.tanh;
const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

export interface Forward {
  inputs: number[];
  hidden: number[];
  output: number;
}

export class NeuralNet {
  nIn: number;
  nHid: number;
  nOut: number;
  w1: number[][]; // [hidden][input]
  b1: number[]; // [hidden]
  w2: number[][]; // [output][hidden]
  b2: number[]; // [output]

  constructor(nIn: number, nHid: number, nOut: number, init = true) {
    this.nIn = nIn;
    this.nHid = nHid;
    this.nOut = nOut;
    this.w1 = [];
    this.b1 = [];
    this.w2 = [];
    this.b2 = [];
    if (init) {
      for (let h = 0; h < nHid; h++) {
        this.w1.push(Array.from({ length: nIn }, gaussian));
        this.b1.push(gaussian());
      }
      for (let o = 0; o < nOut; o++) {
        this.w2.push(Array.from({ length: nHid }, gaussian));
        this.b2.push(gaussian());
      }
    }
  }

  forward(inputs: number[]): Forward {
    const hidden = this.b1.map((bias, h) => {
      let sum = bias;
      const row = this.w1[h];
      for (let i = 0; i < inputs.length; i++) sum += row[i] * inputs[i];
      return tanh(sum);
    });
    const out = this.b2.map((bias, o) => {
      let sum = bias;
      const row = this.w2[o];
      for (let h = 0; h < hidden.length; h++) sum += row[h] * hidden[h];
      return sigmoid(sum);
    });
    return { inputs, hidden, output: out[0] };
  }

  copy(): NeuralNet {
    const n = new NeuralNet(this.nIn, this.nHid, this.nOut, false);
    n.w1 = this.w1.map((r) => r.slice());
    n.b1 = this.b1.slice();
    n.w2 = this.w2.map((r) => r.slice());
    n.b2 = this.b2.slice();
    return n;
  }

  mutate(rate: number, amount: number): void {
    const mut = (v: number) =>
      Math.random() < rate ? v + gaussian() * amount : v;
    this.w1 = this.w1.map((r) => r.map(mut));
    this.b1 = this.b1.map(mut);
    this.w2 = this.w2.map((r) => r.map(mut));
    this.b2 = this.b2.map(mut);
  }

  static crossover(a: NeuralNet, b: NeuralNet): NeuralNet {
    const child = a.copy();
    const mix = (x: number, y: number) => (Math.random() < 0.5 ? x : y);
    child.w1 = a.w1.map((r, h) => r.map((v, i) => mix(v, b.w1[h][i])));
    child.b1 = a.b1.map((v, h) => mix(v, b.b1[h]));
    child.w2 = a.w2.map((r, o) => r.map((v, h) => mix(v, b.w2[o][h])));
    child.b2 = a.b2.map((v, o) => mix(v, b.b2[o]));
    return child;
  }
}
