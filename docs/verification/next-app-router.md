# Per-entry build and App Router verification

`vp pack` now builds separate ESM component modules and declarations using multiple entries and tsdown's unbundle mode. The public barrel still exports the same flat named API and the published `.mjs` / `.d.mts` paths remain compatible. A banner marks only Button, Field (including Input/Select/Textarea), Menu and Panel as client modules. Panel and Field need the boundary because they use hooks, even when their content looks static. Badge, Metric, Meter, Notice and the barrel remain unmarked.

Consumers can import static primitives from a server component. Functions still cannot cross a server/client boundary: put Field's render function, Menu callbacks and event handlers in a consumer client component. This is not removed by adding library directives.

## Reproduce

```sh
npm install
npm run check
npm test
npm run build
npm run test:package
npm pack --dry-run
npm run smoke:next
npx playwright install chromium
npm run smoke:next:browser
```

`smoke:next` packs the actual library and installs that tarball into `smoke/next-app`; it does not use a source alias or `transpilePackages`. The fixture has its own lockfile and dev/test-only installation, and is excluded from the published tarball. The version is read from npm pack output, so the command works after a release version changes.

## Observed locally, 2026-11-08

- Node 24.16.0, macOS arm64; Next.js 16.4.5 / React 19.3.1, production Webpack build: passed, with `/` prerendered.
- A server page imports Badge from the package root and invokes it on the server. This would fail if Badge became a client reference. The client-reference manifest includes Button, Field, Menu and Panel and excludes Badge.
- Chromium against `next start`: server Badge and directly imported Button/Panel render; Button and Menu callbacks hydrate and update status text; Field accepts typing; Menu selection returns focus. No page/console errors or hydration errors. Screenshot: local `artifacts/next/app-router.png` (CI uploads the same evidence).
- Built output assertions: correct first-statement client directives, server-safe barrel, declarations and all existing export targets present, tests absent from dist: passed.
- Badge-only bundle: 259 bytes gzip against a 600-byte budget, React external. No Button/Field/Menu code or state/effect hooks in that bundle.
- `npm pack --dry-run`: 49 files, including split module declarations/maps and every CSS import target; excludes showcase, tests, smoke app and Next dependencies.

Not verified: production deployment, Turbopack, other Next versions, React 18 App Router, real consumer application screens, VoiceOver or actual mobile browsers. The fixture proves a local package boundary and hydration flow, not complete consumer compatibility. Linux CI repeats the build and browser smoke; check the PR checks for its result.

Implementation references: [tsdown unbundle mode](https://tsdown.dev/options/unbundle) and [Next.js client directives and serializable props](https://nextjs.org/docs/app/api-reference/directives/use-client).
