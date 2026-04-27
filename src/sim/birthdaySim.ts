import { createRngStream } from "../lib/rngStream";

const ML = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const;

export const BIRTHDAYS: { m: number; d: number }[] = (() => {
  const a: { m: number; d: number }[] = [];
  for (let m = 0; m < 12; m++) {
    for (let d = 1; d <= ML[m]!; d++) a.push({ m: m + 1, d });
  }
  return a;
})();

export function drawBirthdayDoy(rng: ReturnType<typeof createRngStream>): number {
  return 1 + Math.floor(rng.u() * 365);
}

export function doyToMd(doy: number) {
  return BIRTHDAYS[Math.max(0, Math.min(364, doy - 1))]!;
}

export type BdStudent = { id: number; m: number; d: number; doy: number };

export function addStudent(
  rng: ReturnType<typeof createRngStream>,
  students: BdStudent[]
): { students: BdStudent[]; matched: boolean; match: { m: number; d: number } | null } {
  const doy = drawBirthdayDoy(rng);
  const { m, d } = doyToMd(doy);
  const id = students.length + 1;
  const prior = students.filter((s) => s.m === m && s.d === d);
  return {
    students: [...students, { id, m, d, doy }],
    matched: prior.length > 0,
    match: prior.length > 0 ? { m, d } : null,
  };
}
