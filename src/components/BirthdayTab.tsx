import { useCallback, useEffect, useRef, useState } from "react";
import { createRngStream } from "../lib/rngStream";
import { addStudent, type BdStudent } from "../sim/birthdaySim";
import { BirthdayDescription } from "./BirthdayDescription";
import { Birthday } from "../rshiny/labels";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

type Sub = "description" | "simulation";

const SEED_MAX = 999_999;

export function BirthdayTab() {
  const [sub, setSub] = useState<Sub>("description");
  const [seed, setSeed] = useState(42);
  const [nMax, setNMax] = useState(40);
  const [students, setStudents] = useState<BdStudent[]>([]);
  const [matched, setMatched] = useState(false);
  const [matchM, setMatchM] = useState<number | null>(null);
  const [matchD, setMatchD] = useState<number | null>(null);
  const [stopReason, setStopReason] = useState<"" | "max">("");
  const [auto, setAuto] = useState(false);
  const rng = useRef(createRngStream(seed));

  const hardReset = useCallback(() => {
    rng.current = createRngStream(seed);
    setStudents([]);
    setMatched(false);
    setMatchM(null);
    setMatchD(null);
    setStopReason("");
    setAuto(false);
  }, [seed]);

  const step = useCallback(() => {
    setStudents((s) => {
      if (s.length >= nMax) {
        setStopReason("max");
        setAuto(false);
        return s;
      }
      const n = addStudent(rng.current, s);
      if (n.matched) {
        setMatched(true);
        setMatchM(n.match!.m);
        setMatchD(n.match!.d);
        setAuto(false);
        setStopReason("");
      }
      return n.students;
    });
  }, [nMax]);

  useEffect(() => {
    if (!auto || matched) return;
    if (students.length >= nMax && !matched) {
      setStopReason("max");
      setAuto(false);
      return;
    }
    const t = window.setTimeout(() => {
      if (!auto) return;
      step();
    }, 175);
    return () => clearTimeout(t);
  }, [auto, matched, students.length, nMax, step]);

  return (
    <section className="card">
      <h2 className="h2">Birthday Problem</h2>
      <nav className="nav-pills" aria-label="Birthday">
        <button type="button" className={sub === "description" ? "nav-pill active" : "nav-pill"} onClick={() => setSub("description")}>
          Description
        </button>
        <button
          type="button"
          className={sub === "simulation" ? "nav-pill active" : "nav-pill"}
          onClick={() => setSub("simulation")}
        >
          Simulation
        </button>
      </nav>
      {sub === "description" && (
        <div>
          <BirthdayDescription active={sub === "description"} onGoToSimulation={() => setSub("simulation")} />
        </div>
      )}
      {sub === "simulation" && (
        <div className="simulation-panel">
          <div className="controls app-controls-bar">
            <label className="field" title={Birthday.seed.title}>
              <span>{Birthday.seed.label}</span>
              <input
                type="number"
                min={1}
                max={SEED_MAX}
                value={seed}
                onChange={(e) => {
                  setSeed(Math.max(1, +e.target.value | 0));
                }}
                aria-label={Birthday.seed.label}
              />
            </label>
            <div className="field field-slider" title={Birthday.nmax.title}>
              <label htmlFor="bd-nmax">
                {Birthday.nmax.label} {nMax}
              </label>
              <input
                id="bd-nmax"
                type="range"
                min={5}
                max={80}
                step={1}
                value={nMax}
                onChange={(e) => setNMax(+e.target.value)}
                aria-label={Birthday.nmax.label}
              />
            </div>
            <div className="app-controls-go-wrap">
              <button
                type="button"
                className="btn-secondary"
                onClick={hardReset}
                style={{ padding: "0.4rem 0.9rem", fontWeight: 600 }}
                title={Birthday.reset}
              >
                Reset class
              </button>
            </div>
            <div className="app-controls-go-wrap">
              <button
                type="button"
                className="btn-go"
                onClick={() => {
                  hardReset();
                  setStopReason("");
                  setAuto(true);
                }}
                title={Birthday.auto}
              >
                Auto-run
              </button>
            </div>
            <div className="app-controls-go-wrap">
              <button
                type="button"
                className="btn-go"
                onClick={() => {
                  setAuto(false);
                  step();
                }}
                title={Birthday.add1}
              >
                +1 student
              </button>
            </div>
          </div>
          <p title={Birthday.status1} className="mb-0">
            <strong>Students added:</strong> {students.length}
          </p>
          <p className="mb-2" title={Birthday.status2}>
            {matched && matchM != null && matchD != null
              ? `Match: yes — on ${MONTHS[matchM - 1]} ${matchD}.`
              : stopReason === "max" && !matched
                ? "Stopped at the maximum class size with no match yet."
                : "Match: not yet."}
          </p>
          <div className="bd-grid-wrap" title={Birthday.grid}>
            <table className="birthday-calendar">
              <thead>
                <tr>
                  <th className="bd-corner" />
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <th key={day} scope="col" className="bd-day-header">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MONTHS.map((monthName, mi) => {
                  const m = mi + 1;
                  return (
                    <tr key={monthName}>
                      <th scope="row" className="bd-month">
                        {monthName}
                      </th>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                        const valid =
                          m === 1 || m === 3 || m === 5 || m === 7 || m === 8 || m === 10 || m === 12
                            ? day <= 31
                            : m === 2
                              ? day <= 28
                              : day <= 30;
                        if (!valid) {
                          return (
                            <td key={day} className="birthday-cell birthday-cell--invalid">
                              —
                            </td>
                          );
                        }
                        const ids = students.filter((s) => s.m === m && s.d === day).map((s) => s.id);
                        const isMatch = matched && matchM === m && matchD === day;
                        const cls = [
                          "birthday-cell",
                          ids.length ? "birthday-cell--filled" : "birthday-cell--empty",
                          isMatch ? "birthday-cell--match" : "",
                        ]
                          .filter(Boolean)
                          .join(" ");
                        return (
                          <td key={day} className={cls}>
                            {ids.length ? ids.join(", ") : ""}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
