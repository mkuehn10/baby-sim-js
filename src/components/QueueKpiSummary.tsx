import type { ReactNode } from "react";
import { QueueKpiTip } from "../rshiny/labels";
import type { QueueKpi } from "../sim/queueSystem";

function int0(x: number) {
  if (!Number.isFinite(x)) return "—";
  return String(Math.round(x));
}

function dec1(x: number) {
  if (!Number.isFinite(x)) return "—";
  return (Math.round(x * 10) / 10).toFixed(1);
}

function pct0(p: number) {
  if (!Number.isFinite(p)) return "—";
  return `${Math.round(p * 100)}%`;
}

function tip(lab: string) {
  return QueueKpiTip[lab] ?? "";
}

function Lab({ children }: { children: string }) {
  const t = tip(children);
  return (
    <td className="kpi-label">
      {t ? (
        <span className="kpi-tip-target" title={t}>
          {children}
        </span>
      ) : (
        children
      )}
    </td>
  );
}

function Val({ label, children, highlight }: { label: string; children: ReactNode; highlight?: boolean }) {
  const t = tip(label);
  const cls = highlight ? "kpi-val kpi-val--highlight" : "kpi-val";
  return (
    <td className={cls}>
      {t ? (
        <span className="kpi-tip-target" title={t}>
          {children}
        </span>
      ) : (
        children
      )}
    </td>
  );
}

function Sp() {
  return <td className="kpi-spacer" aria-hidden />;
}

/**
 * HTML structure mirrors R `queue_kpi_summary_ui()` in `R/queue_system.R`.
 */
export function QueueKpiSummary({ kpi }: { kpi: QueueKpi }) {
  return (
    <table className="queue-kpi-summary" role="grid">
      <tbody>
        <tr>
          <Lab>Waiting time / Client</Lab>
          <Val label="Waiting time / Client">{int0(kpi.mean_wait)}</Val>
          <Sp />
          <Lab>Average time in</Lab>
          <Val label="Average time in">{int0(kpi.mean_time_in)}</Val>
          <Sp />
          <Lab>Time of work</Lab>
          <Val label="Time of work">{int0(kpi.time_work)}</Val>
          <Sp />
          <Lab>Average Nb of clients</Lab>
          <Val label="Average Nb of clients">{dec1(kpi.avg_clients_events)}</Val>
        </tr>
        <tr>
          <td className="kpi-grey" colSpan={2} />
          <Sp />
          <td className="kpi-empty" colSpan={2} />
          <Sp />
          <Lab>% Busy</Lab>
          <Val label="% Busy">{pct0(kpi.pct_busy)}</Val>
          <Sp />
          <td className="kpi-empty" colSpan={2} />
        </tr>
        <tr>
          <Lab>Maximum waiting Time</Lab>
          <Val label="Maximum waiting Time">{int0(kpi.max_wait)}</Val>
          <Sp />
          <Lab>Max time in</Lab>
          <Val label="Max time in">{int0(kpi.max_time_in)}</Val>
          <Sp />
          <Lab>Exceeding Time</Lab>
          <Val label="Exceeding Time" highlight>
            {int0(kpi.exceed_time_total_minutes)}
          </Val>
          <Sp />
          <Lab>Max of clients</Lab>
          <Val label="Max of clients">{int0(kpi.max_clients)}</Val>
        </tr>
        <tr>
          <td className="kpi-grey" colSpan={2} />
          <Sp />
          <Lab>Non satisfied clients</Lab>
          <Val label="Non satisfied clients">{int0(kpi.nonsat)}</Val>
          <Sp />
          <Lab>Adverage service Time</Lab>
          <Val label="Adverage service Time">{int0(kpi.avg_service)}</Val>
          <Sp />
          <Lab>Out of time clients</Lab>
          <Val label="Out of time clients">{int0(kpi.out_of_time)}</Val>
        </tr>
      </tbody>
    </table>
  );
}
