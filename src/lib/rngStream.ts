import { mulberry32 } from "../rng/mulberry32";

/**
 * Seeded [0,1) stream for simulations (independent of R’s RNG).
 * Includes helpers matching common patterns in the R app (uniform, discrete, normals).
 */
export function createRngStream(seed: number) {
  const r = mulberry32(seed >>> 0);
  return {
    /** [0, 1) */
    u: (): number => r(),
    /** max(u, tiny) to avoid log(0) in exponentials / Box–Muller */
    uEps: (): number => {
      const x = r();
      return x < 1e-12 ? 1e-12 : x;
    },
    runif: (n: number): number[] => {
      const out = new Array(n);
      for (let i = 0; i < n; i++) out[i] = r();
      return out;
    },
    /**
     * Independent uniform integers in [a, b] inclusive (R `sample.int` with replace).
     */
    randint: (a: number, b: number, n: number): number[] => {
      const ai = a | 0;
      const bi = b | 0;
      const w = bi - ai + 1;
      const out = new Array(n);
      for (let i = 0; i < n; i++) {
        out[i] = ai + Math.floor(r() * w);
      }
      return out;
    },
    /**
     * Standard normal (Box–Muller); consumes 2 uniforms per call.
     */
    rnorm01: (): number => {
      const u1 = Math.max(r(), 1e-12);
      const u2 = r();
      return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    },
    rnorm: (mean: number, sd: number): number => {
      return mean + sd * ((): number => {
        const u1 = Math.max(r(), 1e-12);
        const u2 = r();
        return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      })();
    },
  };
}

export function roundNonnegHalfUp(x: number): number {
  if (x < 0) return 0;
  return Math.floor(x + 0.5);
}
