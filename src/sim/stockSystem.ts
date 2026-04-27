import { createRngStream, roundNonnegHalfUp } from "../lib/rngStream";

export const STOCK_DEMAND_LAWS = [
  "Exponential",
  "Normal",
  "X each day",
  "Uniform",
  "Fixed",
] as const;
export type StockDemandLaw = (typeof STOCK_DEMAND_LAWS)[number];

export const STOCK_SUPPLIER_LAWS = [
  "Exponential",
  "Normal",
  "Each X days",
  "Uniform",
  "Next day",
  "Fixed",
] as const;
export type StockSupplierLaw = (typeof STOCK_SUPPLIER_LAWS)[number];

const STOCK_DEMAND_FIXED_DEFAULT: number[] = [
  26, 30, 35, 22, 18, 40, 33, 28, 24, 31, 20, 25, 29, 34, 21, 36, 19, 27, 32, 23, 17, 38, 41, 16, 14, 12, 15, 39, 42, 10, 11, 13, 8, 9, 7, 6, 5, 44, 37, 43,
];
const STOCK_SUPPLIER_FIXED_DEFAULT: number[] = [
  1, 2, 4, 3, 1, 2, 1, 1, 4, 2, 3, 1, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 1, 3, 4, 2,
];

function lostEndSales(start: number, demand: number) {
  const lost = start - demand < 0 ? demand - start : 0;
  const end = start - demand > 0 ? start - demand : 0;
  const sales = demand - lost;
  return { lost, end, sales };
}

function finRow(
  lost: number,
  end: number,
  sales: number,
  orderYes: boolean,
  d: number,
  k: number,
  z: number,
  c: number,
  p: number,
  h: number
) {
  const revenue = d * sales;
  const reorder = orderYes ? k + z * c : 0;
  const penalty = p * lost;
  const holding = h * end;
  const profit = revenue - reorder - penalty - holding;
  return { revenue, reorder, penalty, holding, profit };
}

function stockModule6AddqSS(H: number[], supplierLead: number[], s: number, S: number, n: number) {
  const addq = new Array(n).fill(0);
  let p = 0;
  while (p < n) {
    if (Number.isFinite(H[p]!) && H[p]! < s) {
      let ld = Math.floor(supplierLead[p]!);
      if (!Number.isFinite(ld) || ld < 1) ld = 1;
      let z = S - H[p]!;
      if (!Number.isFinite(z)) z = 0;
      z = Math.max(0, Math.round(z));
      const tgt = p + ld;
      if (tgt >= 0 && tgt < n) addq[tgt] = (addq[tgt]! + z) as number;
      p = p + ld + 1;
    } else {
      p += 1;
    }
  }
  return addq;
}

export function drawStockDemand(
  rng: ReturnType<typeof createRngStream>,
  n: number,
  law: StockDemandLaw,
  b11: number
): number[] {
  const b = b11;
  if (law === "Exponential") {
    return Array.from({ length: n }, () => {
      const x = roundNonnegHalfUp(-b * Math.log(rng.uEps()));
      return Math.max(0, x);
    });
  }
  if (law === "Normal") {
    return Array.from({ length: n }, () => {
      const x = roundNonnegHalfUp(rng.rnorm(b, 6));
      return Math.max(0, x);
    });
  }
  if (law === "X each day") return new Array(n).fill(b);
  if (law === "Uniform") {
    return rng.randint(0, 40, n);
  }
  if (law === "Fixed") {
    return Array.from({ length: n }, (_, d) => STOCK_DEMAND_FIXED_DEFAULT[d % STOCK_DEMAND_FIXED_DEFAULT.length]!);
  }
  throw new Error("bad demand law");
}

export function drawStockSupplier(
  rng: ReturnType<typeof createRngStream>,
  n: number,
  law: StockSupplierLaw,
  b17: number
): number[] {
  const b = b17;
  if (law === "Exponential") {
    return Array.from({ length: n }, () => {
      const x = roundNonnegHalfUp(-b * Math.log(rng.uEps()));
      return Math.max(1, x);
    });
  }
  if (law === "Normal") {
    return Array.from({ length: n }, () => {
      const x = roundNonnegHalfUp(rng.rnorm(b, 1));
      return Math.max(1, x);
    });
  }
  if (law === "Each X days") {
    return new Array(n).fill(Math.max(1, Math.floor(b)));
  }
  if (law === "Uniform") {
    return rng.randint(1, 4, n);
  }
  if (law === "Next day") {
    return new Array(n).fill(1);
  }
  if (law === "Fixed") {
    return Array.from(
      { length: n },
      (_, d) => Math.max(1, STOCK_SUPPLIER_FIXED_DEFAULT[d % STOCK_SUPPLIER_FIXED_DEFAULT.length]!)
    );
  }
  throw new Error("bad supplier law");
}

