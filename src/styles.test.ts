import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { expect, it } from "vitest";
import baseline from "./css-split-baseline.json";

const expand = (file: string): string =>
  readFileSync(file, "utf8").replace(/@import "(.+?)";/g, (_, child: string) =>
    expand(resolve(dirname(file), child)),
  );
it("keeps the pre-split CSS declaration order and values", () => {
  const css = expand("styles/index.css").replace(/\s+/g, "");
  expect(createHash("sha256").update(css).digest("hex")).toBe(baseline.sha256);
});
