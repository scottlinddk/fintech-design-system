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

it("derives colours from theme tokens and hardcodes none outside the glow violet and the support probe", () => {
  const hardcoded = css.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
  expect(hardcoded.sort()).toEqual(["#000", "#6941a5", "#a78bfa", "#fff"]);
});

it("drops decoration for forced colours and print", () => {
  expect(css).toContain("@media (forced-colors: active)");
  expect(css).toContain("@media print");
});
