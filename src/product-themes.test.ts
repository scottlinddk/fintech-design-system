import { readFileSync } from "node:fs";
import { expect, it } from "vitest";

/** Contrast checks for the BoligData, Tredjekort and Orbit themes, mirroring caffeine-theme.test.ts. */
const base = readFileSync("styles/tokens.css", "utf8");
const declarations = (text: string) =>
  Object.fromEntries(
    [...text.matchAll(/(--fds-[\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]),
  );
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

/** Blends a hex colour over another at `alpha`, as the Badge's color-mix(... 12%, transparent) does. */
const blend = (fg: string, bg: string, alpha: number) => {
  const expand = (hex: string) =>
    hex.length === 4
      ? `#${hex
          .slice(1)
          .split("")
          .map((c) => c + c)
          .join("")}`
      : hex;
  const [a, b] = [expand(fg), expand(bg)];
  const channel = (start: number) =>
    Math.round(
      parseInt(a.slice(start, start + 2), 16) * alpha +
        parseInt(b.slice(start, start + 2), 16) * (1 - alpha),
    )
      .toString(16)
      .padStart(2, "0");
  return `#${channel(1)}${channel(3)}${channel(5)}`;
};

interface ThemeSpec {
  name: string;
  /** Decorative fields that carry text, per mode, with the paired text tokens. */
  fields: Record<"light" | "dark", string[]>;
  /** Fields that carry --fds-brand-ink text. */
  inkFields: Record<"light" | "dark", string[]>;
  /** Decorative marks that need 3:1 on the page surfaces. */
  marks: string[];
}

const specs: ThemeSpec[] = [
  {
    name: "boligdata",
    fields: {
      light: ["brand-copper", "brand-copper-dark", "brand-footer"],
      dark: ["brand-copper", "brand-copper-dark", "brand-footer"],
    },
    inkFields: { light: ["brand-peach", "brand-cream"], dark: ["brand-peach", "brand-cream"] },
    marks: [],
  },
  {
    name: "tredjekort",
    fields: {
      light: ["brand-survey", "brand-fjord", "brand-noise"],
      dark: ["brand-survey", "brand-fjord", "brand-noise"],
    },
    inkFields: { light: [], dark: [] },
    marks: ["brand-amber"],
  },
  {
    name: "orbit",
    fields: {
      light: ["brand-ember-deep", "brand-ember"],
      dark: ["brand-ember-deep", "brand-ember"],
    },
    inkFields: { light: ["brand-ember-bright"], dark: ["brand-ember-bright"] },
    marks: [],
  },
];

for (const spec of specs) {
  const css = readFileSync(`styles/themes/${spec.name}.css`, "utf8");
  const blocks = css.split(':root:where([data-fds-mode="dark"])');

  for (const mode of ["light", "dark"] as const) {
    it(`${spec.name} ${mode} maintains readable text, semantic colors and data marks`, () => {
      const tokens = {
        ...declarations(base),
        ...declarations(blocks[0]),
        ...(mode === "dark" ? declarations(blocks[1]) : {}),
      };
      const value = (token: string): string => {
        const raw = tokens[`--fds-${token}`];
        expect(raw, `--fds-${token} is defined`).toBeDefined();
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
          ...spec.marks,
        ])
          expect(
            contrast(value(mark), value(surface)),
            `${mode}: ${mark} on ${surface}`,
          ).toBeGreaterThanOrEqual(3);
      }
      // Badge text sits on a 12% tint of its own colour over the surface.
      for (const surface of ["background", "panel", "panel-raised", "panel-soft"])
        for (const tone of ["accent", "success", "warn", "danger"])
          expect(
            contrast(value(tone), blend(value(tone), value(surface), 0.12)),
            `${mode}: ${tone} badge on ${surface}`,
          ).toBeGreaterThanOrEqual(4.5);
      for (const tone of ["accent", "success", "danger"])
        expect(
          contrast(value(`on-${tone}`), value(tone)),
          `${mode}: solid ${tone}`,
        ).toBeGreaterThanOrEqual(4.5);
      for (const surface of spec.fields[mode])
        for (const text of ["brand-foreground", "brand-muted"])
          expect(
            contrast(value(text), value(surface)),
            `${mode}: ${text} on ${surface}`,
          ).toBeGreaterThanOrEqual(4.5);
      for (const surface of spec.inkFields[mode])
        expect(
          contrast(value("brand-ink"), value(surface)),
          `${mode}: brand-ink on ${surface}`,
        ).toBeGreaterThanOrEqual(4.5);
    });
  }

  it(`${spec.name} is an explicit opt-in export that overrides Studio's decorative panel fields`, () => {
    const pkg = JSON.parse(readFileSync("package.json", "utf8"));
    expect(pkg.exports[`./themes/${spec.name}.css`]).toBe(`./styles/themes/${spec.name}.css`);
    expect(readFileSync("styles/index.css", "utf8")).not.toContain(`${spec.name}.css`);
    expect(declarations(blocks[0])["--fds-panel-grain-content"]).toBe("none");
    expect(declarations(blocks[0])["--fds-panel-background-image"]).toBe("none");
  });
}
