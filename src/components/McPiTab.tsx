import { useCallback, useMemo, useState } from "react";
import { simulateMcPi } from "../sim/monteCarloPi";
import type { McPiResult } from "../sim/monteCarloPi";
import { PiPlot } from "./PiPlot";
import { McPiDescription } from "./McPiDescription";
import { McPi } from "../rshiny/labels";

type SubTab = "description" | "simulation";

function snapN(raw: number): number {
  const v = Math.round(raw / 50) * 50;
  return Math.min(10_000, Math.max(100, v));
}

export function McPiTab() {
  const [subTab, setSubTab] = useState<SubTab>("description");
  const [n, setN] = useState(500);
  const [seed, setSeed] = useState(12345);
  const [result, setResult] = useState<McPiResult | null>(null);

  const onGo = useCallback(() => {
    setResult(simulateMcPi(n, seed));
  }, [n, seed]);

  const metrics = useMemo(() => {
    if (!result || result.x.length === 0) return null;
    return {
      inC: result.nIn,
      outC: result.nOut,
      est: result.piHat,
      rel: result.relPctVsPi,
    };
  }, [result]);

  return (
    <section className="card mc-pi-tab">
      <h2 className="h2">π Estimation</h2>

      <nav className="nav-pills" aria-label="π estimation sections">
        <button
          type="button"
          className={subTab === "description" ? "nav-pill active" : "nav-pill"}
          onClick={() => setSubTab("description")}
        >
          Description
        </button>
        <button
          type="button"
          className={subTab === "simulation" ? "nav-pill active" : "nav-pill"}
          onClick={() => setSubTab("simulation")}
        >
          Simulation
        </button>
      </nav>

      {subTab === "description" && (
        <McPiDescription active={subTab === "description"} onGoToSimulation={() => setSubTab("simulation")} />
      )}

      {subTab === "simulation" && (
        <div className="simulation-panel">
          <div className="controls app-controls-bar">
            <div className="field field-slider" title={McPi.n.title}>
              <label htmlFor="mc-pi-n">
                {McPi.n.label} {n}
              </label>
              <input
                id="mc-pi-n"
                type="range"
                min={100}
                max={10_000}
                step={50}
                value={n}
                onChange={(e) => setN(snapN(Number(e.target.value)))}
                aria-label={McPi.n.label}
              />
            </div>
            <label className="field" title={McPi.seed.title}>
              <span>{McPi.seed.label}</span>
              <input
                type="number"
                min={1}
                max={999_999}
                step={1}
                value={seed}
                onChange={(e) => setSeed(Math.min(999_999, Math.max(1, Math.floor(Number(e.target.value)) || 1)))}
                aria-label={McPi.seed.label}
              />
            </label>
            <div className="app-controls-go-wrap">
              <button type="button" className="btn-go" onClick={onGo} title={McPi.go}>
                Go
              </button>
            </div>
          </div>

          {metrics ? (
            <div className="metrics mc-pi-metrics-row">
              <div title={McPi.metricIn}>
                <strong>Number in circle:</strong> {metrics.inC}
              </div>
              <div title={McPi.metricOut}>
                <strong>Number outside circle:</strong> {metrics.outC}
              </div>
              <div title={McPi.metricEst}>
                <strong>Pi estimate:</strong> {metrics.est.toFixed(4)}
              </div>
              <div title={McPi.metricRel}>
                <strong>Relative difference vs π (%):</strong> {metrics.rel.toFixed(4)}
              </div>
            </div>
          ) : (
            <p className="muted small">Click Go to run the simulation.</p>
          )}

          <div
            className="pi-plot-wrap"
            title={McPi.plotWrap}
          >
            <PiPlot result={result} />
          </div>
        </div>
      )}
    </section>
  );
}
