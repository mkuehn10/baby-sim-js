import { createRngStream } from "../lib/rngStream";

export const SECTORS = [
  { name: "energy", mean: 0.05, sd: 0.3, y0: 5000 },
  { name: "pharmaceuticals", mean: 0.06, sd: 0.2, y0: 5000 },
  { name: "entertainment", mean: 0.04, sd: 0.1, y0: 5000 },
  { name: "insurance", mean: 0.07, sd: 0.05, y0: 5000 },
  { name: "banking", mean: 0.06, sd: 0.3, y0: 5000 },
  { name: "computer technology", mean: 0.18, sd: 0.3, y0: 5000 },
] as const;

/**
 * M3L10 structure: W_{i,y+1} = W_{i,y} · max(0, X_{i,y} G_y) with G_y i.i.d. and X_{i,y} ~ N(1+μ_i, σ_i²).
 */
export function portfolioSimulate(
  nYears: number,
  seed: number,
  generalMu: number,
  generalSd: number
) {
  const ny = Math.max(1, nYears | 0);
  const rng = createRngStream(seed);
  const nS = SECTORS.length;
  const wealth: number[][] = SECTORS.map((s) => [s.y0]);
  const general: number[] = new Array(ny);
  for (let y = 0; y < ny; y++) {
    const gy = rng.rnorm(generalMu, generalSd);
    general[y] = gy;
    for (let i = 0; i < nS; i++) {
      const se = SECTORS[i]!;
      const xi = rng.rnorm(1 + se.mean, se.sd);
      const pr = Math.max(0, xi * gy);
      const prev = wealth[i]![wealth[i]!.length - 1]!;
      wealth[i]!.push(prev * pr);
    }
  }
  const totalsByYear: number[] = new Array(ny + 1);
  for (let j = 0; j <= ny; j++) {
    let s0 = 0;
    for (let i = 0; i < nS; i++) s0 += wealth[i]![j]!;
    totalsByYear[j] = s0;
  }
  return { SECTORS, general, wealth, totalsByYear, nYears: ny };
}
