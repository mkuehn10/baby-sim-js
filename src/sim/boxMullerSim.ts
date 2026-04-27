/**
 * Box–Muller pairs from uniform streams — matches `R/box-muller.R` LCG + BM pairing.
 */

const M_GOOD = 2 ** 31 - 1;
const M_RANDU = 2 ** 31;
const A_GOOD = 16807;
const A_RANDU = 65539;

function lcgUniforms(n: number, seed: number, good: boolean): number[] {
  if (good) {
    const m = M_GOOD;
    const a = A_GOOD;
    let x = Math.floor(seed) % m;
    if (x < 0) x += m;
    if (x === 0) x = 1;
    const u: number[] = new Array(n);
    for (let i = 0; i < n; i++) {
      x = ((a * x) % m + m) % m;
      u[i] = x / m;
    }
    return u;
  }
  const m = M_RANDU;
  const a = A_RANDU;
  let x = Math.abs(Math.floor(seed)) % m;
  if (x === 0) x = 1;
  const u: number[] = new Array(n);
  for (let i = 0; i < n; i++) {
    x = ((a * x) % m + m) % m;
    u[i] = x / m;
  }
  return u;
}

function fibonacciStream(n: number, a0: number, b0: number): number[] {
  let a = a0;
  let b = b0;
  const u: number[] = new Array(n);
  for (let i = 0; i < n; i++) {
    const nxt = (a + b) % 1;
    u[i] = nxt;
    a = b;
    b = nxt;
  }
  return u;
}

/** Overwrites u2n with 2n uniforms: two interleaved fibonacci streams (R ignores seed in stream body). */
export function fibonacciUniforms2n(
  nPairs: number,
  seed: number
): { u1: number[]; u2: number[]; interleaved: number[] } {
  void seed;
  const n = nPairs;
  const u1 = fibonacciStream(n, 0.05, 0.5);
  const u2 = fibonacciStream(n, 0.45, 0.75);
  const u = new Array(2 * n);
  for (let i = 0; i < n; i++) {
    u[2 * i] = u1[i]!;
    u[2 * i + 1] = u2[i]!;
  }
  return { u1, u2, interleaved: u };
}

export function boxMullerFromUniforms(uStream: number[]) {
  const m = uStream.length;
  const n = m / 2;
  const z1: number[] = new Array(n);
  const z2: number[] = new Array(n);
  for (let k = 0; k < n; k++) {
    const u1 = Math.max(uStream[2 * k]!, Number.EPSILON);
    const u2 = uStream[2 * k + 1]!;
    const r = Math.sqrt(-2 * Math.log(u1));
    z1[k] = r * Math.cos(2 * Math.PI * u2);
    z2[k] = r * Math.sin(2 * Math.PI * u2);
  }
  return { z1, z2, z: z1 }; // R ggplot uses (z1,z2) for scatter - use all n pairs on z1? The plot is z1 vs z2: each pair one point, so n points. Actually bm_box_muller returns tibble z1, z2 as columns - n rows. So we plot z1[k] vs z2[k] for k in 0..n-1. Good.
}

export function simulateBoxMuller(
  nPairs: number,
  seed: number,
  mode: "good" | "randu" | "fibonacci"
) {
  const n = 2 * nPairs;
  let u: number[];
  let title: string;
  if (mode === "fibonacci") {
    u = fibonacciUniforms2n(nPairs, seed).interleaved;
    title = "Fibonacci";
  } else {
    u = lcgUniforms(n, seed, mode === "good");
    title = mode === "good" ? "Good" : "RANDU";
  }
  const { z1, z2 } = boxMullerFromUniforms(u);
  return { z1, z2, title, mode };
}
