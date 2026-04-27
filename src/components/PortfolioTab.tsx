import { useCallback, useState, useRef, useEffect, useLayoutEffect } from "react";
import type { Data, Layout, Config } from "plotly.js";
import { portfolioSimulate, SECTORS } from "../sim/portfolioSystem";
import Plotly from "plotly.js-dist-min";
import { GT } from "../theme";
import { typesetMath } from "../mathjaxTypeset";
import { PortfolioDescription } from "./PortfolioDescription";
import { Portfolio } from "../rshiny/labels";

type Sub = "description" | "simulation";

const SEED_MAX = 2_147_483_647;

export function PortfolioTab() {
  const [sub, setSub] = useState<Sub>("description");
  const [T, setT] = useState(5);
  const [seed, setSeed] = useState(6644);
  const [mu, setMu] = useState(1);
  const [sd, setSd] = useState(0.2);
  const [res, setRes] = useState<ReturnType<typeof portfolioSimulate> | null>(null);
  const fig = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);

  const go = useCallback(() => {
    setRes(portfolioSimulate(T, seed, mu, Math.max(1e-6, sd)));
  }, [T, seed, mu, sd]);

  useLayoutEffect(() => {
    if (sub !== "description" || !hintRef.current) return;
    void typesetMath(hintRef.current);
  }, [sub]);

  useEffect(() => {
    const el = fig.current;
    if (!el || !res) return;
    const years = res.totalsByYear.map((_, i) => i);
    const data: Data[] = [
      {
        type: "scatter",
        mode: "lines+markers",
        x: years,
        y: res.totalsByYear,
        line: { color: GT.boldBlue },
      } as Data,
    ];
    const layout: Partial<Layout> = {
      title: { text: "Total wealth by year", font: { color: GT.navy, size: 15 } },
      xaxis: { title: "Year index" },
      yaxis: { title: "Wealth" },
      paper_bgcolor: GT.white,
      plot_bgcolor: GT.diploma,
      margin: { t: 40, l: 50, b: 45, r: 16 },
    };
    const config: Partial<Config> = { responsive: true };
    void Plotly.newPlot(el, data, layout, config);
    return () => void Plotly.purge(el);
  }, [res]);

  return (
    <section className="card">
      <h2 className="h2">Portfolio</h2>
      <nav className="nav-pills" aria-label="Portfolio">
        <button type="button" className={sub === "description" ? "nav-pill active" : "nav-pill"} onClick={() => setSub("description")}>
          Description
        </button>
        <button type="button" className={sub === "simulation" ? "nav-pill active" : "nav-pill"} onClick={() => setSub("simulation")}>
          Simulation
        </button>
      </nav>
      {sub === "description" && (
        <div>
          <PortfolioDescription active={sub === "description"} onGoToSimulation={() => setSub("simulation")} />
          <p
            ref={hintRef}
            className="mb-2 app-description-hint text-muted"
            title={Portfolio.helpDesc}
            dangerouslySetInnerHTML={{
              __html: `Each year: one shared market draw <span>\\(G_t\\)</span> for all sectors; each sector multiplies prior wealth by <span>\\(\\max(0, X_{i,t} G_t)\\)</span> with raw normals from that row&rsquo;s mean/SD and the economy-wide mean/SD (see Description).`,
            }}
          />
        </div>
      )}
      {sub === "simulation" && (
        <div className="simulation-panel">
          <div className="controls app-controls-bar">
            <div className="field field-slider" title={Portfolio.T.title}>
              <label htmlFor="port-t">
                {Portfolio.T.label} {T}
              </label>
              <input id="port-t" type="range" min={1} max={10} value={T} onChange={(e) => setT(+e.target.value)} aria-label={Portfolio.T.label} />
            </div>
            <label className="field" title={Portfolio.seed.title}>
              <span>{Portfolio.seed.label}</span>
              <input
                type="number"
                min={1}
                max={SEED_MAX}
                value={seed}
                onChange={(e) => setSeed(Math.max(1, +e.target.value | 0))}
                aria-label={Portfolio.seed.label}
              />
            </label>
            <label className="field" title={Portfolio.mu.title}>
              <span>{Portfolio.mu.label}</span>
              <input type="number" step={0.01} value={mu} onChange={(e) => setMu(+e.target.value)} aria-label={Portfolio.mu.label} />
            </label>
            <label className="field" title={Portfolio.sd.title}>
              <span>{Portfolio.sd.label}</span>
              <input
                type="number"
                step={0.01}
                value={sd}
                onChange={(e) => setSd(Math.max(1e-6, +e.target.value))}
                aria-label={Portfolio.sd.label}
              />
            </label>
            <div className="app-controls-go-wrap">
              <button type="button" className="btn-go" onClick={go} title={Portfolio.go}>
                Go
              </button>
            </div>
          </div>
          {res && (
            <>
              <h4 className="h2" title={Portfolio.h4Bal.title}>
                {Portfolio.h4Bal.text}
              </h4>
              <div className="data-table-wrap" title={Portfolio.h4Bal.title}>
                <table className="data-table data-table--compact">
                  <thead>
                    <tr>
                      <th>Sector / row</th>
                      {Array.from({ length: res.nYears + 1 }, (_, j) => (
                        <th key={j}>y{j}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>G (economy)</td>
                      {Array.from({ length: res.nYears + 1 }, (_, j) => (
                        <td key={j}>{j === 0 ? "—" : (res.general[j - 1]! as number).toFixed(3)}</td>
                      ))}
                    </tr>
                    {SECTORS.map((s, i) => (
                      <tr key={s.name}>
                        <td>{s.name}</td>
                        {Array.from({ length: res.nYears + 1 }, (_, j) => (
                          <td key={j}>{(res.wealth[i]![j]! as number).toFixed(0)}</td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <td>Totals</td>
                      {res.totalsByYear.map((t, j) => (
                        <td key={j}>{t.toFixed(0)}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <h4 className="h2" title={Portfolio.h4Chart.title}>
                {Portfolio.h4Chart.text}
              </h4>
              <div ref={fig} className="pi-plot-root" style={{ width: "100%", minHeight: 300 }} title={Portfolio.h4Chart.title} />
            </>
          )}
        </div>
      )}
    </section>
  );
}
