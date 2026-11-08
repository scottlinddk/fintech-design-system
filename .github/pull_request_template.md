## Summary

<!-- What changes and why. -->

## Release

- [ ] Minor is the automatic default, including docs, tests and CI. To override it, added a described changeset with `npx changeset` choosing patch, minor or major.
- [ ] Explicit release notes explain what consumers see and what they must do (migration, opt-out). Start with `VISIBLE CHANGE:` or `BREAKING:` when it applies.
- [ ] Did not edit `package.json` `version` or `CHANGELOG.md` (the release workflow does).

## Verification

- [ ] `npm run check`, `npm test`, `npm run build`, `npm pack --dry-run`
- [ ] Consumer verification for visible changes (Funder, Portare, Investor)
