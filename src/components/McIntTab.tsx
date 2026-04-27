import { useCallback, useState, useRef, useLayoutEffect } from "react";
import { monteCarloIntegrate, MC_INTEGRAND_LABEL, type McIntegrandId, MC_INTEGRAND_IDS } from "../sim/mcIntegrationSim";
import { McIntPlot } from "./McIntPlot";
import { typesetMath } from "../mathjaxTypeset";
import { McIntDescription } from "./McIntDescription";
import { McInt } from "../rshiny/labels";

type Sub = "description" | "simulation";

export function McIntTab() {
  const [sub, setSub] = useState<Sub>("description");
  const [id, setId] = useState<McIntegrandId>("sin_pi_u");
  const [n, setN] = useState(500);
  const [seed, setSeed] = useState(1234);
  const [res, setRes] = useState<ReturnType<typeof monteCarloIntegrate> | null>(null);
  const sumRef = useRef<HTMLDivElement>(null);

  const go = useCallback(() => {
    setRes(monteCarloIntegrate(n, seed, id));
  }, [n, seed, id]);

  useLayoutEffect(() => {
    if (!res || !sumRef.current) return;
    void typesetMath(sumRef.current);
  }, [res]);

  return (
    <section className="card">
      <h2 className="h2">Monte Carlo Integration</h2>
      <nav className="nav-pills" aria-label="MC int">
        <button type="button" className={sub === "description" ? "nav-pill active" : "nav-pill"} onClick={() => setSub("description")}>
          Description
        </button>
        <button type="button" className={sub === "simulation" ? "nav-pill active" : "nav-pill"} onClick={() => setSub("simulation")}>
          Simulation
        </button>
      </nav>
      {sub === "description" && <McIntDescription active={sub === "description"} onGoToSimulation={() => setSub("simulation")} />}
      {sub === "simulation" && (
        <div className="simulation-panel">
          <div className="controls app-controls-bar">
            <label className="field" title={McInt.f.title}>
              <span>{McInt.f.label}</span>
              <select
                value={id}
                onChange={(e) => setId(e.target.value as McIntegrandId)}
                aria-label={McInt.f.label}
              >
                {MC_INTEGRAND_IDS.map((k) => (
                  <option key={k} value={k}>
                    {MC_INTEGRAND_LABEL[k]}
                  </option>
                ))}
              </select>
            </label>
            <div className="field field-slider" title={McInt.n.title}>
              <label htmlFor="mc-n">
                {McInt.n.label} {n}
              </label>
              <input
                id="mc-n"
                type="range"
                min={100}
                max={5000}
                step={50}
                value={n}
                onChange={(e) => setN(+e.target.value)}
                aria-label={McInt.n.label}
              />
            </div>
            <label className="field" title={McInt.seed.title}>
              <span>{McInt.seed.label}</span>
              <input
                type="number"
                min={1}
                max={999_999}
                value={seed}
                onChange={(e) => setSeed(Math.max(1, +e.target.value | 0))}
                aria-label={McInt.seed.label}
              />
            </label>
            <div className="app-controls-bar-hint small text-muted" title={McInt.hint} style={{ alignSelf: "center" }}>
              {McInt.hint}
            </div>
            <div className="app-controls-go-wrap">
              <button type="button" className="btn-go" onClick={go} title={McInt.go}>
                Go
              </button>
            </div>
          </div>
          {res ? (
            <>
              <div ref={sumRef} title={McInt.summary} className="mb-2">
                <p className="text-muted small mb-0">
                  Integrand: {MC_INTEGRAND_LABEL[res.id]}. <strong>MC estimate</strong> = {res.estimate.toFixed(6)}. <strong>Exact</strong> ={" "}
                  {res.exact.toFixed(6)}.
                </p>
              </div>
              <div title={McInt.plot}>
                <McIntPlot u={res.u} fX={res.f_x} id={res.id} />
              </div>
            </>
          ) : (
            <p className="muted small">Click Go.</p>
          )}
        </div>
      )}
    </section>
  );
}
