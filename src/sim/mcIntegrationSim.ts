import { createRngStream } from "../lib/rngStream";

export const MC_INTEGRAND_IDS = ["sin_pi_u", "log_prod"] as const;
export type McIntegrandId = (typeof MC_INTEGRAND_IDS)[number];

/** Display names match R `MC_INT_INTEGRAND_CHOICES` in the Shiny app. */
export const MC_INTEGRAND_LABEL: Record<McIntegrandId, string> = {
  sin_pi_u: "sin(π u) on [0, 1]",
  log_prod: "ln(u) ln(1 − u) on [0, 1]",
};

function f(u: number, id: McIntegrandId): number {
  if (id === "sin_pi_u") return Math.sin(Math.PI * u);
  const x = Math.min(Math.max(u, 1e-12), 1 - 1e-12);
  return Math.log(x) * Math.log(1 - x);
}

export function exactMcIntegral(id: McIntegrandId): number {
  if (id === "sin_pi_u") return 2 / Math.PI;
  return 2 - (Math.PI * Math.PI) / 6;
}

export function monteCarloIntegrate(n: number, seed: number, id: McIntegrandId) {
  const rng = createRngStream(seed);
  const u = rng.runif(n);
  const fx: number[] = new Array(n);
  let s = 0;
  for (let i = 0; i < n; i++) {
    const v = f(u[i]!, id);
    fx[i] = v;
    s += v;
  }
  return { u, f_x: fx, estimate: s / n, id, exact: exactMcIntegral(id) };
}
