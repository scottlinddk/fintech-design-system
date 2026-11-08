// Seed Changesets before its action decides between versioning and publishing.
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { parseChangeset } from "./changeset-policy.mjs";

export function prepareRelease(cwd = process.cwd()) {
  const git = (...args) => execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
  const pkg = JSON.parse(readFileSync(join(cwd, "package.json"), "utf8"));
  // The first parent is main before a merge (also works with squash/rebase).
  // Use HEAD^, not the push's before SHA: a batched push may include a release
  // followed by ordinary changes, which still need the next minor release.
  const previous = JSON.parse(git("show", "HEAD^:package.json"));
  const files = readdirSync(join(cwd, ".changeset"))
    .filter((name) => name.endsWith(".md") && name !== "README.md")
    .map((name) => join(cwd, ".changeset", name));
  const changesets = files.map((file) => parseChangeset(file, readFileSync(file, "utf8")));
  for (const c of changesets) {
    if (c.invalid || (!c.empty && !c.bump)) throw new Error(`Invalid changeset: ${c.file}`);
  }
  if (changesets.some((c) => c.bump)) return "explicit";
  if (previous.version !== pkg.version) return "publish";

  // Include the committed SHA as a source because this generated changeset is
  // intentionally untracked and consumed only in the action's version branch.
  // git reset --hard in changesets/action preserves this untracked file.
  const sha = git("rev-parse", "HEAD");
  const summary = `Release the changes merged into main with the default minor version bump. Review [the source commit](https://github.com/scottlinddk/fintech-design-system/commit/${sha}) and verify affected consumers before upgrading.`;
  writeFileSync(
    join(cwd, ".changeset", "automatic-minor.md"),
    `---\n"${pkg.name}": minor\n---\n\n${summary}\n`,
    { flag: "wx" },
  );
  return "minor";
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(`Release preparation: ${prepareRelease()}.`);
}
