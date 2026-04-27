import { useEffect, useRef } from "react";
import Plotly from "plotly.js-dist-min";
import type { Data, Layout, Config } from "plotly.js";
import { GT } from "../theme";
import type { McPiResult } from "../sim/monteCarloPi";

type Props = { result: McPiResult | null };

export function PiPlot({ result }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !result || result.x.length === 0) {
      return;
    }

    const colors = result.inside.map((ins) => (ins ? GT.olympicTeal : GT.newHorizon));

    const trace: Partial<Data> = {
      type: "scatter",
      mode: "markers",
      x: result.x,
      y: result.y,
      marker: {
        size: 5,
        opacity: 0.75,
        color: colors,
      },
      hoverinfo: "x+y",
    };

    const layout: Partial<Layout> = {
      title: {
        text: `Proportion: ${(result.nIn / result.x.length).toFixed(4)}<br>π estimate: ${result.piHat.toFixed(4)}`,
        font: { color: GT.navy, size: 14 },
      },
      paper_bgcolor: GT.white,
      plot_bgcolor: GT.diploma,
      xaxis: {
        range: [0, 1],
        scaleanchor: "y",
        scaleratio: 1,
        gridcolor: GT.piMile,
        zeroline: false,
        color: GT.navy,
        title: { text: "" },
      },
      yaxis: {
        range: [0, 1],
        gridcolor: GT.piMile,
        zeroline: false,
        color: GT.navy,
        title: { text: "" },
      },
      shapes: [
        {
          type: "circle",
          xref: "x",
          yref: "y",
          x0: 0,
          y0: 0,
          x1: 1,
          y1: 1,
          line: { color: GT.navy, width: 2 },
        },
      ],
      margin: { t: 56, r: 16, b: 16, l: 16 },
      showlegend: false,
    };

    const config: Partial<Config> = {
      displayModeBar: true,
      responsive: true,
      scrollZoom: false,
    };

    void Plotly.newPlot(el, [trace], layout, config);

    return () => {
      void Plotly.purge(el);
    };
  }, [result]);

  if (!result || result.x.length === 0) {
    return (
      <div className="pi-plot-placeholder" style={{ minHeight: "min(68vh, 520px)" }}>
        <p style={{ color: GT.grayMatter }}>Set n and seed, then click Go.</p>
      </div>
    );
  }

  return <div ref={ref} className="pi-plot-root" style={{ width: "100%", minHeight: "min(68vh, 520px)" }} />;
}
