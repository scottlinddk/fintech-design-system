import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const run = (args, options = {}) => execFileSync("npm", args, { stdio: "inherit", ...options });
run(["run", "build"]);
mkdirSync("artifacts", { recursive: true });
const [{ filename }] = JSON.parse(
  run(["pack", "--json", "--pack-destination", "artifacts"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  }),
);
run(["ci", "--prefix", "smoke/next-app", "--no-audit", "--no-fund"]);
run([
  "install",
  "--prefix",
  "smoke/next-app",
  "--no-save",
  "--package-lock=false",
  resolve("artifacts", filename),
]);
run(["run", "build", "--prefix", "smoke/next-app"], {
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
});