export function stockSimulateTable(
  demand: number[],
  supplierLead: number[],
  s: number,
  S: number,
  startDay1: number,
  sellingPrice: number,
  orderFixed: number,
  widgetCost: number,
  penalty: number,
  holding: number
) {
  const n = demand.length;
  let addq = new Array(n).fill(0);
  const E: number[] = new Array(n);
  const lost: number[] = new Array(n);
  const end: number[] = new Array(n);
  const sales: number[] = new Array(n);
  const H: number[] = new Array(n);
  const maxIter = 15;
  for (let iter = 0; iter < maxIter; iter++) {
    let hPrev = Number.NaN;
    for (let d = 0; d < n; d++) {
      if (d === 0) {
        E[d] = startDay1 + addq[d]!;
      } else {
        E[d] = hPrev + addq[d]!;
      }
      const le = lostEndSales(E[d]!, demand[d]!);
      lost[d] = le.lost;
      end[d] = le.end;
      sales[d] = le.sales;
      H[d] = end[d]!;
      hPrev = end[d]!;
    }
    const newA = stockModule6AddqSS(H, supplierLead, s, S, n);
    if (newA.every((v, i) => v === addq[i])) break;
    addq = newA;
  }
  const orderYes = new Array(n).fill(false);
  {
    let p = 0;
    while (p < n) {
      if (Number.isFinite(H[p]!) && H[p]! < s) {
        orderYes[p] = true;
        let ld = Math.floor(supplierLead[p]!);
        if (!Number.isFinite(ld) || ld < 1) ld = 1;
        p = p + ld + 1;
      } else p += 1;
    }
  }
  const orderQty = H.map((h, d) => (orderYes[d] ? Math.max(0, Math.round(S - h!)) : 0));
  const out = {
    day: Array.from({ length: n }, (_, d) => `D${d + 1}`),
    start: E,
    demand,
    lost,
    end,
    order: orderYes.map((y) => (y ? "YES" : "")),
    lead: supplierLead,
    sales,
    revenue: new Array(n),
    reorder: new Array(n),
    pen: new Array(n),
    hold: new Array(n),
    profit: new Array(n),
  } as {
    day: string[];
    start: number[];
    demand: number[];
    lost: number[];
    end: number[];
    order: string[];
    lead: number[];
    sales: number[];
    revenue: number[];
    reorder: number[];
    pen: number[];
    hold: number[];
    profit: number[];
  };
  for (let d = 0; d < n; d++) {
    const f = finRow(
      lost[d]!,
      end[d]!,
      sales[d]!,
      orderYes[d]!,
      sellingPrice,
      orderFixed,
      orderQty[d]!,
      widgetCost,
      penalty,
      holding
    );
    out.revenue[d] = f.revenue;
    out.reorder[d] = f.reorder;
    out.pen[d] = f.penalty;
    out.hold[d] = f.holding;
    out.profit[d] = f.profit;
  }
  return out;
}

export function stockSummaryTotals(
  t: ReturnType<typeof stockSimulateTable>
) {
  const H = t.end;
  const meanH = H.reduce((a, b) => a + b, 0) / H.length;
  const sdH =
    H.length <= 1
      ? 0
      : Math.sqrt(
          H.map((h) => (h - meanH) ** 2).reduce((a, b) => a + b, 0) / (H.length - 1)
        ) || 0;
  return {
    meanEnd: meanH,
    sdEnd: Number.isFinite(sdH) ? sdH : 0,
    totDemand: t.demand.reduce((a, b) => a + b, 0),
    nOrders: t.order.filter((o) => o === "YES").length,
    totSales: t.sales.reduce((a, b) => a + b, 0),
    totRev: t.revenue.reduce((a, b) => a + b, 0),
    totReo: t.reorder.reduce((a, b) => a + b, 0),
    totPen: t.pen.reduce((a, b) => a + b, 0),
    totHold: t.hold.reduce((a, b) => a + b, 0),
    totProfit: t.profit.reduce((a, b) => a + b, 0),
    totLost: t.lost.reduce((a, b) => a + b, 0),
  };
}

export function stockPctPossibility(tot: ReturnType<typeof stockSummaryTotals>, sp: number, wc: number) {
  const denom = tot.totDemand * (sp - wc);
  if (!Number.isFinite(denom) || denom === 0) return Number.NaN;
  return (100 * tot.totProfit) / denom;
}

export function runStock(params: {
  nDays: number;
  seed: number;
  demandLaw: StockDemandLaw;
  supplierLaw: StockSupplierLaw;
  b11: number;
  b17: number;
  s: number;
  S: number;
  start: number;
  d: number;
  k: number;
  c: number;
  p: number;
  h: number;
}) {
  const n = params.nDays | 0;
  const rng = createRngStream(params.seed);
  const demand = drawStockDemand(rng, n, params.demandLaw, params.b11);
  const lead = drawStockSupplier(rng, n, params.supplierLaw, params.b17);
  const table = stockSimulateTable(
    demand,
    lead,
    params.s,
    params.S,
    params.start,
    params.d,
    params.k,
    params.c,
    params.p,
    params.h
  );
  const totals = stockSummaryTotals(table);
  return { table, totals, sp: params.d, wc: params.c, pct: stockPctPossibility(totals, params.d, params.c) };
}
