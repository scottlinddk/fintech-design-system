import { readFileSync } from "node:fs";
import { expect, it } from "vitest";

const css = readFileSync("styles/themes/classic.css", "utf8");
const base = readFileSync("styles/tokens.css", "utf8");
const declarations = (text: string) =>
  Object.fromEntries(
    [...text.matchAll(/(--fds-[\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]),
  );
const blocks = css.split(':root:where([data-fds-mode="dark"])');
const luminance = (hex: string) => {
  const full =
    hex.length === 4
      ? hex
          .slice(1)
          .split("")
          .map((c) => c + c)
          .join("")
      : hex.slice(1);
  const rgb = [0, 2, 4].map((start) => {
    const value = parseInt(full.slice(start, start + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

for (const mode of ["light", "dark"]) {
  it(`Classic ${mode} maintains readable text, semantic colors and data marks`, () => {
    const light = declarations(blocks[0]);
    const tokens = {
      ...declarations(base),
      ...light,
      ...(mode === "dark" ? declarations(blocks[1]) : {}),
    };
    const value = (token: string): string => {
      const raw = tokens[`--fds-${token}`];
      const reference = raw.match(/^var\(--fds-([\w-]+)\)$/);
      return reference ? value(reference[1]) : raw;
    };
    for (const surface of ["background", "panel", "panel-raised", "panel-soft"]) {
      for (const text of ["foreground", "muted", "muted-strong", "success", "warn", "danger"])
        expect(
          contrast(value(text), value(surface)),
          `${mode}: ${text} on ${surface}`,
        ).toBeGreaterThanOrEqual(4.5);
      for (const mark of [
        "focus-ring",
        "chart-grid",
        ...Array.from({ length: 6 }, (_, i) => `chart-${i + 1}`),
      ])
        expect(
          contrast(value(mark), value(surface)),
          `${mode}: ${mark} on ${surface}`,
        ).toBeGreaterThanOrEqual(3);
    }
    for (const tone of ["accent", "success", "danger"])
      expect(
        contrast(value(`on-${tone}`), value(tone)),
        `${mode}: solid ${tone}`,
      ).toBeGreaterThanOrEqual(4.5);
    for (const surface of ["brand-brick", "brand-night"])
      for (const text of ["brand-foreground", "brand-muted"])
        expect(
          contrast(value(text), value(surface)),
          `${text} on ${surface}`,
        ).toBeGreaterThanOrEqual(4.5);
    for (const surface of ["brand-amber", "brand-ember-hover", "brand-cream"])
      expect(
        contrast(value("brand-ink"), value(surface)),
        `brand-ink on ${surface}`,
      ).toBeGreaterThanOrEqual(4.5);
  });
}

it("is an explicit opt-in export that overrides Studio's classicrative panel fields", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  expect(pkg.exports["./themes/classic.css"]).toBe("./styles/themes/classic.css");
  expect(readFileSync("styles/index.css", "utf8")).not.toContain("classic.css");
  expect(declarations(blocks[0])["--fds-panel-grain-content"]).toBe("none");
});
