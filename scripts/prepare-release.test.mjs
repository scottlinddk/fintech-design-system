import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { PACKAGE, parseChangeset } from "./changeset-policy.mjs";
import { prepareRelease } from "./prepare-release.mjs";

const dirs = [];
afterEach(() => dirs.splice(0).forEach((dir) => rmSync(dir, { recursive: true, force: true })));
function repo() {
  const cwd = mkdtempSync(join(tmpdir(), "fds-release-"));
  dirs.push(cwd);
  const git = (...args) => execFileSync("git", args, { cwd, encoding: "utf8", stdio: "pipe" });
  const write = (file, content) => writeFileSync(join(cwd, file), content);
  const version = (v) => write("package.json", JSON.stringify({ name: PACKAGE, version: v }));
  const commit = (message) => {
    git("add", ".");
    git("commit", "--allow-empty", "-m", message);
  };
  git("init", "-b", "main");
  git("config", "user.email", "test@example.com");
  git("config", "user.name", "Test");
  mkdirSync(join(cwd, ".changeset"));
  write(".changeset/README.md", "Changesets");
  version("0.3.0");
  commit("Initial");
  commit("Ordinary merge");
  return { cwd, git, write, version, commit };
}

describe("release preparation in a real checkout", () => {
  it("generates a minor and survives the action's branch reset", () => {
    const { cwd, git } = repo();
    expect(prepareRelease(cwd)).toBe("minor");
    git("checkout", "-b", "changeset-release/main");
    git("reset", "--hard", "HEAD");
    const text = readFileSync(join(cwd, ".changeset/automatic-minor.md"), "utf8");
    expect(parseChangeset("automatic-minor.md", text).bump).toBe("minor");
    expect(text).toContain(git("rev-parse", "HEAD").trim());
    expect(prepareRelease(cwd)).toBe("explicit"); // idempotent on the same workspace
  });
  it.each(["patch", "minor", "major"])("preserves an explicit %s", (bump) => {
    const { cwd, write, commit } = repo();
    write(".changeset/custom.md", `---\n"${PACKAGE}": ${bump}\n---\n\nExplicit release notes.\n`);
    commit("Explicit bump");
    expect(prepareRelease(cwd)).toBe("explicit");
  });
  it("publishes a merged version without creating a release loop", () => {
    const { cwd, version, commit } = repo();
    version("0.4.0");
    commit("Merge version PR");
    expect(prepareRelease(cwd)).toBe("publish");
    expect(prepareRelease(cwd)).toBe("publish"); // rerunning a release cannot bump again
    commit("Next ordinary merge in the same push");
    expect(prepareRelease(cwd)).toBe("minor");
  });
  it("does not treat an empty changeset as a bump override", () => {
    const { cwd, write, commit } = repo();
    write(".changeset/empty.md", "---\n---\n");
    commit("Empty changeset");
    expect(prepareRelease(cwd)).toBe("minor");
  });
  it("fails on malformed changesets instead of hiding them with a default", () => {
    const { cwd, write, commit } = repo();
    write(".changeset/bad.md", "missing frontmatter");
    commit("Malformed changeset");
    expect(() => prepareRelease(cwd)).toThrow(/Invalid changeset/);
  });
});
