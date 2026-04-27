import { useEffect, useRef } from "react";
import Plotly from "plotly.js-dist-min";
import type { Data, Layout, Config } from "plotly.js";
import { GT } from "../theme";
import type { CustomerTable } from "../sim/queueSystem";

function gapsForPlot(tbl: CustomerTable) {
  const n = tbl.arrival.length;
  const g = tbl.timeBetween.map((v) => (v == null ? Number.NaN : v));
  if (n) g[0] = tbl.arrival[0] ?? Number.NaN;
  return g.map((v) => (Number.isFinite(v) ? v! : 0));
}

export function QueueInterarrivalPlot({ tbl, customerLabel }: { tbl: CustomerTable; customerLabel: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const y = gapsForPlot(tbl);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const data: Data[] = [{ type: "bar", x: customerLabel, y, marker: { color: GT.boldBlue } }];
    const layout: Partial<Layout> = {
      title: { text: "Times between arrivals", font: { size: 13, color: GT.navy } },
      xaxis: { title: "Customer" },
      yaxis: { title: "Minutes" },
      margin: { t: 32, b: 48, l: 50, r: 16 },
      paper_bgcolor: GT.white,
      plot_bgcolor: GT.diploma,
    };
    void Plotly.newPlot(el, data, layout, { responsive: true } as Config);
    return () => void Plotly.purge(el);
  }, [customerLabel, y, tbl]);
  return <div ref={ref} className="queue-plot" style={{ height: 280, width: "100%" }} />;
}

export function QueueClientsPlot({ tbl, customerLabel }: { tbl: CustomerTable; customerLabel: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const data: Data[] = [{ type: "bar", x: customerLabel, y: tbl.mcli, marker: { color: GT.olympicTeal } }];
    const layout: Partial<Layout> = {
      title: { text: "Clients in the line (at arrival)", font: { size: 13, color: GT.navy } },
      xaxis: { title: "Customer" },
      yaxis: { title: "Count" },
      margin: { t: 32, b: 48, l: 50, r: 16 },
      paper_bgcolor: GT.white,
      plot_bgcolor: GT.diploma,
    };
    void Plotly.newPlot(el, data, layout, { responsive: true } as Config);
    return () => void Plotly.purge(el);
  }, [customerLabel, tbl]);
  return <div ref={ref} className="queue-plot" style={{ height: 280, width: "100%" }} />;
}

export function QueueGanttPlot({ tbl, customerLabel }: { tbl: CustomerTable; customerLabel: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const n = customerLabel.length;
  useEffect(() => {
    const el = ref.current;
    if (!el || n === 0) return;
    const h = tbl.start;
    const j = tbl.end;
    const a = tbl.arrival;
    const traces: Data[] = [];
    for (let i = 0; i < n; i++) {
      traces.push({
        type: "scatter",
        mode: "lines",
        x: [h[i]!, j[i]!],
        y: [customerLabel[i]!, customerLabel[i]!],
        line: { width: 8, color: "#857437" },
        showlegend: false,
        hoverinfo: "x+y",
      } as Data);
    }
    traces.push({
      type: "scatter",
      mode: "markers",
      x: a,
      y: customerLabel,
      marker: { symbol: "square", size: 8, color: GT.navy },
      showlegend: false,
    } as Data);
    const layout: Partial<Layout> = {
      title: { text: "Service intervals (Gantt)", font: { size: 13, color: GT.navy } },
      xaxis: { title: "Time (minutes)" },
      yaxis: { title: "" },
      margin: { t: 32, b: 40, l: 56, r: 16 },
      paper_bgcolor: GT.white,
      plot_bgcolor: GT.diploma,
    };
    void Plotly.newPlot(el, traces, layout, { responsive: true } as Config);
    return () => void Plotly.purge(el);
  }, [tbl, customerLabel, n, tbl.arrival, tbl.end, tbl.start]);
  return <div ref={ref} className="queue-plot" style={{ height: 480, width: "100%" }} />;
}

export function QueueStackedPlot({ tbl, customerLabel }: { tbl: CustomerTable; customerLabel: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const n = customerLabel.length;
  useEffect(() => {
    const el = ref.current;
    if (!el || n === 0) return;
    const data: Data[] = [
      { type: "bar", x: customerLabel, y: tbl.wait, name: "Waiting", marker: { color: GT.newHorizon } },
      { type: "bar", x: customerLabel, y: tbl.service, name: "Service", marker: { color: GT.boldBlue } },
    ];
    const layout: Partial<Layout> = {
      barmode: "stack",
      title: { text: "Time in system by customer (stacked)", font: { size: 13, color: GT.navy } },
      xaxis: { title: "Customer" },
      yaxis: { title: "Minutes" },
      legend: { orientation: "h", y: 1.1 },
      margin: { t: 48, b: 40, l: 50, r: 16 },
      paper_bgcolor: GT.white,
      plot_bgcolor: GT.diploma,
    };
    void Plotly.newPlot(el, data, layout, { responsive: true } as Config);
    return () => void Plotly.purge(el);
  }, [tbl, customerLabel, n]);
  return <div ref={ref} className="queue-plot" style={{ height: 480, width: "100%" }} />;
}
