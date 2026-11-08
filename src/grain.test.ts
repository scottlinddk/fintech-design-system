import { readFileSync } from "node:fs";
import { expect, it } from "vitest";

const css = readFileSync("styles/grain.css", "utf8").trim();
const pkg = JSON.parse(readFileSync("package.json", "utf8"));

it("ships grain.css as an opt-in export, separate from styles.css", () => {
  expect(pkg.exports["./grain.css"]).toBe("./styles/grain.css");
  expect(readFileSync("styles/index.css", "utf8")).not.toContain("grain");
});

it("keeps every grain rule inside the fds layer", () => {
  expect(css.startsWith("@layer fds {")).toBe(true);
  expect(css.endsWith("}")).toBe(true);
});

it("keeps hardcoded colours to --fds-* token declarations and the support probe", () => {
  const stray = css
    .split("\n")
    .filter((line) => /#[0-9a-fA-F]{3,8}\b/.test(line))
    .filter((line) => !/^\s*--fds-[\w-]+:/.test(line) && !line.includes("@supports"));
  expect(stray).toEqual([]);
});

it("drops decoration for forced colours and print", () => {
  expect(css).toContain("@media (forced-colors: active)");
  expect(css).toContain("@media print");
});

it("uses light-dark() for colours only (numbers and keywords are invalid in it)", () => {
  const code = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const args = [...code.matchAll(/:\s*light-dark\(\s*([^;]*?)\)\s*;/gs)].map((m) => m[1].trim());
  expect(args.length).toBeGreaterThan(0);
  for (const arg of args) expect(arg, arg).toMatch(/^(#|color-mix|rgb)/);
});
