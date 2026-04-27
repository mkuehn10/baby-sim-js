import { useCallback, useState } from "react";
import { simulateGen3d, type Gen3dMode, type Gen3dResult } from "../sim/threedGen";
import { Gen3dPlot } from "./Gen3dPlot";
import { Gen3dDescription } from "./Gen3dDescription";

type SubTab = "description" | "simulation";

const SEED_MAX = 2_147_483_647;

function snapPoints(raw: number): number {
  const v = Math.round(raw / 50) * 50;
  return Math.min(10_000, Math.max(100, v));
}

export function Gen3dTab() {
  const [subTab, setSubTab] = useState<SubTab>("description");
  const [nChain, setNChain] = useState(5000);
  const [seed, setSeed] = useState(2048);
  const [mode, setMode] = useState<Gen3dMode>("good");
  const [result, setResult] = useState<Gen3dResult | null>(null);

  const onGo = useCallback(() => {
    setResult(simulateGen3d(nChain, seed, mode));
  }, [nChain, seed, mode]);

  return (
    <section className="card gen3d-tab">
      <h2 className="h2">3D Visualization</h2>
      <p className="muted small">
        LCG logic matches <code>R/threed_gen.R</code> (sequence length <code>n</code>, triples from overlapping uniforms
        scaled by <code>2^31</code>).
      </p>

      <nav className="nav-pills" aria-label="3D visualization sections">
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
        <Gen3dDescription active={subTab === "description"} onGoToSimulation={() => setSubTab("simulation")} />
      )}

      {subTab === "simulation" && (
        <div className="simulation-panel">
          <div className="controls app-controls-bar gen3d-controls">
            <div
              className="field field-slider"
              title="How many triples (x,y,z) to plot in 3D — same control as Shiny gen3d_n_points (LCG chain length n; triples from overlapping scaled uniforms)."
            >
              <label htmlFor="gen3d-n">n (3D points): {nChain}</label>
              <input
                id="gen3d-n"
                type="range"
                min={100}
                max={10_000}
                step={50}
                value={nChain}
                onChange={(e) => setNChain(snapPoints(Number(e.target.value)))}
              />
            </div>
            <label className="field" title="Starting state x₀ for the chosen LCG (same as Shiny threed_seed).">
              <span>x₀ (LCG seed / state)</span>
              <input
                type="number"
                min={1}
                max={SEED_MAX}
                step={1}
                value={seed}
                onChange={(e) =>
                  setSeed(Math.min(SEED_MAX, Math.max(1, Math.floor(Number(e.target.value)) || 1)))
                }
              />
            </label>
            <fieldset className="field field-radio" title="Compare a well-chosen LCG triple against the classic RANDU lattice.">
              <legend>LCG choice (a, m)</legend>
              <label className="radio-row">
                <input type="radio" name="gen3d-mode" checked={mode === "good"} onChange={() => setMode("good")} />
                Good
              </label>
              <label className="radio-row">
                <input type="radio" name="gen3d-mode" checked={mode === "randu"} onChange={() => setMode("randu")} />
                RANDU
              </label>
            </fieldset>
            <div className="app-controls-go-wrap">
              <button
                type="button"
                className="btn-go"
                onClick={onGo}
                title="Regenerate 3D points and refresh the interactive plot."
              >
                Go
              </button>
            </div>
          </div>

          {!result || result.x.length === 0 ? (
            <p className="muted small">Click Go to plot the point cloud (rotate and zoom in the chart).</p>
          ) : (
            <p className="muted small">
              Showing <strong>{result.x.length}</strong> triples from chain length {nChain} ({result.mode},{" "}
              <strong>{result.title}</strong>).
            </p>
          )}

          <div className="pi-plot-wrap gen3d-plot-wrap" title="Interactive 3D scatter in the unit cube.">
            <Gen3dPlot result={result} />
          </div>
        </div>
      )}
    </section>
  );
}
