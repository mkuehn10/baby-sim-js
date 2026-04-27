/** Matches `R/threed_gen.R`: LCG triples scaled by `2^31` for both generators. */

const SCALE = 2 ** 31;
const M_RANDU = 2 ** 31;
const M_GOOD = 2 ** 31 - 1;
const A_RANDU = 65539;
const A_GOOD = 16807;

export type Gen3dMode = "good" | "randu";

export type Gen3dResult = {
  x: number[];
  y: number[];
  z: number[];
  title: string;
  mode: Gen3dMode;
};

function generateSequence(a: number, m: number, x0: number, n: number): number[] {
  const x = new Array<number>(n);
  x[0] = x0;
  for (let i = 1; i < n; i++) {
    x[i] = (a * x[i - 1]) % m;
  }
  return x;
}

/** `create_dataframe()` in R: drop first state, scale by `2^31`, form overlapping triples. */
function triplesFromSequence(xi: number[]): { x: number[]; y: number[]; z: number[] } {
  const n = xi.length;
  if (n < 4) {
    return { x: [], y: [], z: [] };
  }
  const nums = new Array<number>(n - 1);
  for (let i = 0; i < n - 1; i++) {
    nums[i] = xi[i + 1] / SCALE;
  }
  const L = nums.length;
  const t = L - 2;
  const x = new Array<number>(t);
  const y = new Array<number>(t);
  const z = new Array<number>(t);
  for (let i = 0; i < t; i++) {
    x[i] = nums[i];
    y[i] = nums[i + 1];
    z[i] = nums[i + 2];
  }
  return { x, y, z };
}

/**
 * @param nChain Length of raw LCG state vector (same as Shiny `gen3d_n_points`).
 */
export function simulateGen3d(nChain: number, seed: number, mode: Gen3dMode): Gen3dResult {
  const n = Math.max(0, Math.floor(nChain));
  const x0 = Math.floor(seed);
  const a = mode === "randu" ? A_RANDU : A_GOOD;
  const m = mode === "randu" ? M_RANDU : M_GOOD;
  const xi = generateSequence(a, m, x0, n);
  const { x, y, z } = triplesFromSequence(xi);
  const title = mode === "randu" ? "RANDU" : "Desert Island";
  return { x, y, z, title, mode };
}
