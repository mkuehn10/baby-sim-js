import { useLayoutEffect, useRef } from "react";
import { typesetMath } from "../mathjaxTypeset";
import { Birthday } from "../rshiny/labels";

type Props = { onGoToSimulation: () => void; active?: boolean };

/** R `bd_method_panel()` in `R/birthday-paradox.R` */
export function BirthdayDescription({ onGoToSimulation, active = true }: Props) {
  const r = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!active || !r.current) return;
    void typesetMath(r.current);
  }, [active]);
  return (
    <div ref={r} className="tab-method-summary">
      <h4 className="method-h4 h5 text-body mb-2">Birthday Problem</h4>
      <p className="lesson-ref text-muted mb-2">
        <span className="lesson-ref-code">M1L6</span>
        {" — "}
        Some Baby Examples
      </p>
      <p
        className="mb-3"
        dangerouslySetInnerHTML={{
          __html: `Ask: &ldquo;How large must a class be before it is <strong>more likely than not</strong> that two people share a birthday?&rdquo; Ignoring leap days, each person is an independent draw from 365 equally likely calendar slots. The surprise is how few people you need&mdash;about <strong>23</strong> for a 50% chance&mdash;because you are not comparing one person to the room; you are implicitly checking many <strong>pairs</strong> (\\(\\binom{k}{2}\\) comparisons after \\(k\\) arrivals).`,
        }}
      />
      <p
        className="mb-3"
        dangerouslySetInnerHTML={{
          __html: `This tab is a <strong>simulation sandbox</strong>: you can watch collisions appear (or not) under repeatable seeds. Each new student draws a random \\((\\text{month},\\text{day})\\) uniformly from the 365-day calendar (no Feb 29). Students are numbered in arrival order; the calendar grid shows which day each occupies.`,
        }}
      />
      <p
        className="mb-0 text-muted app-description-footer"
        dangerouslySetInnerHTML={{
          __html: `<strong>Simulation</strong> sub-tab: <strong>Auto-run</strong> adds students until two share a birthday or the class hits the cap. <strong>+1 student</strong> adds one draw; <strong>Reset class</strong> clears the roster. A <strong>match</strong> is the first time a new student&rsquo;s date duplicates an existing one.`,
        }}
      />
      <p className="mb-0 mt-2 app-description-hint text-muted small" title={Birthday.helpDesc}>
        {Birthday.helpDesc}
      </p>
      <div className="mt-2">
        <button type="button" className="link-like" onClick={onGoToSimulation}>
          Go to simulation
        </button>
      </div>
    </div>
  );
}
