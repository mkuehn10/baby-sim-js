import { useCallback, useMemo, useState } from "react";
import { simulateMcPi } from "../sim/monteCarloPi";
import type { McPiResult } from "../sim/monteCarloPi";
import { PiPlot } from "./PiPlot";
import { McPiDescription } from "./McPiDescription";

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
      <p className="muted small">
        Geometry matches <code>R/monte-carlo-sim-pi.R</code>. RNG is Mulberry32 — dart clouds differ from R’s{" "}
        <code>runif</code> for the same seed.
      </p>

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
            <div
              className="field field-slider"
              title="Sample size inside the unit square; more points usually tighten the π estimate."
            >
              <label htmlFor="mc-pi-n">n (darts / MC sample size): {n}</label>
              <input
                id="mc-pi-n"
                type="range"
                min={100}
                max={10_000}
                step={50}
                value={n}
                onChange={(e) => setN(snapN(Number(e.target.value)))}
              />
            </div>
            <label className="field" title="Fixes the uniform dart positions before you click Go; same seed reproduces the same cloud.">
              <span>RNG seed</span>
              <input
                type="number"
                min={1}
                max={999_999}
                step={1}
                value={seed}
                onChange={(e) => setSeed(Math.min(999_999, Math.max(1, Math.floor(Number(e.target.value)) || 1)))}
              />
            </label>
            <div className="app-controls-go-wrap">
              <button
                type="button"
                className="btn-go"
                onClick={onGo}
                title="Throw all darts once, count inside the inscribed circle, and refresh the plot and numbers."
              >
                Go
              </button>
            </div>
          </div>

          {metrics ? (
            <div className="metrics mc-pi-metrics-row">
              <div title="Count of points inside the circle centered at (0.5, 0.5) with radius 0.5 (inscribed in the unit square).">
                <strong>Number in circle:</strong> {metrics.inC}
              </div>
              <div title="Count of points in the square but not inside that inscribed circle.">
                <strong>Number outside circle:</strong> {metrics.outC}
              </div>
              <div title="Monte Carlo estimate 4 × (inside count) / n as an approximation of π.">
                <strong>π estimate:</strong> {metrics.est.toFixed(4)}
              </div>
              <div title="Percent absolute error of the estimate versus true π.">
                <strong>Relative difference vs π (%):</strong> {metrics.rel.toFixed(4)}
              </div>
            </div>
          ) : (
            <p className="muted small">Click Go to run the simulation.</p>
          )}

          <div
            className="pi-plot-wrap"
            title="Scatter in the unit square: inscribed circle (same hit rule as the formulas above)."
          >
            <PiPlot result={result} />
          </div>
        </div>
      )}
    </section>
  );
}
