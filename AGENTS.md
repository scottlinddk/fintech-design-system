# Agent implementation contract

This repository is the **source of truth** for shared visual tokens and primitive components used by Funder, Portare and Investor. Read this file and README.md before UI changes.

1. Consume the published npm package. Do not copy components or token values into consumer repositories.
2. Import `@scottlinddk/fintech-design-system/styles.css` and exactly one theme CSS at the app root. Keep product-specific composition, navigation and domain components in the consuming app.
3. Prefer CSS variables `--fds-*` and exported primitives. Avoid hardcoded colors and duplicate primitives.
4. Funder is the reference for the dark palette. Portare light theme is a **proposed** accessibility-oriented adaptation, not a verified Funder style.
5. Preserve keyboard focus, semantic HTML, reduced motion, 44px touch targets where appropriate, WCAG contrast, mobile viewport/safe areas, and 16px mobile form control font sizes.
6. Changes to public exports/tokens require SemVer, a changeset (`npx changeset`; CHANGELOG.md is generated), and consumer verification. Never silently break an existing theme.
7. Never place financial arithmetic, API clients, user state, authentication, or business-specific charts in this package.
8. Run `npm install`, `npm run check`, `npm test`, `npm run build` before proposing a release; review npm tarball contents with `npm pack --dry-run`.
9. The package must be published to npm before consumer dependencies can resolve. Renovate updates versions only after publication.

Consumer integration: Portare and Investor should document this package in their AGENTS.md and renovate.json. Use one version per app, pin through package.json and lockfile, and review Renovate PRs with visual checks.
