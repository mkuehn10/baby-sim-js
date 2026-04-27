import { useCallback, useState } from "react";
import { runStock, STOCK_DEMAND_LAWS, STOCK_SUPPLIER_LAWS, type StockDemandLaw, type StockSupplierLaw } from "../sim/stockSystem";
import { StockDescription } from "./StockDescription";
import { StockKpiSummary } from "./StockKpiSummary";
import { Stock } from "../rshiny/labels";

type Sub = "description" | "simulation";

const SEED_MAX = 2_147_483_647;

export function StockTab() {
  const [sub, setSub] = useState<Sub>("description");
  const [nDays, setNDays] = useState(30);
  const [demandLaw, setDemandLaw] = useState<StockDemandLaw>("X each day");
  const [supLaw, setSupLaw] = useState<StockSupplierLaw>("Each X days");
  const [b11, setB11] = useState(70);
  const [b17, setB17] = useState(1);
  const [seed, setSeed] = useState(6644);
  const [s, setSLevel] = useState(50);
  const [S, setSUp] = useState(95);
  const [start, setStart] = useState(60);
  const [d, setD] = useState(10);
  const [k, setK] = useState(2);
  const [c, setC] = useState(4);
  const [p, setP] = useState(2);
  const [h, setH] = useState(2);
  const [res, setRes] = useState<ReturnType<typeof runStock> | null>(null);

  const go = useCallback(() => {
    if (S <= s) {
      window.alert("Need S > s.");
      return;
    }
    setRes(
      runStock({
        nDays,
        seed,
        demandLaw,
        supplierLaw: supLaw,
        b11,
        b17,
        s,
        S,
        start,
        d,
        k,
        c,
        p,
        h,
      })
    );
  }, [nDays, seed, demandLaw, supLaw, b11, b17, s, S, start, d, k, c, p, h]);

  const pctStr =
    res && Number.isFinite(res.pct) ? `${(Math.round(res.pct * 100) / 100).toString()}%` : "—";

  return (
    <section className="card">
      <h2 className="h2">(s, S) Inventory</h2>
      <nav className="nav-pills" aria-label="Stock">
        <button type="button" className={sub === "description" ? "nav-pill active" : "nav-pill"} onClick={() => setSub("description")}>
          Description
        </button>
        <button type="button" className={sub === "simulation" ? "nav-pill active" : "nav-pill"} onClick={() => setSub("simulation")}>
          Simulation
        </button>
      </nav>
      {sub === "description" && (
        <div>
          <StockDescription active={sub === "description"} onGoToSimulation={() => setSub("simulation")} />
          <p className="mb-2 app-description-hint text-muted small" title={Stock.helpDesc}>
            {Stock.helpDesc}
          </p>
        </div>
      )}
      {sub === "simulation" && (
        <div className="simulation-panel">
          <div className="stock-controls">
            <div className="field field-slider" style={{ minWidth: 200 }} title={Stock.nDays.title}>
              <label htmlFor="stock-horizon">
                {Stock.nDays.label} {nDays}
              </label>
              <input
                id="stock-horizon"
                type="range"
                min={5}
                max={60}
                value={nDays}
                onChange={(e) => setNDays(+e.target.value)}
                aria-label={Stock.nDays.label}
              />
            </div>
            <label className="field" title={Stock.demandLaw.title}>
              <span>{Stock.demandLaw.label}</span>
              <select value={demandLaw} onChange={(e) => setDemandLaw(e.target.value as StockDemandLaw)} aria-label={Stock.demandLaw.label}>
                {STOCK_DEMAND_LAWS.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </label>
            <label className="field" title={Stock.supLaw.title}>
              <span>{Stock.supLaw.label}</span>
              <select value={supLaw} onChange={(e) => setSupLaw(e.target.value as StockSupplierLaw)} aria-label={Stock.supLaw.label}>
                {STOCK_SUPPLIER_LAWS.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </label>
            <label className="field" title={Stock.b11.title}>
              <span>{Stock.b11.label}</span>
              <input
                type="number"
                min={0}
                max={70}
                value={b11}
                onChange={(e) => setB11(+e.target.value | 0)}
                aria-label={Stock.b11.label}
              />
            </label>
            <label className="field" title={Stock.b17.title}>
              <span>{Stock.b17.label}</span>
              <input
                type="number"
                min={1}
                max={30}
                value={b17}
                onChange={(e) => setB17(Math.max(1, +e.target.value | 0))}
                aria-label={Stock.b17.label}
              />
            </label>
            <label className="field" title={Stock.seed.title}>
              <span>{Stock.seed.label}</span>
              <input
                type="number"
                min={1}
                max={SEED_MAX}
                value={seed}
                onChange={(e) => setSeed(Math.max(1, +e.target.value | 0))}
                aria-label={Stock.seed.label}
              />
            </label>
            <label className="field" title={Stock.s.title}>
              <span>{Stock.s.label}</span>
              <input type="number" min={0} max={200} value={s} onChange={(e) => setSLevel(+e.target.value | 0)} aria-label={Stock.s.label} />
            </label>
            <label className="field" title={Stock.S.title}>
              <span>{Stock.S.label}</span>
              <input type="number" min={2} max={500} value={S} onChange={(e) => setSUp(+e.target.value | 0)} aria-label={Stock.S.label} />
            </label>
            <label className="field" title={Stock.start.title}>
              <span>{Stock.start.label}</span>
              <input type="number" min={0} max={500} value={start} onChange={(e) => setStart(+e.target.value | 0)} aria-label={Stock.start.label} />
            </label>
            <div className="app-controls-go-wrap">
              <button type="button" className="btn-go" onClick={go} title={Stock.go}>
                Go
              </button>
            </div>
            <label className="field" title={Stock.d.title}>
              <span>{Stock.d.label}</span>
              <input
                type="number"
                min={0}
                value={d}
                onChange={(e) => setD(+e.target.value)}
                aria-label={Stock.d.label}
              />
            </label>
            <label className="field" title={Stock.k.title}>
              <span>{Stock.k.label}</span>
              <input type="number" min={0} value={k} onChange={(e) => setK(+e.target.value)} aria-label={Stock.k.label} />
            </label>
            <label className="field" title={Stock.c.title}>
              <span>{Stock.c.label}</span>
              <input type="number" min={0} value={c} onChange={(e) => setC(+e.target.value)} aria-label={Stock.c.label} />
            </label>
            <label className="field" title={Stock.p.title}>
              <span>{Stock.p.label}</span>
              <input type="number" min={0} value={p} onChange={(e) => setP(+e.target.value)} aria-label={Stock.p.label} />
            </label>
            <label className="field" title={Stock.h.title}>
              <span>{Stock.h.label}</span>
              <input type="number" min={0} value={h} onChange={(e) => setH(+e.target.value)} aria-label={Stock.h.label} />
            </label>
          </div>
          <p className="mb-2 app-description-hint text-muted small" title={Stock.helpSim}>
            {Stock.helpSim}
          </p>
          {res && (
            <>
              <h4 className="h2" title={Stock.h4Sum.title}>
                {Stock.h4Sum.text}
              </h4>
              <p className="queue-summary-hint text-muted small" title={Stock.h4Sum.title}>
                {Stock.sumP}
              </p>
              <div title="Rendered KPI summary for the last stock run.">
                <StockKpiSummary totals={res.totals} pctStr={pctStr} />
              </div>
              <h4 className="h2" title={Stock.h4Day.title}>
                {Stock.h4Day.text}
              </h4>
              <div className="data-table-wrap queue-table-wrap" title="Full daily simulation table.">
                <table className="data-table data-table--compact">
                  <thead>
                    <tr>
                      {["Day", "Start", "Dmd", "Lost", "EOD", "Order", "Lead", "Sales", "Rev", "ReO", "Pen", "Hold", "Profit"].map(
                        (c) => (
                          <th key={c}>{c}</th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {res.table.day.map((day, r) => (
                      <tr key={day}>
                        <td>{day}</td>
                        <td>{res.table.start[r]!.toFixed(0)}</td>
                        <td>{res.table.demand[r]}</td>
                        <td>{res.table.lost[r]}</td>
                        <td>{res.table.end[r]}</td>
                        <td>{res.table.order[r]}</td>
                        <td>{res.table.lead[r]}</td>
                        <td>{res.table.sales[r]}</td>
                        <td>{res.table.revenue[r]!.toFixed(0)}</td>
                        <td>{res.table.reorder[r]!.toFixed(0)}</td>
                        <td>{res.table.pen[r]!.toFixed(0)}</td>
                        <td>{res.table.hold[r]!.toFixed(0)}</td>
                        <td>{res.table.profit[r]!.toFixed(0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
