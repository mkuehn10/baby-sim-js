import { useEffect, useRef } from "react";
import { typesetMath } from "../mathjaxTypeset";

type Props = {
  onGoToSimulation: () => void;
  active?: boolean;
};

/** Mirrors `gen3d_method_panel()` in `R/threed_gen.R`. */
export function Gen3dDescription({ onGoToSimulation, active = true }: Props) {
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
    <div ref={rootRef} className="tab-method-summary mc-pi-method-summary">
      <h3 className="method-h3">PRNs and the 3D lattice picture</h3>
      <p className="lesson-ref text-muted">
        <span className="lesson-ref-code">M3L8</span>
        {" — "}
        Simulating Random Variables
      </p>

      <p className="mb-3">
        Pseudo-random numbers (PRNs) are <strong>deterministic</strong> updates of an internal integer seed, scaled to{" "}
        <span dangerouslySetInnerHTML={{ __html: "\\([0,1]\\)" }} />, designed to <em>look</em> like i.i.d. uniforms for
        downstream methods (inverse CDF, Box–Muller, etc.). The quality of the stream matters: a generator can pass quick
        1D checks yet fail in higher dimensions when successive values are not truly independent enough.
      </p>

      <p className="mb-3">
        The lecture’s <strong>minimal standard</strong> multiplicative LCG is{" "}
        <span
          dangerouslySetInnerHTML={{
            __html: "\\(X_i = 16807\\,X_{i-1} \\pmod{2^{31}-1}\\)",
          }}
        />
        , then <span dangerouslySetInnerHTML={{ __html: "\\(R_i = X_i/(2^{31}-1)\\)" }} />
        . RANDU uses a different multiplier/modulus pair infamous for <strong>hyperplane</strong> structure: triples{" "}
        <span dangerouslySetInnerHTML={{ __html: "\\((u_i,u_{i+1},u_{i+2})\\)" }} /> lie near a small family of planes
        in <span dangerouslySetInnerHTML={{ __html: "\\(\\mathbb{R}^3\\)" }} />
        . This visualization is the geometric warning sign: if your triples cluster on sheets, any simulation that
        consumes uniforms three-at-a-time inherits that bias.
      </p>

      <p className="mb-2">
        <strong>Good:</strong> <span dangerouslySetInnerHTML={{ __html: "\\(a=16807\\)" }} />,{" "}
        <span dangerouslySetInnerHTML={{ __html: "\\(m=2^{31}-1\\)" }} />
        . <strong>RANDU:</strong> <span dangerouslySetInnerHTML={{ __html: "\\(a=65539\\)" }} />,{" "}
        <span dangerouslySetInnerHTML={{ __html: "\\(m=2^{31}\\)" }} />
        . Both streams are scaled here with the same denominator so the two clouds are comparable inside{" "}
        <span dangerouslySetInnerHTML={{ __html: "\\([0,1]^3\\)" }} />.
      </p>

      <p className="mb-0 text-muted app-description-footer small">
        <strong>Simulation</strong> sub-tab: pick generator, <span dangerouslySetInnerHTML={{ __html: "\\(n\\)" }} />,
        and seed; <strong>Go</strong>, then rotate the plotly view to compare RANDU sheet structure with the good LCG
        fill. For RANDU, try seeds like 512 or 2048 if the cloud looks too uniform.
      </p>

      <div className="mt-2">
        <button type="button" className="link-like" onClick={onGoToSimulation}>
          Go to simulation
        </button>
      </div>
    </div>
  );
}
