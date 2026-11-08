import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import legacy from "./legacy-token-values.json";

const read = (path: string) => readFileSync(path, "utf8");
// Read the first (normal motion, touch) declaration; media overrides are checked in the browser.
const tokens = (path: string): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const [, name, value] of read(path).matchAll(/(--fds-[\w-]+):\s*([^;]+);/g))
    result[name] ??= value.trim();
  return result;
};
const base = tokens("styles/tokens.css");
const resolve = (map: Record<string, string>, name: string): string => {
  const value = map[`--fds-${name}`];
  return value.startsWith("var(") ? resolve(map, value.slice(10, -1)) : value;
};
const luminance = (hex: string) => {
  const h = hex.slice(1);
  const full = h.length === 3 ? [...h].map((v) => v + v).join("") : h;
  const [r, g, b] = [0, 2, 4].map((i) => {
    const s = parseInt(full.slice(i, i + 2), 16) / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [lo, hi] = [luminance(a), luminance(b)].sort((x, y) => x - y);
  return (hi + 0.05) / (lo + 0.05);
};
const added = Object.keys(base).filter((key) => !(key in legacy["styles/tokens.css"]));

describe("foundation tokens", () => {
  it("preserves every existing token value", () => {
    for (const [path, values] of Object.entries(legacy)) expect(tokens(path)).toMatchObject(values);
  });
  for (const theme of ["funder", "investor", "portare"]) {
    const path = `styles/themes/${theme}.css`;
    const local = tokens(path);
    const map = { ...base, ...local };
    it(`${theme} defines every foundation token`, () => {
      expect(added).toHaveLength(45);
      for (const name of added) expect(local[name], name).toBeTruthy();
      for (let i = 1; i <= 8; i++) expect(local[`--fds-space-${i}`]).toBe(`${i * 4}px`);
    });
    it(`${theme} supports AA text on solid danger and success`, () => {
      for (const tone of ["danger", "success"])
        expect(contrast(resolve(map, `on-${tone}`), resolve(map, tone))).toBeGreaterThanOrEqual(
          4.5,
        );
    });
    if (theme === "portare") {
      it("Portare light text, focus and chart marks have sufficient contrast", () => {
        for (const surface of ["background", "panel", "panel-raised", "panel-soft"]) {
          for (const text of [
            "foreground",
            "muted",
            "muted-strong",
            "accent",
            "success",
            "warn",
            "danger",
          ])
            expect(
              contrast(resolve(map, text), resolve(map, surface)),
              `${text} on ${surface}`,
            ).toBeGreaterThanOrEqual(4.5);
          for (const mark of [
            "focus-ring",
            "chart-grid",
            ...Array.from({ length: 6 }, (_, i) => `chart-${i + 1}`),
          ])
            expect(
              contrast(resolve(map, mark), resolve(map, surface)),
              `${mark} on ${surface}`,
            ).toBeGreaterThanOrEqual(3);
        }
      });
    }
  }
});
