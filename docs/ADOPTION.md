# Adoption and releases

## For AI coding agents
1. Read this repo's AGENTS.md and package exports before changing consumer UI.
2. Add the package as an ordinary npm dependency to the consuming **frontend workspace**, not the C# API.
3. Import base styles then the product theme once at the root. Migrate one component at a time, preserving screenshots, accessibility and existing user flows.
4. Avoid making the product theme a copy of Funder's brand. Shared tokens are a baseline; branding remains independent.
5. Do not use GitHub URL dependencies or workspace links in consumer package.json. Renovate needs a published semver package.
6. Ensure a lockfile is committed. Renovate's npm manager discovers package.json dependencies; packageRules group the shared package updates.
7. Run unit, typecheck, build, accessibility and visual regression tests before accepting an automated update.

## Release
- Update package version, CHANGELOG and tests in one reviewed PR.
- Publish only from a matching `vX.Y.Z` tag after merging.
- Configure npm trusted publisher: owner `scottlinddk`, repo `fintech-design-system`, workflow `publish.yml` and allow direct publish.
- First publish needs the scope/package to exist on npm and ownership to be verified; never put a long-lived npm token in git.
- Renovate can only discover releases visible on npm. Consumer Renovate GitHub app must be installed and enabled separately.

## Funder reference
Source of extracted values: `nicklaslind/Funder/src/app/globals.css`. The base tokens match its dark palette. Shared CSS intentionally does not override consumer `body` or global resets, to prevent disruptive integration.
