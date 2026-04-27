export {};

declare global {
  interface Window {
    MathJax?: {
      typesetPromise?: (nodes?: (HTMLElement | null)[]) => Promise<void>;
      startup?: { defaultPageReady?: () => Promise<void> };
    };
  }
}
