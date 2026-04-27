import { useEffect, useRef } from "react";
import { typesetMath } from "../mathjaxTypeset";

type Props = {
  onGoToSimulation: () => void;
  /** When false, skip typesetting (user on another sub-tab). */
  active?: boolean;
};

/**
 * Mirrors `mc_pi_method_panel()` in `R/monte-carlo-sim-pi.R` (MathJax + copy).
 */
export function McPiDescription({ onGoToSimulation, active = true }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return undefined;
    const el = rootRef.current;
    if (!el) return undefined;

    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      void typesetMath(el);
    };

    run();
    const t = window.setTimeout(run, 150);
    const t2 = window.setTimeout(run, 600);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, [active]);

  return (
    <div ref={rootRef} className="mc-pi-method-summary">
      <h3 className="method-h3">Making some π (Monte Carlo)</h3>
      <p className="lesson-ref text-muted">
        <span className="lesson-ref-code">M3L4</span>
        {" — "}
        Making Some Pi: hand and tabular simulations
      </p>

      <p className="mb-3">
        You want a number involving π without evaluating a complicated integral. Monte Carlo replaces pencil-and-paper
        geometry with <strong>repeated random experiments</strong> whose long-run frequency matches an area ratio. Each
        dart is an independent <strong>Bernoulli trial</strong> (hit or miss the circle); the sample fraction inside
        estimates the hit probability.
      </p>

      <p className="mb-3">
        Work with a <strong>unit square</strong>{" "}
        <span dangerouslySetInnerHTML={{ __html: "\\([0,1]^2\\)" }} /> (area 1) and inscribe a circle of radius{" "}
        <span dangerouslySetInnerHTML={{ __html: "\\(\\tfrac{1}{2}\\)" }} /> (area{" "}
        <span dangerouslySetInnerHTML={{ __html: "\\(\\pi/4\\)" }} />
        ). If darts are uniform over the square,{" "}
        <span
          dangerouslySetInnerHTML={{
            __html: "\\(\\mathbb{P}(\\text{inside}) = (\\pi/4)/1 = \\pi/4\\)",
          }}
        />
        . Simulate one dart by drawing{" "}
        <span
          dangerouslySetInnerHTML={{
            __html:
              "\\(U_1,U_2\\stackrel{\\text{i.i.d.}}{\\sim}\\mathrm{Unif}(0,1)\\)",
          }}
        />{" "}
        and plotting <span dangerouslySetInnerHTML={{ __html: "\\((U_1,U_2)\\)" }} />. After{" "}
        <span dangerouslySetInnerHTML={{ __html: "\\(n\\)" }} /> throws,{" "}
        <span dangerouslySetInnerHTML={{ __html: "\\(\\hat{p} = (\\#\\text{ inside})/n\\)" }} /> estimates{" "}
        <span dangerouslySetInnerHTML={{ __html: "\\(\\pi/4\\)" }} />, so{" "}
        <span dangerouslySetInnerHTML={{ __html: "\\(\\hat{\\pi}_n = 4\\hat{p}\\)" }} /> estimates{" "}
        <span dangerouslySetInnerHTML={{ __html: "\\(\\pi\\)" }} />. The law of large numbers says{" "}
        <span dangerouslySetInnerHTML={{ __html: "\\(\\hat{p}\\to \\pi/4\\)" }} /> as{" "}
        <span dangerouslySetInnerHTML={{ __html: "\\(n\\to\\infty\\)" }} />
        ; the standard error shrinks like <span dangerouslySetInnerHTML={{ __html: "\\(1/\\sqrt{n}\\)" }} /> (same{" "}
        <span dangerouslySetInnerHTML={{ __html: "\\(\\sqrt{n}\\)" }} /> scaling as any mean of i.i.d. bounded trials).
      </p>

      <p className="fw-semibold mb-2">Inside test (identical geometry to the plot)</p>
      <p
        className="mb-2 text-center"
        dangerouslySetInnerHTML={{
          __html:
            "$$ \\left(x-\\tfrac{1}{2}\\right)^2 + \\left(y-\\tfrac{1}{2}\\right)^2 \\le \\left(\\tfrac{1}{2}\\right)^2 $$",
        }}
      />
      <p
        className="mb-3 text-center"
        dangerouslySetInnerHTML={{
          __html:
            "$$ \\hat{p} = \\frac{\\text{# in circle}}{n} \\approx \\frac{\\pi}{4} \\qquad\\Rightarrow\\qquad \\pi \\approx 4\\,\\hat{p} $$",
        }}
      />

      <p className="mb-0 text-muted app-description-footer">
        <strong>Simulation</strong> sub-tab: set <span dangerouslySetInnerHTML={{ __html: "\\(n\\)" }} /> and the RNG
        seed; <strong>Go</strong> throws darts, counts inside the circle, and reports{" "}
        <span dangerouslySetInnerHTML={{ __html: "\\(\\hat{\\pi}_n\\)" }} />.
      </p>

      <div className="mt-2">
        <button type="button" className="link-like" onClick={onGoToSimulation}>
          Go to simulation
        </button>
      </div>
    </div>
  );
}
