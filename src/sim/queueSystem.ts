import { createRngStream, roundNonnegHalfUp } from "../lib/rngStream";

export type QueueLaw = "Exponential" | "Normal" | "Each X minutes" | "Uniform";

export const QUEUE_LAW_CHOICES: QueueLaw[] = ["Exponential", "Normal", "Each X minutes", "Uniform"];

export const QUEUE_INDICATOR_CHOICES = [
  "Waiting / Client",
  "Maximum waiting Time",
  "Average time in",
  "Max time in",
  "non satisfied clients",
  "Time of work",
  "% Busy",
  "Exeeding Time",
  " Average Nb of clients",
  "Max of clients",
  "Out of time clients",
  "Adverage service Time",
] as const;

export type QueueIndicator = (typeof QUEUE_INDICATOR_CHOICES)[number];

function cumsum(gaps: number[]): number[] {
  const g: number[] = new Array(gaps.length);
  let s = 0;
  for (let i = 0; i < gaps.length; i++) {
    s += gaps[i]!;
    g[i] = s;
  }
  return g;
}

export function drawArrivalEpochs(
  rng: ReturnType<typeof createRngStream>,
  n: number,
  law: QueueLaw,
  b5: number
): number[] {
  const b = b5;
  if (law === "Exponential") {
    const gaps: number[] = new Array(n);
    for (let i = 0; i < n; i++) gaps[i] = roundNonnegHalfUp(-b * Math.log(rng.uEps()));
    return cumsum(gaps);
  }
  if (law === "Normal") {
    const gaps: number[] = new Array(n);
    for (let i = 0; i < n; i++) gaps[i] = roundNonnegHalfUp(rng.rnorm(b, 2));
    return cumsum(gaps);
  }
  if (law === "Each X minutes") {
    return Array.from({ length: n }, (_, i) => (i + 1) * b);
  }
  if (law === "Uniform") {
    return rng.randint(0, 170, n).sort((x, y) => x - y);
  }
  throw new Error(`Unknown arrival law: ${String(law)}`);
}

export function drawServiceTimes(
  rng: ReturnType<typeof createRngStream>,
  n: number,
  law: QueueLaw,
  b11: number
): number[] {
  const b = b11;
  if (law === "Exponential") {
    const x: number[] = new Array(n);
    for (let i = 0; i < n; i++) {
      x[i] = roundNonnegHalfUp(-b * Math.log(rng.uEps()));
      if (x[i]! <= 0) x[i] = 1;
    }
    return x;
  }
  if (law === "Normal") {
    const x: number[] = new Array(n);
    for (let i = 0; i < n; i++) {
      x[i] = roundNonnegHalfUp(rng.rnorm(b, 2));
      if (x[i]! <= 0) x[i] = 1;
    }
    return x;
  }
  if (law === "Each X minutes") {
    return new Array(n).fill(b);
  }
  if (law === "Uniform") {
    return rng.randint(1, 9, n);
  }
  throw new Error(`Unknown service law: ${String(law)}`);
}

export type QueueKpi = {
  mean_wait: number;
  max_wait: number;
  mean_time_in: number;
  max_time_in: number;
  nonsat: number;
  time_work: number;
  pct_busy: number;
  exceed_time_total_minutes: number;
  avg_clients_events: number;
  max_clients: number;
  out_of_time: number;
  avg_service: number;
};

export function queueCustomerTable(g: number[], I: number[]) {
  const n = g.length;
  if (I.length !== n) throw new Error("g and I must be same length");
  let jPrev = 0;
  const f: (number | null)[] = new Array(n).fill(null);
  const h: number[] = new Array(n);
  const jj: number[] = new Array(n);
  const k: number[] = new Array(n);
  const idle: number[] = new Array(n);
  const mcli: number[] = new Array(n);
  for (let r = 0; r < n; r++) {
    const gr = g[r]!;
    const ir = I[r]!;
    h[r] = Math.max(jPrev, gr);
    jj[r] = h[r]! + ir;
    k[r] = Math.max(0, h[r]! - gr);
    idle[r] = Math.max(0, gr - jPrev);
    if (r > 0) f[r] = gr - g[r - 1]!;
    mcli[r] = r === 0 ? 1 : 1 + jj.slice(0, r).filter((J) => J! > gr).length;
    jPrev = jj[r]!;
  }
  const tis = I.map((s, r) => s! + k[r]!);
  return {
    Customer: g.map((_, r) => `A${r + 1}`),
    timeBetween: f,
    arrival: g,
    start: h,
    service: I,
    end: jj,
    wait: k,
    idle,
    mcli,
    tis,
  };
}

export type CustomerTable = ReturnType<typeof queueCustomerTable>;

