// @vitest-environment happy-dom
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import * as matchers from "vitest-axe/matchers";
import "vitest-axe/extend-expect";
import {
  Skeleton,
  SkeletonGroup,
  SkeletonText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Toast,
  ToastRegion,
} from "./index.js";

expect.extend(matchers);
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("motion and layout tokens", () => {
  const css = readFileSync("styles/motion.css", "utf8");
  it("defines enter, exit and slow durations, the three emphasized easings and a sticky offset", () => {
    for (const name of [
      "duration-enter",
      "duration-exit",
      "duration-slow",
      "ease-emphasized",
      "ease-decelerate",
      "ease-accelerate",
      "sticky-offset",
    ])
      expect(css).toContain(`--fds-${name}:`);
    expect(css).toContain("cubic-bezier(0.2, 0, 0, 1)");
    expect(css).toContain("cubic-bezier(0.05, 0.7, 0.1, 1)");
    expect(css).toContain("cubic-bezier(0.3, 0, 0.8, 0.15)");
    expect(css).toContain("scroll-padding-top: var(--fds-sticky-offset)");
  });
  it("keeps exits shorter than entries and zeroes durations for reduced motion", () => {
    expect(css).toMatch(/--fds-duration-enter: 0\.3s/);
    expect(css).toMatch(/--fds-duration-exit: 0\.15s/);
    expect(css).toMatch(/prefers-reduced-motion: reduce\)[\s\S]*--fds-duration-enter: 0s/);
  });
});

describe("accessibility stylesheets", () => {
  it("adds forced-colors rules for badge, meter and button", () => {
    const css = readFileSync("styles/components/a11y.css", "utf8");
    expect(css).toContain("forced-colors: active");
    for (const selector of [".fds-badge", ".fds-meter__fill", ".fds-button"])
      expect(css).toContain(selector);
  });
  it("gives Nuance an opaque fallback for reduced transparency", () => {
    const css = readFileSync("styles/themes/nuance.css", "utf8");
    expect(css).toContain("prefers-reduced-transparency: reduce");
    expect(css).toMatch(/--fds-glass-shadow: none/);
  });
  it("stops skeleton and toast animation under reduced motion", () => {
    for (const file of ["skeleton", "toast"])
      expect(readFileSync(`styles/components/${file}.css`, "utf8")).toMatch(
        /prefers-reduced-motion: reduce\)[\s\S]*animation: none/,
      );
  });
});

describe("Skeleton", () => {
  it("is hidden from assistive tech and announced through its group", async () => {
    const { container } = render(
      <SkeletonGroup label="Loading holdings">
        <Skeleton width={120} />
        <SkeletonText lines={2} />
      </SkeletonGroup>,
    );
    const group = screen.getByRole("status");
    expect(group.getAttribute("aria-busy")).toBe("true");
    expect(group.textContent).toContain("Loading holdings");
    expect(container.querySelectorAll('.fds-skeleton[aria-hidden="true"]').length).toBe(3);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Toast", () => {
  it("runs undo then dismisses, and offers a labelled dismiss button", async () => {
    const user = userEvent.setup();
    const undo = vi.fn();
    const dismiss = vi.fn();
    const { container } = render(
      <ToastRegion>
        <Toast
          tone="success"
          title="Transfer scheduled"
          action={{ label: "Undo", onSelect: undo }}
          onDismiss={dismiss}
        >
          Moves on Monday.
        </Toast>
      </ToastRegion>,
    );
    expect(screen.getByRole("region", { name: "Notifications" })).toBeTruthy();
    expect(await axe(container)).toHaveNoViolations();
    await user.click(screen.getByRole("button", { name: "Undo" }));
    expect(undo).toHaveBeenCalledTimes(1);
    expect(dismiss).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(dismiss).toHaveBeenCalledTimes(2);
  });
  it("auto-dismisses after the duration unless paused by hover; danger is persistent and an alert", () => {
    vi.useFakeTimers();
    const dismiss = vi.fn();
    render(
      <Toast onDismiss={dismiss} duration={1000}>
        Saved
      </Toast>,
    );
    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(dismiss).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(dismiss).toHaveBeenCalledTimes(1);
    cleanup();
    const hold = vi.fn();
    render(
      <Toast onDismiss={hold} duration={1000}>
        Saved
      </Toast>,
    );
    const toast = screen.getByRole("status");
    act(() => {
      toast.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    });
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(hold).not.toHaveBeenCalled();
    cleanup();
    const persistent = vi.fn();
    render(
      <Toast tone="danger" onDismiss={persistent}>
        Failed
      </Toast>,
    );
    act(() => {
      vi.advanceTimersByTime(60000);
    });
    expect(persistent).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toBeTruthy();
  });
});

describe("Table", () => {
  it("renders a labelled scroll region, sort state and numeric cells", async () => {
    const user = userEvent.setup();
    const sort = vi.fn();
    const { container } = render(
      <Table caption="Holdings" density="compact">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell numeric sort="descending" onSort={sort}>
              Value
            </TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Fund A</TableCell>
            <TableCell numeric>1.234,50</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole("region", { name: "Holdings" }).getAttribute("tabindex")).toBe("0");
    expect(container.querySelector("table")?.className).toContain("fds-table--compact");
    expect(screen.getByRole("columnheader", { name: /Value/ }).getAttribute("aria-sort")).toBe(
      "descending",
    );
    expect(container.querySelector("td[data-numeric]")?.getAttribute("data-align")).toBe("end");
    await user.click(screen.getByRole("button", { name: /Value/ }));
    expect(sort).toHaveBeenCalledTimes(1);
    expect(await axe(container)).toHaveNoViolations();
  });
});
