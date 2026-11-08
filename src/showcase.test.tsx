import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { Showcase } from "../showcase/Showcase.js";

it("showcases the real primitives rather than duplicate component markup", () => {
  const html = renderToStaticMarkup(<Showcase />);
  for (const name of [
    "panel",
    "button",
    "badge",
    "metric",
    "keyvalue",
    "notice",
    "empty",
    "field",
    "control",
    "meter",
    "segmeter",
    "distribution",
    "menu",
  ]) {
    expect(html).toContain(`fds-${name}`);
  }
  expect(html).toContain("Portare (proposed light)");
});