function queueEventsTable(g: number[], j: number[]) {
  const n = g.length;
  const times: number[] = [];
  const typ: ("A" | "D")[] = [];
  for (let i = 0; i < n; i++) {
    times.push(g[i]!);
    typ.push("A");
  }
  for (let i = 0; i < n; i++) {
    times.push(j[i]!);
    typ.push("D");
  }
  const ord = new Array(2 * n);
  for (let i = 0; i < 2 * n; i++) ord[i] = i < n ? 1 : 2;
  const idx = Array.from({ length: 2 * n }, (_, i) => i);
  idx.sort((a, b) => {
    const t = times[a]! - times[b]!;
    if (t !== 0) return t;
    return ord[a]! - ord[b]!;
  });
  const sortedTime = idx.map((i) => times[i]!);
  const sortedType = idx.map((i) => (typ[i]! as "A" | "D"));
  const delta = sortedType.map((t) => (t === "A" ? 1 : -1));
  const nInSys: number[] = new Array(2 * n);
  let cur = 0;
  for (let r = 0; r < 2 * n; r++) {
    cur += delta[r]!;
    nInSys[r] = cur;
  }
  const nb: (number | null)[] = new Array(2 * n).fill(null);
  for (let r = 0; r < 2 * n - 1; r++) {
    nb[r] = (sortedTime[r + 1]! - sortedTime[r]!) * nInSys[r]!;
  }
  return { time: sortedTime, arDep: sortedType, delta, nInSys, nbClientTime: nb };
}

function littleAvgFromEvents(ev: ReturnType<typeof queueEventsTable>) {
  const m = ev.time.length;
  const lastT = ev.time[m - 1]!;
  if (lastT <= 0) return Number.NaN;
  let s = 0;
  for (let r = 0; r < m - 1; r++) {
    const c = ev.nbClientTime[r];
    if (c != null) s += c;
  }
  return s / lastT;
}

export function queueKpiValues(tbl: CustomerTable, ev: ReturnType<typeof queueEventsTable>): QueueKpi {
  const K = tbl.wait;
  const N = tbl.tis;
  const I = tbl.service;
  const J = tbl.end;
  const L = tbl.idle;
  const M = tbl.mcli;
  const jLast = Math.max(...J, 0);
  const posIdle = L.filter((x) => x > 0);
  const posIdleSum = posIdle.reduce((a, b) => a + b, 0);
  const timeWork = jLast - posIdleSum;
  const jOver = J.filter((x) => x > 180);
  const exceed = jOver.reduce((a, x) => a + (x! - 180), 0);
  return {
    mean_wait: K.reduce((a, b) => a + b, 0) / K.length,
    max_wait: Math.max(...K, 0),
    mean_time_in: N.reduce((a, b) => a + b, 0) / N.length,
    max_time_in: Math.max(...N, 0),
    nonsat: K.filter((x) => x > 10).length,
    time_work: timeWork,
    pct_busy: jLast > 0 ? timeWork / jLast : Number.NaN,
    exceed_time_total_minutes: exceed,
    avg_clients_events: littleAvgFromEvents(ev),
    max_clients: Math.max(...M, 0),
    out_of_time: J.filter((x) => x! > 180).length,
    avg_service: I.reduce((a, b) => a + b, 0) / I.length,
  };
}

export function queueIndicatorValue(ind: QueueIndicator, kpi: QueueKpi): number {
  switch (ind) {
    case "Waiting / Client":
      return kpi.mean_wait;
    case "Maximum waiting Time":
      return kpi.max_wait;
    case "Average time in":
      return kpi.mean_time_in;
    case "Max time in":
      return kpi.max_time_in;
    case "non satisfied clients":
      return kpi.nonsat;
    case "Time of work":
      return kpi.time_work;
    case "% Busy":
      return kpi.pct_busy;
    case "Exeeding Time":
      return kpi.exceed_time_total_minutes;
    case " Average Nb of clients":
      return kpi.avg_clients_events;
    case "Max of clients":
      return kpi.max_clients;
    case "Out of time clients":
      return kpi.out_of_time;
    case "Adverage service Time":
      return kpi.avg_service;
    default:
      return Number.NaN;
  }
}

function queueOneIteration(
  rng: ReturnType<typeof createRngStream>,
  arrival: QueueLaw,
  service: QueueLaw,
  b5: number,
  b11: number,
  nC: number,
  ind: QueueIndicator
) {
  const g = drawArrivalEpochs(rng, nC, arrival, b5);
  const i = drawServiceTimes(rng, nC, service, b11);
  const table = queueCustomerTable(g, i);
  // Completion times (J) are the table’s `end` column — not `i.end` (service time vector has no .end)
  const ev = queueEventsTable(g, table.end);
  const kpi = queueKpiValues(table, ev);
  return {
    table,
    events: { ...ev, n: nC },
    kpi,
    current: queueIndicatorValue(ind, kpi),
  };
}

export function queueSimulateRun(
  params: {
    arrival: QueueLaw;
    service: QueueLaw;
    b5: number;
    b11: number;
    nIter: number;
    nCustomers: number;
    indicator: QueueIndicator;
    seed: number;
  }
) {
  const rng = createRngStream(params.seed);
  const nC = params.nCustomers | 0;
  const nIter = Math.max(1, params.nIter | 0);
  let worst = 0;
  let last: ReturnType<typeof queueOneIteration> | null = null;
  for (let it = 0; it < nIter; it++) {
    last = queueOneIteration(rng, params.arrival, params.service, params.b5, params.b11, nC, params.indicator);
    const cur = Number.isFinite(last.current) ? last.current : 0;
    if (cur > worst) worst = cur;
  }
  if (!last) throw new Error("queue empty");
  return { ...last, worst, nIter, indicator: params.indicator };
}
