import { expect, test } from "@playwright/test";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
const legacy: Record<string, Record<string, string>> = JSON.parse(
  readFileSync("src/legacy-token-values.json", "utf8"),
);
const require = createRequire(import.meta.url);

for (const theme of [
  "studio",
  "classic",
  "nuance",
  "caffeine",
  "boligdata",
  "tredjekort",
  "orbit",
  "funder",
  "investor",
  "portare",
]) {
  test(`${theme}: theme, keyboard, axe, motion and screenshots`, async ({ page }, info) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/?theme=${theme}`);
    await expect(page.getByRole("heading", { name: "Scttlnd UI", exact: true })).toBeVisible();
    await page.waitForFunction(
      () => (document.querySelector("#fds-theme") as HTMLLinkElement).sheet !== null,
    );
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      theme === "studio"
        ? "rgb(255, 255, 255)"
        : theme === "classic"
          ? "rgb(242, 235, 219)"
          : theme === "nuance"
            ? "rgb(251, 245, 236)"
            : theme === "caffeine"
              ? "rgb(249, 249, 249)"
              : theme === "boligdata"
                ? "rgb(255, 255, 255)"
                : theme === "tredjekort"
                  ? "rgb(250, 250, 248)"
                  : theme === "orbit"
                    ? "rgb(244, 240, 238)"
                    : theme === "portare"
                      ? "rgb(250, 251, 252)"
                      : "rgb(8, 9, 11)",
    );
    expect(await page.locator("link[rel=stylesheet][id=fds-theme]").count()).toBe(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    if (info.project.name === "mobile") {
      await expect(page.getByRole("textbox", { name: "Account name" })).toHaveCSS(
        "font-size",
        "16px",
      );
      for (const selector of [".fds-button", ".fds-control", ".fds-menu__trigger"]) {
        const sizes = await page
          .locator(selector)
          .evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().height));
        expect(sizes.every((height) => height >= 44)).toBe(true);
      }
    }
    const snapshot = async (state: string) => {
      const name = `${theme}-${state}.png`;
      await page.screenshot({
        path: info.outputPath(name),
        fullPage: true,
        animations: "disabled",
      });
      if (process.env.FDS_VISUAL)
        await expect(page).toHaveScreenshot(name, {
          fullPage: true,
          animations: "disabled",
          maxDiffPixels: 1000,
        });
    };
    await snapshot("closed");
    const trigger = page.getByRole("button", { name: "Example actions" });
    await trigger.focus();
    await expect(trigger).toHaveCSS("outline-style", "solid");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("menuitem", { name: "View details" })).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("menuitem", { name: "Remove example" })).toBeFocused();
    expect(
      await page.getByRole("menu").evaluate((menu) => {
        const bounds = menu.getBoundingClientRect();
        return bounds.left >= 0 && bounds.right <= innerWidth;
      }),
    ).toBe(true);
    await snapshot("open");
    await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
    const violations = await page.evaluate(async () => {
      const axe = (
        window as unknown as {
          axe: {
            run: (node: Document) => Promise<{
              violations: { id: string; nodes: { target: string[] }[] }[];
            }>;
          };
        }
      ).axe;
      return (await axe.run(document)).violations;
    });
    await info.attach("axe.json", {
      body: JSON.stringify(violations, null, 2),
      contentType: "application/json",
    });
    expect(violations).toEqual([]);
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    await expect(page.getByRole("menu")).toHaveCount(0);
    await page.emulateMedia({ reducedMotion: "reduce" });
    expect(
      await page
        .locator("html")
        .evaluate((node) => getComputedStyle(node).getPropertyValue("--fds-duration-base").trim()),
    ).toBe("0s");
    await expect(page.getByRole("button", { name: "Primary action" })).toHaveCSS(
      "transition-property",
      "none",
    );
    expect(errors).toEqual([]);
  });
}

test("earlier, less-specific consumer CSS overrides the fds layer", async ({ page }) => {
  await page.goto("/?theme=portare");
  const button = page.getByRole("button", { name: "Primary action" });
  await expect(button).toHaveCSS("font-weight", "600");
  await page.evaluate(() => {
    const style = document.createElement("style");
    style.textContent = "button { font-weight: 400; } :root { --fds-accent: var(--fds-success); }";
    // Put the consumer rule before package styles: layer precedence must win regardless of source order.
    document.head.prepend(style);
  });
  await expect(button).toHaveCSS("font-weight", "400");
  await expect(button).toHaveCSS("background-color", "rgb(31, 111, 74)");
  await button.focus();
  await expect(button).toHaveCSS("outline-style", "solid");
});

for (const theme of ["funder", "investor", "portare"]) {
  test(`${theme}: grain surfaces pass axe and stay inside the viewport`, async ({ page }) => {
    await page.goto(`/grain.html?theme=${theme}`);
    await page.waitForFunction(
      () => (document.querySelector("#fds-theme") as HTMLLinkElement).sheet !== null,
    );
    await expect(page.locator(".fds-grain").first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
    const violations = await page.evaluate(async () => {
      const axe = (
        window as unknown as {
          axe: { run: (n: Document) => Promise<{ violations: unknown[] }> };
        }
      ).axe;
      return (await axe.run(document)).violations;
    });
    expect(violations).toEqual([]);
  });
}

test("grain is on by default for panels and data-fds-grain=off opts out (self and ancestor)", async ({
  page,
}) => {
  await page.goto("/grain.html?theme=funder");
  await page.waitForFunction(
    () => (document.querySelector("#fds-theme") as HTMLLinkElement).sheet !== null,
  );
  const state = (title: string) =>
    page
      .locator(".fds-panel", {
        has: page.getByRole("heading", { name: title }),
      })
      .evaluate((el) => ({
        bg: getComputedStyle(el).backgroundImage,
        grain: getComputedStyle(el, "::before").content,
      }));
  const on = await state("Portfolio value");
  expect(on.bg).toContain("radial-gradient");
  expect(on.grain).not.toBe("none");
  for (const title of ["Flat panel", "Inherited"]) {
    const off = await state(title);
    expect(off.bg, title).toBe("none");
    expect(off.grain, title).toBe("none");
  }
});

for (const theme of ["funder", "portare"]) {
  test(`${theme}: components on a grain surface are opaque, so grain never shows through`, async ({
    page,
  }) => {
    await page.goto(`/grain.html?theme=${theme}`);
    await page.waitForFunction(
      () => (document.querySelector("#fds-theme") as HTMLLinkElement).sheet !== null,
    );
    const offenders = await page.evaluate(() => {
      // Computed colours serialise as rgb()/rgba() or color(srgb r g b / a); alpha defaults to 1.
      const alpha = (color: string) => {
        const slash = color.match(/\/\s*([\d.]+%?)\s*\)/);
        if (slash) return slash[1].endsWith("%") ? parseFloat(slash[1]) / 100 : Number(slash[1]);
        const rgba = color.match(/^rgba\(([^)]+)\)/);
        return rgba ? Number(rgba[1].split(",")[3]) : 1;
      };
      const out: string[] = [];
      const selectors =
        ".fds-badge, .fds-notice, .fds-metric, .fds-keyvalue, .fds-control, .fds-menu__trigger, .fds-button--primary, .fds-button--secondary";
      for (const el of document.querySelectorAll(
        `.fds-panel:not([data-fds-grain=off]) :is(${selectors})`,
      )) {
        if (el.closest("[data-fds-grain=off]")) continue;
        const style = getComputedStyle(el);
        const name = `${el.className} ${(el as HTMLButtonElement).disabled ? "(disabled)" : ""}`;
        if (alpha(style.backgroundColor) < 1) out.push(`${name}: translucent background`);
        for (let n: Element | null = el; n && !n.matches(".fds-panel"); n = n.parentElement)
          if (Number(getComputedStyle(n).opacity) < 1) out.push(`${name}: opacity below 1`);
      }
      return out;
    });
    expect(offenders).toEqual([]);
  });
}

test("Studio preview, theme mode and empty state work together", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByLabel("Theme", { exact: true })).toHaveValue("studio");
  await expect(page.locator("body")).toHaveCSS("font-family", /DM Sans/);
  await page.getByRole("tab", { name: "Overview", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Activity", exact: true })).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText("Monthly statement");
  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: "Settings", exact: true })).toBeFocused();
  await page.getByLabel("Workspace name").fill("My workspace");
  await page.getByRole("button", { name: "Save preferences" }).click();
  await expect(page.getByRole("tabpanel")).toContainText("Preferences saved.");
  await page.getByLabel("Workspace name").fill("Another workspace");
  await expect(page.getByRole("tabpanel")).not.toContainText("Preferences saved.");
  await page.getByRole("button", { name: "Create view" }).click();
  await expect(page.getByText("My first view", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Remove view" }).click();
  await expect(page.getByText("No saved views", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(23, 23, 23)");
  await expect(page).toHaveURL(/mode=dark/);
  await page.reload();
  await expect(page.getByRole("button", { name: "Switch to light mode" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
  const violations = await page.evaluate(async () => {
    const axe = (
      window as unknown as {
        axe: { run: (n: Document) => Promise<{ violations: unknown[] }> };
      }
    ).axe;
    return (await axe.run(document)).violations;
  });
  expect(violations).toEqual([]);
});

test("styles.css alone defaults to Studio, including flat panels and dark mode", async ({
  page,
}) => {
  // Start on Funder so no showcase-only Studio selectors or grain opt-out can hide package failures.
  await page.goto("/?theme=funder");
  await page.evaluate(() => {
    document.getElementById("fds-theme")?.remove();
    document.documentElement.removeAttribute("data-fds-theme");
    document.documentElement.removeAttribute("data-fds-mode");
  });
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(page.locator("body")).toHaveCSS("font-family", /DM Sans/);
  const panel = page.getByRole("region", {
    name: "Actions & feedback",
    exact: true,
  });
  // Exercise the primitive outside showcase composition rules, as in a consumer app.
  await panel.evaluate((el) => document.body.append(el));
  await expect(panel).toHaveCSS("background-image", "none");
  expect(await panel.evaluate((el) => getComputedStyle(el, "::before").content)).toBe("none");
  await panel.evaluate((el) => el.style.setProperty("--fds-panel", "#eff6f0"));
  await expect(panel).toHaveCSS("background-color", "rgb(239, 246, 240)");
  await panel.evaluate((el) => el.style.removeProperty("--fds-panel"));
  const button = page.getByRole("button", {
    name: "Primary action",
    exact: true,
  });
  await expect(button).toHaveCSS("background-color", "rgb(33, 72, 62)");
  await expect(button).toHaveCSS("color", "rgb(255, 255, 255)");
  await page.evaluate(() => {
    document.documentElement.dataset.fdsMode = "dark";
  });
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(23, 23, 23)");
  await expect(button).toHaveCSS("background-color", "rgb(211, 248, 115)");
  await expect(button).toHaveCSS("color", "rgb(17, 41, 31)");
  await expect(panel).toHaveCSS("background-image", "none");
  await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
  const violations = await page.evaluate(async () => {
    const axe = (
      window as unknown as {
        axe: { run: (n: Document) => Promise<{ violations: unknown[] }> };
      }
    ).axe;
    return (await axe.run(document)).violations;
  });
  expect(violations).toEqual([]);
});

for (const theme of ["funder", "investor", "portare"] as const) {
  test(`${theme}: explicit import preserves the original palette without a theme attribute`, async ({
    page,
  }) => {
    await page.goto(`/?theme=${theme}`);
    await page.waitForFunction(
      () => (document.querySelector("#fds-theme") as HTMLLinkElement).sheet !== null,
    );
    await page.evaluate(() => {
      document.documentElement.removeAttribute("data-fds-theme");
      // An inherited Studio mode must not defeat an explicitly imported product theme.
      document.documentElement.dataset.fdsMode = "dark";
    });
    const local: Record<string, string> = {};
    for (const [, name, value] of readFileSync(`styles/themes/${theme}.css`, "utf8").matchAll(
      /(--fds-[\w-]+):\s*([^;]+);/g,
    ))
      local[name] ??= value.trim();
    const expected = {
      ...legacy["styles/tokens.css"],
      ...legacy[`styles/themes/${theme}.css`],
      ...Object.fromEntries(
        Object.entries(local).filter(([name]) => /^--fds-chart-[1-6]$/.test(name)),
      ),
    };
    const actual = await page.locator("html").evaluate((html, names) => {
      const css = getComputedStyle(html);
      return Object.fromEntries(
        names.map((name) => [name, css.getPropertyValue(name).trim().replace(/\s+/g, " ")]),
      );
    }, Object.keys(expected));
    // The production CSS minifier drops leading zeroes in custom-property lengths.
    expect(actual).toEqual(
      Object.fromEntries(
        Object.entries(expected).map(([name, value]) => [name, value.replace(/^0\./, ".")]),
      ),
    );
    await expect(page.locator("html")).toHaveCSS(
      "color-scheme",
      theme === "portare" ? "light" : "dark",
    );
    await expect(
      page.getByRole("region", { name: "Actions & feedback", exact: true }),
    ).not.toHaveCSS("background-image", "none");
  });
}

test("explicit grain surfaces remain available with the Studio default", async ({ page }) => {
  await page.goto("/grain.html?theme=funder");
  await page.evaluate(() => {
    document.getElementById("fds-theme")?.remove();
    document.documentElement.removeAttribute("data-fds-theme");
  });
  await expect(page.locator(".fds-grain").first()).not.toHaveCSS("background-image", "none");
  await expect(page.getByRole("region", { name: "Portfolio value", exact: true })).not.toHaveCSS(
    "background-image",
    "none",
  );
  await expect(page.getByRole("region", { name: "Components stay on top", exact: true })).toHaveCSS(
    "background-image",
    "none",
  );
});
