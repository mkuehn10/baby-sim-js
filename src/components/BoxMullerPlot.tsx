import { useEffect, useRef } from "react";
import Plotly from "plotly.js-dist-min";
import type { Data, Layout, Config } from "plotly.js";
import { GT } from "../theme";

type Props = { z1: number[]; z2: number[]; title: string };

export function BoxMullerPlot({ z1, z2, title }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || z1.length === 0) return;
    const trace: Partial<Data> = {
      type: "scatter",
      mode: "markers",
      x: z1,
      y: z2,
      marker: { color: GT.olympicTeal, opacity: 0.2, size: 4 },
    };
    const layout: Partial<Layout> = {
      title: { text: title, font: { color: GT.navy, size: 16 } },
      xaxis: { range: [-3, 3], title: "Z1", color: GT.navy, gridcolor: GT.piMile, zeroline: true, zerolinecolor: GT.navy },
      yaxis: { range: [-3, 3], title: "Z2", color: GT.navy, gridcolor: GT.piMile, zeroline: true, zerolinecolor: GT.navy, scaleanchor: "x" },
      paper_bgcolor: GT.white,
      plot_bgcolor: GT.diploma,
      margin: { t: 40, l: 50, r: 20, b: 45 },
    };
    const config: Partial<Config> = { displayModeBar: true, responsive: true };
    void Plotly.newPlot(el, [trace], layout, config);
    return () => {
      void Plotly.purge(el);
    };
  }, [z1, z2, title]);

  return <div ref={ref} className="bm-plot-root" style={{ width: 520, maxWidth: "100%", height: 520, margin: "0 auto" }} />;
}
