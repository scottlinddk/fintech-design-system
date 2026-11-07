import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  Badge,
  DistributionList,
  EmptyState,
  Field,
  Input,
  Menu,
  Meter,
  Metric,
  Notice,
  Panel,
  SegmentedMeter,
} from "../index.js";

const html = (node: Parameters<typeof renderToStaticMarkup>[0]) => renderToStaticMarkup(node);

describe("Panel", () => {
  it("labels the section by its heading", () => {
    const out = html(createElement(Panel, { title: "Holdings", headingLevel: 3 }, "x"));
    const id = /aria-labelledby="([^"]+)"/.exec(out)?.[1];
    expect(id).toBeTruthy();
    expect(out).toContain(`<h3 id="${id}"`);
  });
});

describe("Metric / Badge", () => {
  it("renders tone class without formatting the value", () => {
    const out = html(createElement(Metric, { label: "Return", value: "+1,2 %", tone: "success" }));
    expect(out).toContain("fds-tone--success");
    expect(out).toContain("+1,2 %");
  });
  it("hides decorative icon from assistive tech", () => {
    const out = html(createElement(Badge, { tone: "warn", icon: "!" }, "Review"));
    expect(out).toContain('aria-hidden="true"');
    expect(out).toContain("fds-badge--warn");
  });
});

describe("Notice / EmptyState", () => {
  it("uses alert for danger and status otherwise", () => {
    expect(html(createElement(Notice, { tone: "danger" }, "x"))).toContain('role="alert"');
    expect(html(createElement(Notice, {}, "x"))).toContain('role="status"');
  });
  it("renders title and action", () => {
    const out = html(createElement(EmptyState, { title: "Nothing", action: "Add" }));
    expect(out).toContain("Nothing");
    expect(out).toContain("Add");
  });
});

describe("Field", () => {
  it("wires label, description and invalid state", () => {
    const out = html(
      createElement(Field, {
        label: "Name",
        hint: "Hint",
        error: "Required",
        children: (c) => createElement(Input, c),
      }),
    );
    expect(out).toMatch(/<label[^>]*for="([^"]+)"/);
    expect(out).toContain('aria-invalid="true"');
    expect(out).toMatch(/aria-describedby="[^"]+-hint [^"]+-error"/);
  });
});

describe("Meter", () => {
  it("clamps out-of-range values", () => {
    const out = html(createElement(Meter, { label: "Score", value: 140 }));
    expect(out).toContain('aria-valuenow="100"');
    expect(out).toContain("width:100%");
  });
  it("guards a degenerate range", () => {
    expect(html(createElement(Meter, { label: "x", value: 5, min: 5, max: 5 }))).toContain(
      "width:0%",
    );
  });
  it("fills segments", () => {
    const out = html(createElement(SegmentedMeter, { label: "Risk", value: 3 }));
    expect(out.match(/fds-segmeter__segment--on/g)).toHaveLength(3);
    expect(out).toContain('aria-valuemax="7"');
  });
});

describe("DistributionList", () => {
  it("sorts, limits and scales to the largest row", () => {
    const out = html(
      createElement(DistributionList, {
        items: [
          { label: "B", value: 10 },
          { label: "A", value: 40 },
          { label: "C", value: 20 },
        ],
        limit: 2,
        renderOverflow: (n) => `+${n}`,
      }),
    );
    expect(out.indexOf(">A<")).toBeLessThan(out.indexOf(">C<"));
    expect(out).not.toContain(">B<");
    expect(out).toContain("width:50%");
    expect(out).toContain("+1");
  });
  it("shows the empty message when nothing is positive", () => {
    const out = html(
      createElement(DistributionList, { items: [{ label: "A", value: 0 }], empty: "No data" }),
    );
    expect(out).toContain("No data");
  });
});

describe("Menu", () => {
  it("is collapsed by default with menu semantics on the trigger", () => {
    const out = html(createElement(Menu, { ariaLabel: "Actions", items: [] }));
    expect(out).toContain('aria-haspopup="menu"');
    expect(out).toContain('aria-expanded="false"');
    expect(out).not.toContain('role="menu"');
  });
});
