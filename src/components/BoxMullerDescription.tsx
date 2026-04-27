import { useLayoutEffect, useRef } from "react";
import { typesetMath } from "../mathjaxTypeset";
import { BoxMuller } from "../rshiny/labels";

type Props = { onGoToSimulation: () => void; active?: boolean };

/** R `bm_method_panel()` in `R/box-muller.R` */
export function BoxMullerDescription({ onGoToSimulation, active = true }: Props) {
  const r = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!active || !r.current) return;
    void typesetMath(r.current);
  }, [active]);
  return (
    <div ref={r} className="tab-method-summary bm-method-summary">
      <h4 className="method-h4 h5 text-body mb-2">Box&ndash;Muller method</h4>
      <p className="lesson-ref text-muted mb-2">
        <span className="lesson-ref-code">M3L8</span>
        {" — "}
        Simulating Random Variables; see also M1L7 baby examples
      </p>
      <p
        className="mb-3"
        dangerouslySetInnerHTML={{
          __html: `Most of discrete-event simulation eventually needs <strong>Gaussian</strong> noise (service times, errors, shocks). One route is <strong>inverse CDF</strong>: transform uniforms with \\(F^{-1}\\). Box&ndash;Muller is a different, analytic shortcut: it consumes <strong>two independent uniforms</strong> and returns <strong>two independent standard normals</strong> without evaluating a normal quantile function.`,
        }}
      />
      <p
        className="mb-3"
        dangerouslySetInnerHTML={{
          __html: `The polar intuition: draw radius \\(R=\\sqrt{-2\\ln U_1}\\) and angle \\(\\theta=2\\pi U_2\\); \\((Z_1,Z_2)=(R\\cos\\theta, R\\sin\\theta)\\) is bivariate standard normal. If the uniforms feeding Box&ndash;Muller are not &ldquo;well mixed&rdquo; (bad PRN structure), the scatter can show streaks or lobes even though the <em>formula</em> is exact&mdash;garbage in, garbage out.`,
        }}
      />
      <p className="mb-2 fw-semibold">Transform (standard normals)</p>
      <p
        className="mb-2"
        dangerouslySetInnerHTML={{ __html: "Let \\(U_1,U_2\\) be independent \\(\\mathrm{Unif}(0,1)\\) from the generator you select. Then:" }}
      />
      <p
        className="mb-0 text-center"
        dangerouslySetInnerHTML={{
          __html: `$$ \\begin{aligned} Z_1 &= \\sqrt{-2\\ln U_1}\\,\\cos(2\\pi U_2) \\\\ Z_2 &= \\sqrt{-2\\ln U_1}\\,\\sin(2\\pi U_2) \\end{aligned} $$`,
        }}
      />
      <p
        className="mb-0 text-muted app-description-footer mt-3"
        dangerouslySetInnerHTML={{
          __html: `<strong>Simulation</strong> sub-tab: pick the uniform generator, \\(n\\), and seed; <strong>Go</strong> redraws the scatter. <strong>Good / RANDU:</strong> one uniform chain in order. <strong>Fibonacci:</strong> interleave two chains as \\((U_{1,i},U_{2,i})\\).`,
        }}
      />
      <p className="mb-0 mt-2 app-description-hint text-muted small" title={BoxMuller.helpRandu}>
        {BoxMuller.helpRandu}
      </p>
      <div className="mt-2">
        <button type="button" className="link-like" onClick={onGoToSimulation}>
          Go to simulation
        </button>
      </div>
    </div>
  );
}
