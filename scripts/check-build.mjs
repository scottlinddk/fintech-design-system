import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";

const client = new Set(["Button", "Field", "Menu", "Panel"]);
for (const name of ["Badge", "Button", "Field", "Menu", "Meter", "Metric", "Notice", "Panel"]) {
  const code = readFileSync(`dist/components/${name}.mjs`, "utf8");
  assert.equal(code.startsWith('"use client";'), client.has(name), `${name} client boundary`);
  assert(existsSync(`dist/components/${name}.d.mts`), `${name} declarations`);
}
const index = readFileSync("dist/index.mjs", "utf8");
assert(!index.includes('"use client"'), "the barrel must remain usable from the server");
assert(!index.includes("useState"), "the barrel must re-export separate modules");
assert(
  !JSON.stringify(readdirSync("dist", { recursive: true })).includes("test."),
  "tests must not ship",
);
const { exports: exportsMap } = JSON.parse(readFileSync("package.json", "utf8"));
for (const target of Object.values(exportsMap))
  for (const file of typeof target === "string" ? [target] : Object.values(target))
    assert(existsSync(file), `export ${file} exists`);
console.log("Built module boundaries, declarations, exports and exclusions passed.");
