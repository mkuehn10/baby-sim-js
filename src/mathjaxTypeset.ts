/** Typeset MathJax 3 in `root` (and children). Safe if MathJax not loaded yet. */
export function typesetMath(root: HTMLElement | null): Promise<void> {
  if (!root) return Promise.resolve();
  const mj = window.MathJax;
  if (mj?.typesetPromise) {
    return mj.typesetPromise([root]);
  }
  return Promise.resolve();
}
