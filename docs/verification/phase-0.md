# Phase 0 delivery and release gates

Implemented in six ordered, stacked PRs based on main `e316658`:

| Order | PR | Concern | Changeset |
| --- | --- | --- | --- |
| 1 | [#12](https://github.com/scottlinddk/fintech-design-system/pull/12) | Real-component showcase and Pages build; retire obsolete tokens | None (unshipped showcase) |
| 2 | [#13](https://github.com/scottlinddk/fintech-design-system/pull/13) | 45 foundation tokens in all themes; contrast and legacy-value checks | Minor |
| 3 | [#14](https://github.com/scottlinddk/fintech-design-system/pull/14) | Component CSS split, same declaration order and visuals | Patch |
| 4 | [#15](https://github.com/scottlinddk/fintech-design-system/pull/15) | DOM interaction/axe tests, browser checks and visual snapshots | Patch |
| 5 | [#16](https://github.com/scottlinddk/fintech-design-system/pull/16) | Per-entry build/client boundaries, size budget, packed Next smoke | Minor |
| 6 | [#17](https://github.com/scottlinddk/fintech-design-system/pull/17) | `@layer fds` and explicit consumer cascade migration note | Minor, behaviour change |

Merge in order. Each PR targets its predecessor so review shows one concern; retarget remaining PRs as their bases merge and preserve the dependency commits if squash-merging. No PR is merged or npm release published as part of this implementation. Changesets aggregates these into the planned 0.3.0 minor; package.json stays 0.2.0 until the version PR.

## Passed locally

Every PR passed `npm install`, `npm run check`, `npm test`, and `npm run build`. Tarball dry runs passed on every branch (including build/export changes). The sandbox blocks the default npm cache for pack operations; local pack commands used `npm_config_cache=/tmp/fds-npm-cache` without modifying the user's cache.

Final cumulative verification:

- 33 unit/static/interaction/token/CSS tests; original static-markup tests retained.
- Portare light text contrast ≥4.5:1 across background/panel/raised/soft surfaces; focus/chart marks ≥3:1. Solid danger/success text ≥4.5:1 for all three themes. All legacy token declarations unchanged.
- CSS split: 12 before/after PNGs byte-identical, covering three themes × desktop/375px × open/closed menu. See [CSS split evidence](css-split.md).
- 8 Chromium browser scenarios: all three themes on desktop/mobile plus consumer layer overrides at both widths. Axe, keyboard/focus return, reduced motion, touch sizes, form fonts, no overflow/errors, and 12 pre-layer snapshot comparisons passed. Mac CI text/native-control rendering tolerance is documented in [testing](../TESTING.md).
- TypeScript no-emit check passed. Module/declaration/export checks passed. Badge-only bundle 259 bytes gzip against 600-byte budget, React external, no interactive modules.
- Packed tarball: 49 files, including module declarations/maps and every stylesheet import target; excludes test/showcase/smoke dependencies and source tests.
- Packed Next.js 16.4.5 / React 19.3.1 production Webpack build and Chromium hydration flow passed, including server-only Badge invocation and client manifest checks. See [App Router evidence and limits](next-app-router.md).
- Funder's existing palette was compared with upstream [globals.css](https://github.com/nicklaslind/Funder/blob/main/src/app/globals.css), blob `e3c5d2c7612de2419504923f69bc2d4e37358d4c`. It contains no counterparts for the new foundation token groups; their values remain proposed additions. No existing theme value was changed.

## Still requires verification before release

No visual check was run inside the actual Funder, Investor or Portare application. This remains the AGENTS.md rule 6 / plan §6 consumer release gate, particularly for the cascade change. No production deployment, Turbopack, other Next versions, React 18 App Router, real mobile devices or screen-reader tests were run. Portare remains a proposed light adaptation. The documented npm bootstrap/Trusted Publisher setup is still required before consumers can install the package from npm.

## Plan §8 questions and the next phase

1. **Consumer priorities:** still open. Choose which P1 components Portare and Investor need first; this affects order, not the technical ability to begin P1 after Phase 0 merges.
2. **Cascade layer acceptance:** answered by the explicit instruction to implement D6 last. The separate minor changeset and migration note make the change reviewable; real consumer visual checks remain a release gate.
3. **React 18 peer support:** still open for Phase 3. This implementation retains the existing peer range and tests primitives on React 18, plus the smoke fixture on React 19. It does not block Phase 1.
4. **Docs site:** still open for the later 40+ component set. The real-component static showcase is retained; this does not block Phase 1.

There is no unresolved §8 technical blocker to Phase 1 once this stack merges. No Phase 1 primitives, Base UI dependency, financial arithmetic or formatting were added.
