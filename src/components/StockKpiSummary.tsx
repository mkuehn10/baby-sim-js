import { StockKpiTip } from "../rshiny/labels";
import { runStock } from "../sim/stockSystem";

type Tot = ReturnType<typeof runStock>["totals"];

function int0(x: number) {
  if (!Number.isFinite(x)) return "—";
  return String(Math.round(x));
}

function dec2(x: number) {
  if (!Number.isFinite(x)) return "—";
  return (Math.round(x * 100) / 100).toFixed(2);
}

function tip(lab: string) {
  return StockKpiTip[lab] ?? "";
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

function Val({ label, v }: { label: string; v: string }) {
  const t = tip(label);
  return (
    <td className="kpi-val">
      {t ? (
        <span className="kpi-tip-target" title={t}>
          {v}
        </span>
      ) : (
        v
      )}
    </td>
  );
}

function Sp() {
  return <td className="kpi-spacer" aria-hidden />;
}

/**
 * Mirrors R `stock_kpi_summary_ui()` in `R/stock_system.R`.
 */
export function StockKpiSummary({ totals, pctStr }: { totals: Tot; pctStr: string }) {
  return (
    <table className="queue-kpi-summary" role="grid">
      <tbody>
        <tr>
          <Lab>Mean end-of-day stock</Lab>
          <Val label="Mean end-of-day stock" v={dec2(totals.meanEnd)} />
          <Sp />
          <Lab>SD of end-of-day stock</Lab>
          <Val label="SD of end-of-day stock" v={dec2(totals.sdEnd)} />
          <Sp />
          <Lab>Total demand</Lab>
          <Val label="Total demand" v={int0(totals.totDemand)} />
          <Sp />
          <Lab>Orders placed</Lab>
          <Val label="Orders placed" v={int0(totals.nOrders)} />
          <Sp />
          <Lab>Total lost sales</Lab>
          <Val label="Total lost sales" v={int0(totals.totLost)} />
          <Sp />
          <Lab>Profit vs demand-margin %</Lab>
          <Val label="Profit vs demand-margin %" v={pctStr} />
        </tr>
        <tr>
          <Lab>Total sales</Lab>
          <Val label="Total sales" v={int0(totals.totSales)} />
          <Sp />
          <Lab>Total revenue</Lab>
          <Val label="Total revenue" v={int0(totals.totRev)} />
          <Sp />
          <Lab>Total reorder cost</Lab>
          <Val label="Total reorder cost" v={int0(totals.totReo)} />
          <Sp />
          <Lab>Total penalty</Lab>
          <Val label="Total penalty" v={int0(totals.totPen)} />
          <Sp />
          <Lab>Total holding</Lab>
          <Val label="Total holding" v={int0(totals.totHold)} />
          <Sp />
          <Lab>Total profit</Lab>
          <Val label="Total profit" v={int0(totals.totProfit)} />
        </tr>
      </tbody>
    </table>
  );
}
