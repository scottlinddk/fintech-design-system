import { describe, expect, it } from "vitest";
import {
  PACKAGE,
  changelogConsistency,
  evaluate,
  isShipped,
  parseChangeset,
} from "./changeset-policy.mjs";

const pkg = {
  name: PACKAGE,
  version: "0.3.0",
  exports: { ".": "./a" },
  devDependencies: { x: "1" },
};
const long =
  "Add a thing for consumers and explain what they must do about it, in enough detail to review.";
const cs = (bump, body = long) =>
  parseChangeset(".changeset/a.md", `---\n"${PACKAGE}": ${bump}\n---\n\n${body}\n`);
const run = (over) =>
  evaluate({ changed: [], basePkg: pkg, headPkg: pkg, changesets: [], ...over });

describe("shipped files", () => {
  it("counts source and styles, not tests, baselines or docs", () => {
    expect(isShipped("styles/components/panel.css")).toBe(true);
    expect(isShipped("src/components/Panel.tsx")).toBe(true);
    expect(isShipped("src/components/Panel.test.tsx")).toBe(false);
    expect(isShipped("src/css-split-baseline.json")).toBe(false);
    expect(isShipped("docs/TOKENS.md")).toBe(false);
    expect(isShipped("e2e/showcase.spec.ts")).toBe(false);
  });
});

describe("evaluate", () => {
  it("needs nothing for docs, tests and CI changes", () => {
    expect(
      run({ changed: ["docs/a.md", "src/a.test.ts", ".github/workflows/ci.yml", "README.md"] }),
    ).toEqual([]);
  });
  it("ignores devDependency-only package.json changes", () => {
    const head = { ...pkg, devDependencies: { x: "2" } };
    expect(run({ changed: ["package.json"], headPkg: head })).toEqual([]);
  });
  it("requires a changeset when shipped files change", () => {
    expect(run({ changed: ["styles/components/panel.css"] })[0]).toMatch(/no changeset/);
  });
  it("rejects an empty changeset for shipped changes", () => {
    const empty = parseChangeset(".changeset/e.md", "---\n---\n");
    expect(run({ changed: ["src/components/Panel.tsx"], changesets: [empty] })[0]).toMatch(
      /no changeset/,
    );
  });
  it("accepts a described changeset", () => {
    expect(run({ changed: ["src/components/Panel.tsx"], changesets: [cs("patch")] })).toEqual([]);
  });
  it("requires a real description", () => {
    expect(run({ changed: ["src/a.ts"], changesets: [cs("patch", "fix")] })[0]).toMatch(
      /at least 40/,
    );
    expect(run({ changed: ["src/a.ts"], changesets: [cs("minor", "x".repeat(60))] })[0]).toMatch(
      /at least 80/,
    );
  });
  it("requires at least minor for tokens, themes and exports", () => {
    const msg = /at least a minor/;
    expect(
      run({ changed: ["styles/themes/portare.css"], changesets: [cs("patch")] }).join(),
    ).toMatch(msg);
    expect(run({ changed: ["styles/tokens.css"], changesets: [cs("minor")] })).toEqual([]);
    const head = { ...pkg, exports: { ".": "./b" } };
    expect(
      run({ changed: ["package.json"], headPkg: head, changesets: [cs("patch")] }).join(),
    ).toMatch(msg);
  });
  it("forbids hand-edited versions and changelogs", () => {
    const errors = run({
      changed: ["CHANGELOG.md", "package.json"],
      headPkg: { ...pkg, version: "0.4.0" },
    });
    expect(errors.join()).toMatch(/version/);
    expect(errors.join()).toMatch(/CHANGELOG/);
  });
  it("lets the release branch change version and changelog", () => {
    expect(
      run({
        changed: ["CHANGELOG.md", "package.json"],
        headPkg: { ...pkg, version: "0.4.0" },
        headRef: "changeset-release/main",
      }),
    ).toEqual([]);
  });
  it("flags malformed changesets", () => {
    expect(run({ changesets: [parseChangeset(".changeset/b.md", "no frontmatter")] })[0]).toMatch(
      /frontmatter/,
    );
    expect(
      run({ changesets: [parseChangeset(".changeset/c.md", `---\n"other": minor\n---\nx`)] })[0],
    ).toMatch(/must list/);
  });
});

describe("changelogConsistency", () => {
  it("matches the top heading to the package version", () => {
    expect(changelogConsistency("# Changelog\n\n## 0.3.0\n", pkg)).toEqual([]);
    expect(changelogConsistency("# Changelog\n\n## 0.2.0\n", pkg)[0]).toMatch(/does not match/);
    expect(changelogConsistency("# nothing", pkg)[0]).toMatch(/no version heading/);
  });
});
