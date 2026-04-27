import { useEffect, useRef } from "react";
import { typesetMath } from "../mathjaxTypeset";

type Props = { onGoToSimulation: () => void; active?: boolean };

/** R `portfolio_method_panel()` in `R/portfolio_spreadsheet.R` */
export function PortfolioDescription({ onGoToSimulation, active = true }: Props) {
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
      <h4 className="method-h4 h5 text-body mb-2">Fake stock portfolio (six sectors)</h4>
      <p className="lesson-ref text-muted mb-2">
        <span className="lesson-ref-code">M3L10</span>
        {" — "}
        Spreadsheet Simulation
      </p>
      <p className="mb-3">
        Six stocks, <strong>$5,000</strong> each in <strong>year 0</strong>; later columns are wealth after each simulated year. The slide&rsquo;s
        first random factor is stock-{" "}
        <span dangerouslySetInnerHTML={{ __html: "\\(i\\)" }} /> fluctuation written{" "}
        <span dangerouslySetInnerHTML={{ __html: "\\(\\operatorname{Nor}(\\mu_i,\\sigma_i^2)\\)" }} /> using that row&rsquo;s <strong>mean</strong>{" "}
        <span dangerouslySetInnerHTML={{ __html: "\\(\\mu_i\\)" }} /> and <strong>sd</strong>{" "}
        <span dangerouslySetInnerHTML={{ __html: "\\(\\sigma_i\\)" }} />
        ; the second factor is shared market noise{" "}
        <span dangerouslySetInnerHTML={{ __html: "\\(\\operatorname{Nor}(1,(0.2)^2)\\)" }} /> in year{" "}
        <span dangerouslySetInnerHTML={{ __html: "\\(t\\)" }} /> (defaults{" "}
        <span dangerouslySetInnerHTML={{ __html: "\\((1,(0.2)^2)\\)" }} />
        ).
      </p>
      <p className="mb-2 fw-semibold">Notation (M3L10)</p>
      <p
        className="mb-2 text-center"
        dangerouslySetInnerHTML={{
          __html: `$$ \\text{Previous Value} \\cdot \\max\\!\\left[0,\\; \\operatorname{Nor}(\\mu_i, \\sigma_i^2) \\cdot \\operatorname{Nor}\\!\\bigl(1,\\,(0.2)^2\\bigr) \\right] $$`,
        }}
      />
      <p className="mb-2 fw-semibold">Plain language: what this is doing, and why</p>
      <p
        className="mb-2"
        dangerouslySetInnerHTML={{
          __html: `Each simulated year, every stock row gets the <strong>same</strong> economy-wide shock \\(M_t\\) (one draw for the whole market that year). That is how the model forces <strong>correlation</strong>: good years and bad years are shared. Each row then gets its <strong>own</strong> sector draw \\(X_{i,t}\\) so names do not move in lockstep. Your typed <strong>mean</strong> and <strong>sd</strong> set how aggressive or volatile that row is (through \\(1+\\mu_i\\) and \\(\\sigma_i\\)). The slide&rsquo;s \\(\\max\\) wraps the <strong>product</strong> \\(X_{i,t} M_t\\): if the <strong>combined</strong> shock for that year would be negative, wealth for that step does not shrink via a negative multiplier (it floors at zero growth for the year). This is a classroom spreadsheet story, not a full pricing model.`,
        }}
      />
      <p
        className="mb-2"
        dangerouslySetInnerHTML={{
          __html: `<span class="fw-semibold">Same structure as the slide: </span>\\(W_{i,t} = W_{i,t-1} \\cdot \\max(0, X_{i,t} M_t)\\)`,
        }}
      />
      <p
        className="mb-2"
        dangerouslySetInnerHTML={{
          __html: `<strong>Previous Value</strong> in the slide is \\(W_{i,t-1}\\). The slide&rsquo;s \\(\\operatorname{Nor}(1,(0.2)^2)\\) factor is the <strong>shared market year</strong> we call \\(M_t\\) (defaults \\(\\mu_{\\mathrm{gen}}=1\\), \\(\\sigma_{\\mathrm{gen}}=0.2\\)). The slide&rsquo;s stock-side \\(\\operatorname{Nor}(\\mu_i,\\sigma_i^2)\\) is the randomness we implement as \\(X_{i,t} \\sim \\operatorname{Nor}(1+\\mu_i,\\sigma_i^2)\\) from your table. Each update is <strong>old wealth</strong> times \\(\\max(0, X_{i,t} M_t)\\), i.e. the same <strong>previous</strong>, <strong>raw sector draw</strong>, and <strong>raw market draw</strong> as on the slide, with one \\(\\max\\) on their product.`,
        }}
      />
      <p className="mb-2 fw-semibold">How this tab implements the update</p>
      <p
        className="mb-2 text-center"
        dangerouslySetInnerHTML={{
          __html: `$$ W_{i,t} = W_{i,t-1} \\cdot \\max\\!\\bigl(0,\\; X_{i,t} \\, M_t\\bigr), \\qquad X_{i,t} \\sim \\operatorname{Nor}\\!\\bigl(1+\\mu_i,\\,\\sigma_i^2\\bigr), \\quad M_t \\sim \\operatorname{Nor}\\!\\bigl(\\mu_{\\mathrm{gen}},\\,\\sigma_{\\mathrm{gen}}^2\\bigr) $$`,
        }}
      />
      <p className="mb-2 fw-semibold">What is not random</p>
      <p
        className="mb-2"
        dangerouslySetInnerHTML={{
          __html: `For each sector \\(i\\), the <strong>mean</strong> and <strong>sd</strong> cells are numbers you type (defaults match the lesson table, e.g. energy \\(\\mu_i=0.05\\), \\(\\sigma_i=0.30\\)). They are not produced by the RNG; only <strong>Go</strong> redraws \\(X_{i,t}\\) and \\(M_t\\) while \\(\\mu_i,\\sigma_i\\) stay fixed until you edit them.`,
        }}
      />
      <p className="mb-2 fw-semibold">What is random (each year after Go)</p>
      <p
        className="mb-2"
        dangerouslySetInnerHTML={{
          __html: `One <strong>market</strong> draw \\(M_t\\) for all rows and one <strong>stock</strong> draw \\(X_{i,t}\\) per row, each from \\(\\mathrm{Unif}(0,1)\\) via inverse transform (same idea as RAND + NORM.INV). Here \\(\\operatorname{Nor}(m,v)\\) means one draw with mean \\(m\\) and variance \\(v\\) (SD \\(\\sqrt{v}\\)).`,
        }}
      />
      <p
        className="mb-2"
        dangerouslySetInnerHTML={{
          __html: `Economy defaults \\((\\mu_{\\mathrm{gen}},\\sigma_{\\mathrm{gen}})=(1,0.2)\\) match the slide&rsquo;s \\(\\operatorname{Nor}(1,(0.2)^2)\\) market draw; change them on the <strong>Simulation</strong> sub-tab if needed.`,
        }}
      />
      <p className="mb-0 text-muted app-description-footer">
        Implementation: <code>qnorm(runif(), mean = &hellip;, sd = &hellip;)</code> per draw. <strong>Simulation</strong>: horizon, seed, sector mean{" "}
        <span dangerouslySetInnerHTML={{ __html: "\\(\\mu_i\\)" }} />, sd{" "}
        <span dangerouslySetInnerHTML={{ __html: "\\(\\sigma_i\\)" }} />, economy{" "}
        <span dangerouslySetInnerHTML={{ __html: "\\((\\mu_{\\mathrm{gen}},\\sigma_{\\mathrm{gen}})\\)" }} />
        ; <strong>Go</strong> rebuilds the table and chart.
      </p>
      <div className="mt-2">
        <button type="button" className="link-like" onClick={onGoToSimulation}>
          Go to simulation
        </button>
      </div>
    </div>
  );
}
