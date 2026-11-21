import { expect, test, type Page } from "@playwright/test";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const themes = [
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
];

async function open(page: Page, query: string) {
  await page.goto(`/?${query}`);
  await page.waitForFunction(
    () => (document.querySelector("#fds-theme") as HTMLLinkElement).sheet !== null,
  );
}

/** Wait for finite animations (dialog and backdrop enter) so axe and contrast never see a half-faded frame. */
async function settled(page: Page, selector: string) {
  await page.locator(selector).evaluate((node) =>
    Promise.all(
      node.ownerDocument
        .getAnimations()
        .filter((a) => Number.isFinite(a.effect?.getComputedTiming().endTime ?? Infinity))
        .map((a) => a.finished.catch(() => undefined)),
    ),
  );
}

async function axeViolations(page: Page) {
  await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
  return page.evaluate(async () => {
    const axe = (
      window as unknown as { axe: { run: (n: Document) => Promise<{ violations: unknown[] }> } }
    ).axe;
    return (await axe.run(document)).violations;
  });
}

/** WCAG contrast of the element's text over its own background, after the browser resolves both. */
async function contrast(page: Page, selector: string) {
  return page.locator(selector).evaluate((node) => {
    const style = getComputedStyle(node);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const context = canvas.getContext("2d", { willReadFrequently: true })!;
    const rgb = (value: string) => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = "#000";
      context.fillStyle = value;
      context.fillRect(0, 0, 1, 1);
      return Array.from(context.getImageData(0, 0, 1, 1).data.slice(0, 3));
    };
    const lum = ([r, g, b]: number[]) => {
      const f = (c: number) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
      return 0.2126 * f(r!) + 0.7152 * f(g!) + 0.0722 * f(b!);
    };
    const a = lum(rgb(style.color));
    const b = lum(rgb(style.backgroundColor));
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  });
}

for (const theme of themes) {
  for (const mode of ["light", "dark"]) {
    test(`${theme}/${mode}: dialog, sheet and alert dialog render, pass axe and keep contrast`, async ({
      page,
    }, info) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await open(page, `theme=${theme}&mode=${mode}`);

      await page.getByRole("button", { name: "Open dialog" }).click();
      const dialog = page.getByRole("dialog", { name: "Edit account" });
      await expect(dialog).toBeVisible();
      await settled(page, "dialog[open]");
      await expect(dialog).toHaveCSS("opacity", "1");
      // The backdrop resolves the overlay token (needs ::backdrop custom-property inheritance).
      const backdrop = await dialog.evaluate(
        (node) => getComputedStyle(node, "::backdrop").backgroundColor,
      );
      expect(backdrop).not.toBe("rgba(0, 0, 0, 0)");
      expect(await axeViolations(page)).toEqual([]);
      await page.screenshot({ path: info.outputPath(`${theme}-${mode}-dialog.png`) });
      await page.keyboard.press("Escape");
      await expect(dialog).toHaveCount(0);

      await page.getByRole("button", { name: "Delete account" }).click();
      const alert = page.getByRole("alertdialog", { name: "Delete account Savings?" });
      await expect(alert).toBeVisible();
      await settled(page, "dialog[open]");
      expect(await contrast(page, "dialog .fds-button--danger")).toBeGreaterThanOrEqual(4.5);
      expect(await axeViolations(page)).toEqual([]);
      await page.screenshot({ path: info.outputPath(`${theme}-${mode}-alert.png`) });
      expect(errors).toEqual([]);
    });
  }
}

test("keyboard, focus restore, backdrop, scroll lock and nesting work in a real browser", async ({
  page,
}) => {
  await open(page, "theme=studio");
  const trigger = page.getByRole("button", { name: "Open dialog" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Edit account" });
  await expect(dialog).toBeVisible();
  // Modal: focus is inside, the page behind is inert and its scroll is locked.
  expect(await dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe(
    "hidden",
  );
  await expect(page.getByRole("button", { name: "Open bottom sheet" })).not.toBeFocused();
  for (let i = 0; i < 8; i++) await page.keyboard.press("Tab");
  expect(await dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true);
  // Backdrop press closes and returns focus.
  await page.mouse.click(4, 4);
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).not.toBe(
    "hidden",
  );

  // Escape closes and returns focus.
  await page.keyboard.press("Enter");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();

  // AlertDialog: initial focus is Cancel, backdrop press does not dismiss, Escape does.
  const del = page.getByRole("button", { name: "Delete account" });
  await del.click();
  const alert = page.getByRole("alertdialog");
  await expect(alert.getByRole("button", { name: "Cancel" })).toBeFocused();
  await page.mouse.click(4, 4);
  await expect(alert).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(alert).toHaveCount(0);
  await expect(del).toBeFocused();

  // Nested sheets: Escape closes only the top one.
  await page.getByRole("button", { name: "Open bottom sheet" }).click();
  await page.getByRole("button", { name: "More filters", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "More filters" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "More filters" })).toHaveCount(0);
  await expect(page.getByRole("dialog", { name: "Filters" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Filters" })).toHaveCount(0);
});

test("reduced motion removes the dialog animation instead of shortening it", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page, "theme=studio");
  await page.getByRole("button", { name: "Open dialog" }).click();
  const dialog = page.getByRole("dialog", { name: "Edit account" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveCSS("transition-property", "none");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0, { timeout: 200 });
});

test("the bottom sheet sits on the bottom edge inside the viewport", async ({ page }) => {
  await open(page, "theme=studio");
  await page.getByRole("button", { name: "Open bottom sheet" }).click();
  const sheet = page.getByRole("dialog", { name: "Filters" });
  await expect(sheet).toBeVisible();
  await page.waitForTimeout(500);
  const box = await sheet.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return {
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom,
      width: innerWidth,
      height: innerHeight,
    };
  });
  expect(box.left).toBeGreaterThanOrEqual(0);
  expect(box.right).toBeLessThanOrEqual(box.width);
  expect(Math.round(box.bottom)).toBe(box.height);
});
