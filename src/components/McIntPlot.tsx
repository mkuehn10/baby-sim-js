import { useEffect, useRef, useMemo } from "react";
import Plotly from "plotly.js-dist-min";
import type { Data, Layout, Config } from "plotly.js";
import { GT } from "../theme";
import type { McIntegrandId } from "../sim/mcIntegrationSim";

type Props = {
  u: number[];
  fX: number[];
  id: McIntegrandId;
};

function curveF(x: number, id: McIntegrandId) {
  if (id === "sin_pi_u") return Math.sin(Math.PI * x);
  const t = Math.min(Math.max(x, 1e-6), 1 - 1e-6);
  return Math.log(t) * Math.log(1 - t);
}

export function McIntPlot({ u, fX, id }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const line = useMemo(() => {
    const xs: number[] = [];
    const ys: number[] = [];
    for (let i = 0; i <= 500; i++) {
      const x = i / 500;
      xs.push(x);
      ys.push(curveF(x, id));
    }
    return { xs, ys };
  }, [id]);

  useEffect(() => {
    const el = ref.current;
    if (!el || u.length === 0) return;
    // Vertical segments (u,0)→(u,f(u)) — same idea as R `geom_segment` in `plot_mc_int()`.
    const xStem: (number | null)[] = [];
    const yStem: (number | null)[] = [];
    for (let i = 0; i < u.length; i++) {
      const x = u[i]!;
      const y = fX[i]!;
      xStem.push(x, x, null);
      yStem.push(0, y, null);
    }
    const stems: Partial<Data> = {
      type: "scatter",
      mode: "lines",
      x: xStem,
      y: yStem,
      name: "sample heights",
      line: { color: "rgba(58, 93, 174, 0.4)", width: 1 },
      hoverinfo: "skip",
    };
    const sc: Partial<Data> = {
      type: "scatter",
      mode: "markers",
      x: u,
      y: fX,
      name: "samples",
      marker: { color: GT.boldBlue, opacity: 0.45, size: 4 },
    };
    const fnCurve: Partial<Data> = {
      type: "scatter",
      mode: "lines",
      x: line.xs,
      y: line.ys,
      name: "f(u)",
      line: { color: GT.newHorizon, width: 1.2 },
    };
    const layout: Partial<Layout> = {
      title: {
        text: "Monte Carlo Integration<br><sub style='font-size:0.9em'>Points: uniform samples; curve: f(u)</sub>",
        font: { color: GT.navy, size: 15 },
      },
      xaxis: { title: "u", color: GT.navy, range: [0, 1] },
      yaxis: { title: "f(u)", color: GT.navy, rangemode: "tozero" },
      paper_bgcolor: GT.white,
      plot_bgcolor: GT.diploma,
      showlegend: false,
      margin: { t: 50, l: 55, r: 20, b: 45 },
    };
    const config: Partial<Config> = { displayModeBar: true, responsive: true };
    // Draw order: stems under markers, smooth f(u) on top (matches R ggplot layer order).
    void Plotly.newPlot(el, [stems, sc, fnCurve], layout, config);
    return () => {
      void Plotly.purge(el);
    };
  }, [u, fX, id, line.xs, line.ys]);

  return <div ref={ref} className="pi-plot-root" style={{ width: "100%", minHeight: "52vh" }} />;
}
