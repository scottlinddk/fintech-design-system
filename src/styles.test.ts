import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { expect, it } from "vitest";
import baseline from "./css-split-baseline.json";

const expand = (file: string): string =>
  readFileSync(file, "utf8")
    .replace(/^@layer fds;\s*/, "")
    .replace(/^@layer fds \{\n([\s\S]*)\}\s*$/, "$1")
    .replace(/@import "(.+?)";/g, (_, child: string) => expand(resolve(dirname(file), child)));
it("keeps the pre-split CSS declaration order and values", () => {
  const css = expand("styles/index.css").replace(/\s+/g, "");
  expect(createHash("sha256").update(css).digest("hex")).toBe(baseline.sha256);
});

it("puts every shipped token, theme and component rule inside the fds layer", async () => {
  const { readdirSync } = await import("node:fs");
  const paths = [
    "styles/tokens.css",
    ...readdirSync("styles/themes").map((file) => `styles/themes/${file}`),
    ...readdirSync("styles/components").map((file) => `styles/components/${file}`),
  ];
  for (const path of paths) {
    const css = readFileSync(path, "utf8").trim();
    expect(css.startsWith("@layer fds {"), path).toBe(true);
    expect(css.endsWith("}"), path).toBe(true);
  }
});
