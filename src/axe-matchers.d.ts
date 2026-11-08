import "vitest";

// vitest-axe 0.1 augments the legacy global Vi namespace. Vite+ uses Vitest 5's
// module matcher interface; keep the real matcher typed without changing runtime behaviour.
declare module "vitest" {
  interface Matchers<R, T = unknown> {
    toHaveNoViolations(): R;
  }
}
