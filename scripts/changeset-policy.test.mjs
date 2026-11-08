import { describe, expect, it } from "vitest";
import { PACKAGE, changelogConsistency, evaluate, parseChangeset } from "./changeset-policy.mjs";

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
  it("allows shipped changes to use the automatic minor default", () => {
    expect(run({ changed: ["styles/components/panel.css"] })).toEqual([]);
  });
  it("allows empty changesets without disabling the automatic default", () => {
    const empty = parseChangeset(".changeset/e.md", "---\n---\n");
    expect(run({ changed: ["src/components/Panel.tsx"], changesets: [empty] })).toEqual([]);
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
  it("accepts an explicit patch override for tokens, themes and exports", () => {
    for (const path of ["styles/themes/portare.css", "styles/tokens.css"])
      expect(run({ changed: [path], changesets: [cs("patch")] })).toEqual([]);
    const head = { ...pkg, exports: { ".": "./b" } };
    expect(run({ changed: ["package.json"], headPkg: head, changesets: [cs("patch")] })).toEqual(
      [],
    );
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
