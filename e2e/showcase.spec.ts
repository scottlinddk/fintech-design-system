import { expect, test } from "@playwright/test";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

for (const theme of ["funder", "investor", "portare"]) {
  test(`${theme}: theme, keyboard, axe, motion and screenshots`, async ({ page }, info) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/?theme=${theme}`);
    await expect(
      page.getByRole("heading", { name: "Fintech Design System", exact: true }),
    ).toBeVisible();
    await page.waitForFunction(
      () => (document.querySelector("#fds-theme") as HTMLLinkElement).sheet !== null,
    );
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      theme === "portare" ? "rgb(250, 251, 252)" : "rgb(8, 9, 11)",
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
    await snapshot("open");
    await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
    const violations = await page.evaluate(async () => {
      const axe = (
        window as unknown as {
          axe: {
            run: (
              node: Document,
            ) => Promise<{ violations: { id: string; nodes: { target: string[] }[] }[] }>;
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
        window as unknown as { axe: { run: (n: Document) => Promise<{ violations: unknown[] }> } }
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
      .locator(".fds-panel", { has: page.getByRole("heading", { name: title }) })
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
