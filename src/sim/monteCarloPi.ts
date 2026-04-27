import { mulberry32 } from "../rng/mulberry32";

export type McPiResult = {
  x: number[];
  y: number[];
  inside: boolean[];
  nIn: number;
  nOut: number;
  piHat: number;
  relPctVsPi: number;
};

/** Unit square [0,1]²; inscribed disk center (½,½), radius ½ — matches `R/monte-carlo-sim-pi.R`. */
export function simulateMcPi(n: number, seed: number): McPiResult {
  const nSafe = Math.max(0, Math.floor(n));
  const rnd = mulberry32(seed >>> 0);
  const x: number[] = new Array(nSafe);
  const y: number[] = new Array(nSafe);
  const inside: boolean[] = new Array(nSafe);
  let nIn = 0;
  for (let i = 0; i < nSafe; i++) {
    const xi = rnd();
    const yi = rnd();
    x[i] = xi;
    y[i] = yi;
    const ins = (xi - 0.5) ** 2 + (yi - 0.5) ** 2 <= 0.5 ** 2;
    inside[i] = ins;
    if (ins) nIn += 1;
  }
  const nOut = nSafe - nIn;
  const piHat = nSafe > 0 ? (4 * nIn) / nSafe : 0;
  const relPctVsPi = nSafe > 0 ? (100 * Math.abs(piHat - Math.PI)) / Math.PI : 0;
  return { x, y, inside, nIn, nOut, piHat, relPctVsPi };
}
