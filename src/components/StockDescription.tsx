import { useEffect, useRef } from "react";
import { typesetMath } from "../mathjaxTypeset";

type Props = { onGoToSimulation: () => void; active?: boolean };

/** R `stock_method_panel()` in `R/stock_system.R` */
export function StockDescription({ onGoToSimulation, active = true }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!active) return undefined;
    const el = rootRef.current;
    if (!el) return undefined;
    let c = false;
    const run = () => {
      if (!c) void typesetMath(el);
    };
    run();
    const t1 = window.setTimeout(run, 150);
    const t2 = window.setTimeout(run, 600);
    return () => {
      c = true;
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [active]);

  return (
    <div ref={rootRef} className="tab-method-summary">
      <h4 className="method-h4 h5 text-body mb-2">(s, S) inventory system</h4>
      <p className="lesson-ref text-muted mb-2">
        <span className="lesson-ref-code">M3L6</span>
        {" — "}
        An (s, S) Inventory System
      </p>
      <p
        className="mb-3"
        dangerouslySetInnerHTML={{
          __html: `Inventory is a workhorse discrete-time simulation: each day you observe <strong>demand</strong>, update on-hand stock, maybe place an order, and accrue revenue and costs. The \\((s,S)\\) policy is a simple <strong>two-number rule</strong> managers can remember: if end-of-day inventory slips <em>below</em> \\(s\\), order up to \\(S\\); otherwise do nothing. Day-by-day ledgers on paper or in a table are transparent but slow to extend; this tab automates the same walk.`,
        }}
      />
      <p className="fw-semibold mb-2">Policy (from the slides)</p>
      <ul className="mb-3 ps-3">
        <li dangerouslySetInnerHTML={{ __html: "Sell at <strong>\\(d\\)</strong> per unit." }} />
        <li
          dangerouslySetInnerHTML={{
            __html: `Reorder point <strong>\\(s\\)</strong>, order-up-to <strong>\\(S\\)</strong>: if end-of-day stock falls <em>below</em> \\(s\\), place an order so stock reaches \\(S\\) after delivery (timing follows your <strong>lead-time law</strong>).`,
          }}
        />
        <li
          dangerouslySetInnerHTML={{
            __html: `Costs: setup <strong>\\(K\\)</strong> plus <strong>\\(c\\)</strong> per unit ordered when an order fires; <strong>\\(h\\)</strong> per unit held overnight; <strong>\\(p\\)</strong> per unit of lost sales. <strong>No backorders</strong>.`,
          }}
        />
      </ul>
      <p
        className="mb-2"
        dangerouslySetInnerHTML={{
          __html: `<strong>Notation.</strong> \\(I_i\\): end-of-day stock; \\(D_i\\): demand that day; \\(Z_i\\): order quantity triggered at the end of day \\(i\\). Unmet demand is <strong>lost sales</strong> (no backlog queue of customers)&mdash;a modeling choice that keeps the state space compact.`,
        }}
      />
      <p
        className="mb-2 text-center"
        dangerouslySetInnerHTML={{
          __html: `$$ Z_i = \\begin{cases} S - I_i & \\text{if } I_i < s \\\\[0.35em] 0 & \\text{if } I_i \\ge s \\end{cases} $$`,
        }}
      />
      <p
        className="mb-2"
        dangerouslySetInnerHTML={{
          __html: `When \\(I_i < s\\), order enough to reach \\(S\\): \\(Z_i = S - I_i\\); otherwise \\(Z_i=0\\). If an order is placed, ordering cost is a setup <strong>\\(K\\)</strong> plus <strong>\\(c\\)</strong> per unit ordered; holding is <strong>\\(h\\)</strong> per unit left in stock at the end of the day; shortage penalty is <strong>\\(p\\)</strong> per unit of demand not met from stock on hand at the start of the day.`,
        }}
      />
      <p
        className="mb-2 text-center"
        dangerouslySetInnerHTML={{
          __html: `$$ \\text{ordering cost}_i = \\begin{cases} K + c\\,Z_i & \\text{if } I_i < s \\\\[0.35em] 0 & \\text{if } I_i \\ge s \\end{cases} $$`,
        }}
      />
      <p
        className="mb-2"
        dangerouslySetInnerHTML={{
          __html: `Start-of-day stock available to meet demand is previous end stock plus any delivery that morning, \\(I_{i-1}+Z_{i-1}\\) (with \\(I_0\\) and deliveries defined by your opening stock and lead logic). Revenue is price times units sold; profit subtracts ordering, holding on \\(I_i\\), and penalty on \\(\\max(0, D_i - (I_{i-1}+Z_{i-1}))\\):`,
        }}
      />
      <p
        className="mb-2 text-center"
        dangerouslySetInnerHTML={{
          __html: `$$ \\begin{aligned} \\text{profit}_i &= d\\,\\min\\!\\bigl(D_i,\\; I_{i-1}+Z_{i-1}\\bigr) - \\text{ordering cost}_i - h\\,I_i - p\\,\\max\\!\\bigl(0,\\; D_i - (I_{i-1}+Z_{i-1})\\bigr) \\end{aligned} $$`,
        }}
      />
      <p
        className="mb-2"
        dangerouslySetInnerHTML={{
          __html: `<strong>Implementation.</strong> Morning <strong>start-of-day</strong> stock \\(E_i\\) is on-hand before demand; \\(\\text{sales}_i = \\min(D_i, E_i)\\), \\(\\text{lost}_i = \\max(0, D_i - E_i)\\), \\(I_i = \\text{end}_i = \\max(0, E_i - D_i)\\). If \\(I_i < s\\), you order \\(Z_i = S - I_i\\) (integer-rounded); the delivery arrives on the morning of day \\(i + \\text{lead}_i\\) (lead \\(1\\) = next morning, matching the worked pencil-and-paper example). Costs use \\(K + c Z_i\\) when an order is placed, holding \\(h I_i\\), and penalty \\(p\\) times lost sales.`,
        }}
      />
      <p
        className="mb-0 text-muted app-description-footer"
        dangerouslySetInnerHTML={{
          __html: `<strong>Simulation</strong> sub-tab: set demand and supplier laws, \\(s,S\\), costs, horizon, and seed; <strong>Go</strong> fills the day table and KPIs. Lead-time law draws nights-until-delivery; demand law draws \\(D_i\\).`,
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
