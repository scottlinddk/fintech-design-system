// Release policy enforced in CI so every merge to main produces a correct version bump and changelog.
// Versioning stays with Changesets: explicit changesets override the automatic minor default.
// The "version packages" PR bumps package.json and generates CHANGELOG.md; merging it publishes.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

export const PACKAGE = "@scttlnd/fintech-design-system";
export const RELEASE_BRANCH = "changeset-release/main";

/** @returns {{bump: string|null, empty: boolean, body: string, file: string}} */
export function parseChangeset(file, text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n?---\r?\n?([\s\S]*)$/);
  if (!match) return { file, bump: null, empty: false, body: text.trim(), invalid: true };
  const entry = match[1].match(
    new RegExp(`["']?${PACKAGE.replace("/", "\\/")}["']?\\s*:\\s*(patch|minor|major)`),
  );
  return {
    file,
    bump: entry ? entry[1] : null,
    empty: match[1].trim() === "",
    body: match[2].trim(),
  };
}

/**
 * @param {{changed: string[], basePkg: object, headPkg: object, changesets: ReturnType<typeof parseChangeset>[], headRef?: string}} input
 * @returns {string[]} human-readable problems; empty when the PR satisfies the policy
 */
export function evaluate({ changed, basePkg, headPkg, changesets, headRef = "" }) {
  if (headRef === RELEASE_BRANCH) return [];
  const errors = [];
  if (basePkg.version !== headPkg.version)
    errors.push(
      "package.json `version` must not be edited by hand. Add a changeset; the release workflow bumps it.",
    );
  if (changed.includes("CHANGELOG.md"))
    errors.push("CHANGELOG.md is generated from changesets and must not be edited by hand.");

  const real = changesets.filter((c) => c.bump);

  for (const c of changesets) {
    if (c.invalid)
      errors.push(`${c.file}: missing "---" frontmatter. Create it with \`npx changeset\`.`);
    else if (!c.empty && !c.bump)
      errors.push(`${c.file}: must list "${PACKAGE}" with patch, minor or major.`);
  }
  for (const c of real) {
    const min = c.bump === "patch" ? 40 : 80;
    if (c.body.length < min)
      errors.push(
        `${c.file}: the ${c.bump} description is ${c.body.length} characters; write at least ${min} so the changelog explains what changed and what consumers must do.`,
      );
  }
  return errors;
}

/** The top CHANGELOG heading must equal package.json's version, so a bump is never half applied. */
export function changelogConsistency(changelog, pkg) {
  const top = changelog.match(/^## (\d+\.\d+\.\d+)/m);
  if (!top) return ["CHANGELOG.md has no version heading."];
  return top[1] === pkg.version
    ? []
    : [`CHANGELOG.md top version ${top[1]} does not match package.json version ${pkg.version}.`];
}

function git(...args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}
function main() {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const report = (errors) => {
    for (const message of errors) console.log(`::error::${message}`);
    if (errors.length) process.exit(1);
  };
  if (process.argv.includes("--consistency")) {
    report(changelogConsistency(readFileSync("CHANGELOG.md", "utf8"), pkg));
    console.log(`Version ${pkg.version} matches the changelog.`);
    return;
  }
  const base = `origin/${process.env.BASE_REF || "main"}`;
  const changed = git("diff", "--name-only", "--diff-filter=ACMRD", `${base}...HEAD`)
    .split("\n")
    .filter(Boolean);
  const added = git("diff", "--name-only", "--diff-filter=AM", `${base}...HEAD`, "--", ".changeset")
    .split("\n")
    .filter((file) => file.endsWith(".md") && !file.endsWith("README.md"));
  const changesets = added.map((file) => parseChangeset(file, readFileSync(file, "utf8")));
  const basePkg = JSON.parse(git("show", `${base}:package.json`));
  report(evaluate({ changed, basePkg, headPkg: pkg, changesets, headRef: process.env.HEAD_REF }));
  console.log(`Release policy satisfied (${changesets.length} changeset file(s) in this PR).`);
}
if (import.meta.url === `file://${process.argv[1]}`) main();
