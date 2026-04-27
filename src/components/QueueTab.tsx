import { useCallback, useState } from "react";
import { queueSimulateRun, QUEUE_LAW_CHOICES, QUEUE_INDICATOR_CHOICES, type QueueLaw, type QueueIndicator } from "../sim/queueSystem";
import { QueueClientsPlot, QueueGanttPlot, QueueInterarrivalPlot, QueueStackedPlot } from "./QueueCharts";
import { QueueDescription } from "./QueueDescription";
import { QueueKpiSummary } from "./QueueKpiSummary";
import { Queue, QueueUi } from "../rshiny/labels";

type Sub = "description" | "simulation";

function fmt(n: number, d = 4) {
  if (Number.isNaN(n) || n === undefined) return "—";
  if (d === 0) return String(Math.round(n));
  return n.toFixed(d);
}

function signif8(n: number) {
  if (!Number.isFinite(n)) return "NA";
  return String(Number(n.toPrecision(8)));
}

export function QueueTab() {
  const [sub, setSub] = useState<Sub>("description");
  const [arrival, setArrival] = useState<QueueLaw>("Exponential");
  const [service, setService] = useState<QueueLaw>("Each X minutes");
  const [b5, setB5] = useState(6);
  const [b11, setB11] = useState(7);
  const [nIter, setNIter] = useState(3);
  const [indicator, setIndicator] = useState<QueueIndicator>(QUEUE_INDICATOR_CHOICES[0]!);
  const [seed, setSeed] = useState(6644);
  const [run, setRun] = useState<ReturnType<typeof queueSimulateRun> | null>(null);

  const go = useCallback(() => {
    setRun(
      queueSimulateRun({
        arrival,
        service,
        b5,
        b11,
        nIter,
        nCustomers: 30,
        indicator,
        seed,
      })
    );
  }, [arrival, service, b5, b11, nIter, indicator, seed]);

  const t = run?.table;
  const ev = run?.events;
  const kpi = run?.kpi;
  const labels = t?.Customer ?? [];

  return (
    <section className="card">
      <h2 className="h2">Queue</h2>
      <nav className="nav-pills" aria-label="Queue">
        <button type="button" className={sub === "description" ? "nav-pill active" : "nav-pill"} onClick={() => setSub("description")}>
          Description
        </button>
        <button type="button" className={sub === "simulation" ? "nav-pill active" : "nav-pill"} onClick={() => setSub("simulation")}>
          Simulation
        </button>
      </nav>
      {sub === "description" && <QueueDescription active={sub === "description"} onGoToSimulation={() => setSub("simulation")} />}
      {sub === "simulation" && (
        <div className="simulation-panel">
          <div className="controls app-controls-bar flex-wrap">
            <label className="field" title={Queue.arrival.title}>
              <span>{Queue.arrival.label}</span>
              <select value={arrival} onChange={(e) => setArrival(e.target.value as QueueLaw)} aria-label={Queue.arrival.label}>
                {QUEUE_LAW_CHOICES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="field" title={Queue.service.title}>
              <span>{Queue.service.label}</span>
              <select value={service} onChange={(e) => setService(e.target.value as QueueLaw)} aria-label={Queue.service.label}>
                {QUEUE_LAW_CHOICES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <div className="field field-slider" style={{ minWidth: 160 }} title={Queue.b5.title}>
              <label htmlFor="q-b5">
                {Queue.b5.label} {b5}
              </label>
              <input
                id="q-b5"
                type="range"
                min={1}
                max={100}
                value={b5}
                onChange={(e) => setB5(+e.target.value)}
                aria-label={Queue.b5.label}
              />
            </div>
            <div className="field field-slider" style={{ minWidth: 160 }} title={Queue.b11.title}>
              <label htmlFor="q-b11">
                {Queue.b11.label} {b11}
              </label>
              <input
                id="q-b11"
                type="range"
                min={1}
                max={10}
                value={b11}
                onChange={(e) => setB11(+e.target.value)}
                aria-label={Queue.b11.label}
              />
            </div>
            <div className="field field-slider" style={{ minWidth: 120 }} title={Queue.nIter.title}>
              <label htmlFor="q-niter">
                {Queue.nIter.label} {nIter}
              </label>
              <input
                id="q-niter"
                type="range"
                min={1}
                max={100}
                value={nIter}
                onChange={(e) => setNIter(+e.target.value)}
                aria-label={Queue.nIter.label}
              />
            </div>
            <label className="field" style={{ minWidth: 200 }} title={Queue.indicator.title}>
              <span>{Queue.indicator.label}</span>
              <select
                value={indicator}
                onChange={(e) => setIndicator(e.target.value as QueueIndicator)}
                style={{ maxWidth: "100%" }}
                aria-label={Queue.indicator.label}
              >
                {QUEUE_INDICATOR_CHOICES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="field" title={Queue.seed.title}>
              <span>{Queue.seed.label}</span>
              <input
                type="number"
                min={1}
                max={2_147_483_647}
                value={seed}
                onChange={(e) => setSeed(Math.max(1, +e.target.value | 0))}
                aria-label={Queue.seed.label}
              />
            </label>
            <div className="app-controls-go-wrap">
              <button type="button" className="btn-go" onClick={go} title={Queue.go}>
                Go
              </button>
            </div>
          </div>

          <p className="mb-2 app-description-hint text-muted small" title={Queue.help}>
            {Queue.help}
          </p>

          {run && kpi && t && (
            <>
              <div className="queue-result-cols" style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                <div title={QueueUi.currentVerbatim} style={{ flex: "1 1 12rem" }}>
                  <h4 className="h2 method-subh4" title={Queue.h4Current.title}>
                    {Queue.h4Current.text}
                  </h4>
                  <p className="font-monospace queue-verbatim" title={QueueUi.currentVerbatim}>
                    {Number.isFinite(run.current)
                      ? `Current: ${signif8(run.current as number)}  (${indicator})`
                      : "Current: NA (indicator not recognized)."}
                  </p>
                </div>
                <div title={QueueUi.worstVerbatim} style={{ flex: "1 1 12rem" }}>
                  <h4 className="h2 method-subh4" title={Queue.h4Worst.title}>
                    {Queue.h4Worst.text}
                  </h4>
                  <p className="font-monospace queue-verbatim" title={QueueUi.worstVerbatim}>
                    Worst (max over iterations): {signif8(run.worst)}
                  </p>
                </div>
              </div>
              <h4 className="h2" style={{ marginTop: "0.75rem" }} title={Queue.h4Summary.title}>
                {Queue.h4Summary.text}
              </h4>
              <p className="queue-summary-hint text-muted small">{Queue.kpiRowHint}</p>
              <div title="Rendered KPI table for the last queue run.">
                <QueueKpiSummary kpi={kpi} />
              </div>
              <h4 className="h2" style={{ marginTop: "1rem" }} title={Queue.h4Charts.title}>
                {Queue.h4Charts.text}
              </h4>
              <p className="text-muted small">{Queue.chartsP}</p>
              <div className="queue-plot-row">
                <div className="queue-plot-wrap" title={QueueUi.interarrivalPlot}>
                  <QueueInterarrivalPlot tbl={t} customerLabel={labels} />
                </div>
                <div className="queue-plot-wrap" title={QueueUi.clientsPlot}>
                  <QueueClientsPlot tbl={t} customerLabel={labels} />
                </div>
              </div>
              <div className="queue-plot-row">
                <div className="queue-plot-wrap" title={QueueUi.ganttPlot}>
                  <QueueGanttPlot tbl={t} customerLabel={labels} />
                </div>
                <div className="queue-plot-wrap" title={QueueUi.waitStackPlot}>
                  <QueueStackedPlot tbl={t} customerLabel={labels} />
                </div>
              </div>
              <h4 className="h2" title={Queue.h4Customer.title}>
                {Queue.h4Customer.text}
              </h4>
              <p className="text-muted small">{Queue.idleP}</p>
              <div className="data-table-wrap queue-table-wrap" title={QueueUi.customerTableWrap}>
                <table className="data-table">
                  <thead>
                    <tr>
                      {["Customer", "Δ arr", "Arrival", "Start", "Svc", "End", "Wait", "Idle", "Line", "T sys"].map((c) => (
                        <th key={c}>{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {labels.map((ci, r) => (
                      <tr key={ci}>
                        <td>{ci}</td>
                        <td>{t.timeBetween[r] == null ? "—" : fmt(t.timeBetween[r]!, 0)}</td>
                        <td>{fmt(t.arrival[r]!)}</td>
                        <td>{fmt(t.start[r]!)}</td>
                        <td>{fmt(t.service[r]!)}</td>
                        <td>{fmt(t.end[r]!)}</td>
                        <td>{fmt(t.wait[r]!)}</td>
                        <td>{fmt(t.idle[r]!)}</td>
                        <td>{t.mcli[r]}</td>
                        <td>{fmt(t.tis[r]!)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {ev && (
                <>
                  <h4 className="h2" title={Queue.h4Events.title}>
                    {Queue.h4Events.text}
                  </h4>
                  <div className="data-table-wrap queue-table-wrap" title={QueueUi.eventsTableWrap}>
                    <table className="data-table data-table--compact">
                      <thead>
                        <tr>
                          {["Time", "A/D", "Δ", "n in sys", "nb·Δt"].map((c) => (
                            <th key={c}>{c}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {ev.time.map((time, r) => (
                          <tr key={r}>
                            <td>{fmt(time)}</td>
                            <td>{ev.arDep[r]}</td>
                            <td>{ev.delta[r]}</td>
                            <td>{ev.nInSys[r]}</td>
                            <td>{ev.nbClientTime[r] == null ? "—" : fmt(ev.nbClientTime[r]!)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </>
          )}
          {!run && <p className="muted small">Click Go to run the single-server queue.</p>}
        </div>
      )}
    </section>
  );
}
