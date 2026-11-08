# Changesets

Every ordinary push to `main` defaults to a **minor** release, including documentation, tests and CI changes. You do not need to add a changeset to get a version bump.

## Explicit overrides

Run `npx changeset` to select **patch**, **minor** or **major** and write specific release notes. If any pending changeset names this package, those explicit changesets take precedence over the automatic minor default. Changesets chooses the highest pending explicit bump. An empty changeset does not override the default or skip a release.

Descriptions need at least 40 characters for patch, or 80 for minor/major. Explain what consumers will see and any migration or opt-out. Start with `VISIBLE CHANGE:` or `BREAKING:` when applicable. Public token, theme and export changes still need consumer verification. An explicit patch is allowed, so choose it only when the change is compatible.

Never edit `package.json` `version` or `CHANGELOG.md` by hand. Both are generated.

## What happens on merge

1. The Release workflow runs checks. `scripts/prepare-release.mjs` preserves explicit changesets or generates an untracked minor changeset for Changesets to consume. Its release notes link to the source commit.
2. Changesets opens or updates **"chore: version packages"**, generates the changelog and bumps the package and lockfile. For example, `0.3.0` becomes `0.4.0` by default, `0.3.1` with an explicit patch, or `1.0.0` with an explicit major.
3. Review and merge that PR to publish to npm and create the GitHub release. A version change relative to the merge's first parent identifies this publishing step, so it does not seed another bump. This works with merge, squash and rebase commits.
4. Further ordinary merges update the pending version PR; they do not increment the minor repeatedly before that release is merged.

## Publishing retries and npm staging

The log `E409: Cannot publish over previously staged version` means that version is already staged on npm. It does not mean a changeset or version bump is missing. npm scans newly published packages before making them available, usually taking about five minutes and sometimes 15 minutes or longer. Check npm package availability and any maintainer notifications before retrying. Do not treat the conflict alone as successful publication or bump versions automatically to bypass it.

Source: [npm publish-time malware scanning](https://github.blog/changelog/2026-07-28-npm-publish-time-malware-scanning-and-dual-use-metadata/) (checked 2026-11-08).

Re-run the failed release job, or use **Actions → Release → Run workflow** on `main` after the release PR is merged. Manual dispatch does not generate a default changeset, so it can retry the committed version. If explicit changesets are pending, the normal Changesets action creates or updates their version PR instead of publishing. Failed publication remains a failure for investigation.
