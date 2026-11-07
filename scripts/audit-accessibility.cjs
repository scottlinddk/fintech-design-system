const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

(async () => {
  const out = path.resolve("artifacts/accessibility");
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const findings = [];
  const failures = [];
  const axeSource = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
  try {
    for (const theme of ["dark", "light"]) {
      for (const width of [390, 1280]) {
        const page = await browser.newPage({ viewport: { width, height: 900 } });
        await page.goto(pathToFileURL(path.resolve("showcase/index.html")).href);
        await page.evaluate((t) => {
          document.documentElement.dataset.theme = t;
        }, theme);
        await page.screenshot({
          path: path.join(out, theme + "-" + width + ".png"),
          fullPage: true,
        });
        await page.addScriptTag({ content: axeSource });
        const results = await page.evaluate(async () =>
          window.axe.run(document, {
            runOnly: {
              type: "tag",
              values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
            },
          }),
        );
        findings.push({
          theme,
          width,
          violations: results.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
            nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
          })),
        });
        if (results.violations.length)
          failures.push(theme + " " + width + ": " + results.violations.length + " axe violations");
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        );
        if (overflow) failures.push(theme + " " + width + ": horizontal page overflow");
        await page.keyboard.press("Tab");
        const focus = await page.evaluate(() => ({
          tag: document.activeElement.tagName,
          visible: getComputedStyle(document.activeElement).outlineStyle !== "none",
        }));
        if (focus.tag !== "BUTTON" || !focus.visible)
          failures.push(theme + " " + width + ": keyboard focus missing");
        await page.keyboard.press("Enter");
        const switched = await page.evaluate(() => document.documentElement.dataset.theme);
        if (switched === theme)
          failures.push(theme + " " + width + ": theme button did not toggle");
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
  fs.writeFileSync(
    path.join(out, "report.json"),
    JSON.stringify(
      { findings, failures, note: "VoiceOver requires manual macOS/iOS testing." },
      null,
      2,
    ),
  );
  // Findings are advisory: surface them as GitHub warning annotations without failing the job.
  // Only a crash of the audit itself (see .catch below) produces a non-zero exit code.
  if (failures.length) {
    for (const failure of failures) console.log("::warning title=Accessibility audit::" + failure);
    console.log(failures.length + " accessibility warning(s); see report.json for details.");
  } else {
    console.log("Automated checks passed");
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
