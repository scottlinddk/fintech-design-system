## Summary

<!-- What changes and why. -->

## Release

- [ ] Shipped files changed (`src/`, `styles/`, exports or dependencies)? Added a changeset with `npx changeset` and chose the SemVer bump (tokens, themes and exports: at least minor).
- [ ] The changeset explains what consumers see and what they must do (migration, opt-out). Start with `VISIBLE CHANGE:` or `BREAKING:` when it applies.
- [ ] Docs, tests and CI only? No changeset needed.
- [ ] Did not edit `package.json` `version` or `CHANGELOG.md` (the release workflow does).

## Verification

- [ ] `npm run check`, `npm test`, `npm run build`, `npm pack --dry-run`
- [ ] Consumer verification for visible changes (Funder, Portare, Investor)
