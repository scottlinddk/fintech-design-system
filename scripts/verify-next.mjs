import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { setTimeout } from "node:timers/promises";
import { chromium, expect } from "@playwright/test";

const manifest = readFileSync(
  "smoke/next-app/.next/server/app/page_client-reference-manifest.js",
  "utf8",
);
assert(!manifest.includes("components/Badge.mjs"), "Badge must not be a client reference");
for (const name of ["Button", "Field", "Menu", "Panel"])
  assert(manifest.includes(`components/${name}.mjs`), `${name} is a client boundary`);
const server = spawn("npm", ["run", "start", "--prefix", "smoke/next-app"], {
  stdio: "inherit",
  detached: true,
});
let browser;
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      ready = (await fetch("http://127.0.0.1:4174")).ok;
    } catch {
      /* Wait for Next to bind. */
    }
    if (ready) break;
    await setTimeout(250);
  }
  assert(ready, "Next production server starts");
  browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("http://127.0.0.1:4174");
  await expect(page.getByText("Server-rendered badge", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Server-imported button" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Server-imported panel" })).toBeVisible();
  await page.getByRole("button", { name: "Try button" }).click();
  await expect(page.getByRole("status")).toHaveText("Button hydrated");
  await page.getByRole("textbox", { name: "Smoke name" }).fill("Packed package");
  await expect(page.getByRole("textbox", { name: "Smoke name" })).toHaveValue("Packed package");
  await page.getByRole("button", { name: "Smoke actions" }).click();
  await expect(page.getByRole("menuitem", { name: "Choose item" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toHaveText("Menu hydrated");
  await expect(page.getByRole("button", { name: "Smoke actions" })).toBeFocused();
  mkdirSync("artifacts/next", { recursive: true });
  await page.screenshot({ path: "artifacts/next/app-router.png", fullPage: true });
  assert.deepEqual(errors, [], "no browser errors or hydration errors");
  console.log(
    "Packed Next App Router server rendering, client boundaries, typing and hydration passed.",
  );
} finally {
  await browser?.close();
  // npm starts Next as a child; stop the whole process group created for this fixture.
  if (server.pid) process.kill(-server.pid, "SIGTERM");
}
