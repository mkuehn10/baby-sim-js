import { useCallback, useState } from "react";
import { simulateBoxMuller } from "../sim/boxMullerSim";
import { BoxMullerPlot } from "./BoxMullerPlot";
import { BoxMullerDescription } from "./BoxMullerDescription";
import { BoxMuller } from "../rshiny/labels";

type Sub = "description" | "simulation";
type Mode = "good" | "randu" | "fibonacci";

export function BoxMullerTab() {
  const [sub, setSub] = useState<Sub>("description");
  const [n, setN] = useState(1000);
  const [seed, setSeed] = useState(2048);
  const [mode, setMode] = useState<Mode>("good");
  const [z1, setZ1] = useState<number[]>([]);
  const [z2, setZ2] = useState<number[]>([]);
  const [title, setTitle] = useState("");

  const go = useCallback(() => {
    const p = Math.max(2, Math.min(30_000, n | 0));
    setN(p);
    const r = simulateBoxMuller(p, seed, mode);
    setZ1(r.z1);
    setZ2(r.z2);
    setTitle(r.title);
  }, [n, seed, mode]);

  return (
    <section className="card">
      <h2 className="h2">Box–Muller</h2>
      <nav className="nav-pills" aria-label="Box–Muller">
        <button type="button" className={sub === "description" ? "nav-pill active" : "nav-pill"} onClick={() => setSub("description")}>
          Description
        </button>
        <button type="button" className={sub === "simulation" ? "nav-pill active" : "nav-pill"} onClick={() => setSub("simulation")}>
          Simulation
        </button>
      </nav>
      {sub === "description" && <BoxMullerDescription active={sub === "description"} onGoToSimulation={() => setSub("simulation")} />}
      {sub === "simulation" && (
        <div className="simulation-panel">
          <div className="controls app-controls-bar">
            <div className="field field-slider" title={BoxMuller.n.title}>
              <label htmlFor="bm-n">
                {BoxMuller.n.label} {n}
              </label>
              <input
                id="bm-n"
                type="range"
                min={100}
                max={30_000}
                step={100}
                value={n}
                onChange={(e) => setN(+e.target.value)}
                aria-label={BoxMuller.n.label}
              />
            </div>
            <label className="field" title={BoxMuller.seed.title}>
              <span>{BoxMuller.seed.label}</span>
              <input
                type="number"
                min={1}
                max={999_999}
                value={seed}
                onChange={(e) => setSeed(Math.max(1, +e.target.value | 0))}
                aria-label={BoxMuller.seed.label}
              />
            </label>
            <fieldset className="field field-radio" title={BoxMuller.radio.title}>
              <legend>{BoxMuller.radio.legend}</legend>
              {(
                [
                  ["good", "Good"],
                  ["randu", "RANDU"],
                  ["fibonacci", "Fibonacci"],
                ] as const
              ).map(([k, lab]) => (
                <label key={k} className="radio-row">
                  <input type="radio" name="bm-m" checked={mode === k} onChange={() => setMode(k)} />
                  {lab}
                </label>
              ))}
            </fieldset>
            <div className="app-controls-go-wrap">
              <button type="button" className="btn-go" onClick={go} title={BoxMuller.go}>
                Go
              </button>
            </div>
          </div>
          {z1.length ? (
            <div className="bm-plot-wrap" title={BoxMuller.plotWrap}>
              <BoxMullerPlot z1={z1} z2={z2} title={title} />
            </div>
          ) : (
            <p className="muted small">Click Go to generate a scatter of Box–Muller pairs.</p>
          )}
        </div>
      )}
    </section>
  );
}
