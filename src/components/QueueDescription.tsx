import { useEffect, useRef } from "react";
import { typesetMath } from "../mathjaxTypeset";

type Props = {
  onGoToSimulation: () => void;
  active?: boolean;
};

/** R `queue_method_panel()` in `R/queue_system.R` */
export function QueueDescription({ onGoToSimulation, active = true }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return undefined;
    const el = rootRef.current;
    if (!el) return undefined;
    let cancel = false;
    const run = () => {
      if (!cancel) void typesetMath(el);
    };
    run();
    const t1 = window.setTimeout(run, 150);
    const t2 = window.setTimeout(run, 600);
    return () => {
      cancel = true;
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [active]);

  return (
    <div ref={rootRef} className="tab-method-summary">
      <h4 className="method-h4 h5 text-body mb-2">Single-server queue (FIFO)</h4>
      <p className="lesson-ref text-muted mb-2">
        <span className="lesson-ref-code">M3L5</span>
        {" — "}
        A Single-Server Queue
      </p>
      <p
        className="mb-3"
        dangerouslySetInnerHTML={{
          __html: `This is the first &ldquo;customers and a resource&rdquo; model: people (or jobs) arrive, possibly wait, occupy the server, then leave. Interarrivals \\((I_i)\\) and services \\((S_i)\\) are modeled as <strong>random</strong> (here, drawn from laws you pick); the <strong>FIFO</strong> discipline means whoever arrived earlier is served earlier when the server is busy.`,
        }}
      />
      <p
        className="mb-3"
        dangerouslySetInnerHTML={{
          __html: `Performance measures you care about in practice&mdash;mean waiting time, mean time in system, utilization&mdash;are all <strong>functions of the same underlying sample path</strong>. The lecture also emphasizes an <strong>event</strong> picture: only arrivals and departures can change the count in system \\(L(t)\\). Plotting \\(L(t)\\) as a step function makes &ldquo;person-time&rdquo; and utilization arguments intuitive (area under the curve / length of horizon).`,
        }}
      />
      <p className="fw-semibold mb-2">Customer-level recursion (matches the slide table)</p>
      <p
        className="mb-2"
        dangerouslySetInnerHTML={{
          __html: `\\(I_i\\): minutes between arrivals of customers \\((i-1)\\) and \\(i\\). \\(A_i\\): arrival epoch (cumulative sum of interarrivals). \\(T_i\\): when service starts&mdash;either on arrival if the system is empty, or when the previous customer finishes, whichever is later: \\(T_i=\\max(A_i,D_{i-1})\\) with \\(D_0=0\\). \\(S_i\\): service time; \\(D_i=T_i+S_i\\): departure. Queue wait \\(W_i^Q=T_i-A_i\\); total time in system \\(W_i=D_i-A_i\\) (often \\(W_i=S_i+W_i^Q\\)). Idle time before customer \\(i\\) is \\(\\max(0,A_i-D_{i-1})\\). <strong>Clients in line</strong> at \\(A_i\\) counts earlier customers still present at that instant.`,
        }}
      />
      <p
        className="mb-3 text-center"
        dangerouslySetInnerHTML={{
          __html: `$$ A_i = \\sum_{j=1}^{i} I_j,\\quad T_i = \\max(A_i, D_{i-1}),\\quad D_i = T_i + S_i,\\quad W_i^{Q} = T_i - A_i,\\quad W_i = D_i - A_i $$`,
        }}
      />
      <p
        className="mb-2 text-muted app-description-footer"
        dangerouslySetInnerHTML={{
          __html: "The slides reorder service to <strong>LIFO</strong> with the same numbers to show discipline matters; this app stays <strong>FIFO</strong>.",
        }}
      />
      <p
        className="mb-0 text-muted app-description-footer"
        dangerouslySetInnerHTML={{
          __html:
            "<strong>Simulation</strong> sub-tab: pick arrival and service laws, parameters, outer iterations, indicator, and seed; <strong>Go</strong> fills customer and event tables, plots, and KPI cards (last run plus worst-of indicator across iterations).",
        }}
      />
      <div className="mt-2">
        <button type="button" className="link-like" onClick={onGoToSimulation}>
          Go to simulation
        </button>
      </div>
    </div>
  );
}
