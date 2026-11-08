# Changesets

Every merge to `main` that changes what consumers receive needs a changeset. CI enforces this (`release-policy` job, `scripts/changeset-policy.mjs`).

## When

Needed when a PR changes `src/` (non-test), `styles/`, `package.json` exports or runtime dependencies. Not needed for docs, tests, CI, showcase or dev dependencies. Never edit `package.json` `version` or `CHANGELOG.md` by hand: both are generated.

## How

```bash
npx changeset
```

Pick the bump and describe the change for consumers. Rules CI checks:

- Tokens, themes (`styles/tokens.css`, `styles/themes/*`) and package exports: at least **minor** (AGENTS.md rule 6). While the package is 0.x, a minor may contain breaking changes, but say so.
- Description of at least 40 characters (patch) or 80 (minor, major).
- An empty changeset (`npx changeset --empty`) does not satisfy a PR that changes shipped files.

## Writing the entry

The text becomes the changelog line consumers read. Say what changed, what they will see, and what to do about it (migration, opt-out). Start with `VISIBLE CHANGE:` or `BREAKING:` when it applies. One changeset per independently releasable change; several per PR is fine.

## What happens on merge

1. The Release workflow runs checks and opens or updates a **"chore: version packages"** PR. It bumps the version from all pending changesets (highest bump wins) and generates `CHANGELOG.md`.
2. Review that PR's changelog; merging it publishes to npm and creates a GitHub release.
3. A merge without a changeset produces no release, which is correct for docs, tests and CI.
