import { useCallback, useMemo, useState } from "react";
import { GT } from "./theme";
import { simulateMcPi } from "./sim/monteCarloPi";
import type { McPiResult } from "./sim/monteCarloPi";
import { PiPlot } from "./components/PiPlot";

export default function App() {
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
    <div className="app-shell">
      <header className="app-banner">
        <h1 className="app-title">BabySimulation — JS spike (Phase 0)</h1>
        <p className="app-sub">π Estimation · Vite + React + TypeScript + Plotly.js</p>
      </header>

      <main className="app-main">
        <section className="card">
          <h2 className="h2">Monte Carlo π (unit square, inscribed circle)</h2>
          <p className="muted">
            Geometry matches <code>R/monte-carlo-sim-pi.R</code>. RNG is Mulberry32 — dart clouds differ from R’s{" "}
            <code>runif</code> for the same seed.
          </p>

          <div className="controls">
            <label className="field">
              <span>n (darts)</span>
              <input
                type="number"
                min={100}
                max={10000}
                step={50}
                value={n}
                onChange={(e) => setN(Number(e.target.value) || 0)}
              />
            </label>
            <label className="field">
              <span>RNG seed</span>
              <input
                type="number"
                min={1}
                max={999999}
                step={1}
                value={seed}
                onChange={(e) => setSeed(Number(e.target.value) || 1)}
              />
            </label>
            <button type="button" className="btn-go" onClick={onGo}>
              Go
            </button>
          </div>

          {metrics && (
            <div className="metrics">
              <div>
                <strong>Number in circle:</strong> {metrics.inC}
              </div>
              <div>
                <strong>Number outside circle:</strong> {metrics.outC}
              </div>
              <div>
                <strong>π estimate:</strong> {metrics.est}
              </div>
              <div>
                <strong>Relative difference vs π (%):</strong> {metrics.rel.toFixed(4)}
              </div>
            </div>
          )}

          <PiPlot result={result} />
        </section>
      </main>
    </div>
  );
}
