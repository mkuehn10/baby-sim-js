import { useEffect, useRef } from "react";
import { typesetMath } from "../mathjaxTypeset";

type Props = { onGoToSimulation: () => void; active?: boolean };

/** R `mc_int_method_panel()` in `R/monte-carlo-int.R` */
export function McIntDescription({ onGoToSimulation, active = true }: Props) {
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
      <h4 className="method-h4 h5 text-body mb-2">Monte Carlo Integration</h4>
      <p className="lesson-ref text-muted mb-2">
        <span className="lesson-ref-code">M3L2</span>
        {" — "}
        Monte Carlo Integration
      </p>
      <p
        className="mb-3"
        dangerouslySetInnerHTML={{
          __html: `Many integrals \\(\\int_a^b g(x)\\,dx\\) arise in probability as <strong>expectations</strong> (areas under curves you care about). If you can rewrite the integral as an expected value of a function of a uniform random variable, then a <strong>sample average</strong> is a legitimate estimator: simulate many draws, evaluate \\(g\\) at the transformed points, average. That is the same statistical spine as &ldquo;run the system many times and average the outputs&rdquo;&mdash;only here the &ldquo;system&rdquo; is a single formula.`,
        }}
      />
      <p className="mb-2 fw-semibold">Change variables to [0,1], then average</p>
      <p
        className="mb-2"
        dangerouslySetInnerHTML={{
          __html: `Substitute \\(u=(x-a)/(b-a)\\) so \\(x=a+(b-a)u\\) and \\(dx=(b-a)\\,du\\). The integral becomes \\((b-a)\\) times an expectation \\(\\mathbb{E}[g(a+(b-a)U)]\\) with \\(U\\sim\\mathrm{Unif}(0,1)\\). Monte Carlo approximates that expectation by \\(\\frac{1}{n}\\sum_i (b-a)\\,g(a+(b-a)U_i)\\).`,
        }}
      />
      <p
        className="mb-2 text-center"
        dangerouslySetInnerHTML={{
          __html: `$$ I = \\int_a^b g(x)\\,dx = (b-a)\\int_0^1 g\\bigl(a+(b-a)u\\bigr)\\,du $$`,
        }}
      />
      <p
        className="mb-3 text-center"
        dangerouslySetInnerHTML={{
          __html: `$$ \\hat I = \\frac{1}{n}\\sum_{i=1}^n f(U_i) \\quad\\text{estimates}\\quad \\int_0^1 f(u)\\,du $$`,
        }}
      />
      <p className="mb-2 fw-semibold">Why the average is right (informally)</p>
      <p
        className="mb-3"
        dangerouslySetInnerHTML={{
          __html: `Each term \\((b-a)\\,g(a+(b-a)U_i)\\) is a random draw whose <strong>mean</strong> equals the integral you want (law of the unconscious statistician / change-of-measure). Averages across i.i.d. draws are unbiased for that mean, and their variance scales like \\(1/n\\), so noise shrinks as you add samples&mdash;though sample paths can still look <strong>choppy</strong> at moderate \\(n\\). A large-sample confidence interval treats \\(\\bar I_n\\) as approximately normal (CLT) and uses the sample variance \\(S^2\\) of the summands.`,
        }}
      />
      <p className="fw-semibold mb-2">Integrands implemented here</p>
      <ul className="mb-3 ps-3">
        <li
          dangerouslySetInnerHTML={{
            __html: `\\(f(u)=\\sin(\\pi u)\\) on \\([0,1]\\): the lecture&rsquo;s transparent example; exact \\(\\int_0^1 f = 2/\\pi\\).`,
          }}
        />
        <li
          dangerouslySetInnerHTML={{
            __html: `\\(f(u)=\\ln(u)\\ln(1-u)\\): a second smooth integrand on \\((0,1)\\); exact \\(\\int_0^1 f = 2-\\pi^2/6\\).`,
          }}
        />
      </ul>
      <p
        className="mb-0 text-muted app-description-footer"
        dangerouslySetInnerHTML={{
          __html: `<strong>Simulation</strong> sub-tab: choose \\(f\\), \\(n\\), and the RNG seed; <strong>Go</strong> overlays samples on the curve and reports \\(\\hat I\\) vs the exact integral.`,
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
