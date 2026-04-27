import { useEffect, useRef } from "react";
import Plotly from "plotly.js-dist-min";
import type { Data, Layout, Config } from "plotly.js";
import { GT } from "../theme";
import type { Gen3dResult } from "../sim/threedGen";

type Props = { result: Gen3dResult | null };

export function Gen3dPlot({ result }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !result || result.x.length === 0) {
      return;
    }

    const trace: Partial<Data> = {
      type: "scatter3d",
      mode: "markers",
      x: result.x,
      y: result.y,
      z: result.z,
      marker: {
        size: 2.5,
        opacity: 0.55,
        color: GT.boldBlue,
        line: { width: 0.15, color: GT.navy },
      },
      hoverinfo: "x+y+z",
    };

    const axis = {
      color: GT.navy,
      gridcolor: GT.piMile,
      showbackground: true,
      backgroundcolor: GT.white,
    };

    const layout: Partial<Layout> = {
      title: {
        text: result.title,
        font: { color: GT.navy, size: 17 },
        xref: "paper",
        x: 0.5,
      },
      paper_bgcolor: GT.white,
      plot_bgcolor: GT.diploma,
      font: { color: GT.navy, family: "system-ui, sans-serif" },
      scene: {
        bgcolor: GT.diploma,
        xaxis: axis,
        yaxis: axis,
        zaxis: axis,
      },
      margin: { l: 0, r: 0, b: 0, t: 52 },
      showlegend: false,
    };

    const config: Partial<Config> = {
      displayModeBar: true,
      responsive: true,
      scrollZoom: true,
    };

    void Plotly.newPlot(el, [trace], layout, config);

    return () => {
      void Plotly.purge(el);
    };
  }, [result]);

  if (!result || result.x.length === 0) {
    return (
      <div className="pi-plot-placeholder gen3d-plot-placeholder" style={{ minHeight: "85vh" }}>
        <p style={{ color: GT.grayMatter }}>Set n, seed, and LCG; then click Go.</p>
      </div>
    );
  }

  return <div ref={ref} className="pi-plot-root gen3d-plot-root" style={{ width: "100%", minHeight: "85vh" }} />;
}
