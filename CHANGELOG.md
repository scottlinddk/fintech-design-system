# Changelog

## 0.3.0

### Minor Changes

- [#16](https://github.com/scottlinddk/fintech-design-system/pull/16) [`eba8f5f`](https://github.com/scottlinddk/fintech-design-system/commit/eba8f5f1694ca5ce54ca6e2601a1e551489f8f49) Thanks [@scottlinddk](https://github.com/scottlinddk)! - Build separate ESM component modules and declarations while preserving the flat named exports and existing CSS entry points. Add `"use client"` to Button, Field/native controls, Menu and Panel only; the root barrel and Badge remain server-compatible. Add packed-package Next.js App Router verification and a Badge-only bundle budget. Consumer callbacks and Field render functions still need a client component.

- [#19](https://github.com/scottlinddk/fintech-design-system/pull/19) [`272895b`](https://github.com/scottlinddk/fintech-design-system/commit/272895b4496919167a494b7782c166bcae82670e) Thanks [@scottlinddk](https://github.com/scottlinddk)! - Add grain surfaces, on by default: every `Panel` gets a hairline border, a soft two-colour glow and fine film grain, which changes its appearance in all themes. Opt out with `data-fds-grain="off"` on the element or any ancestor (for example `<html>`). Also adds explicit `fds-grain` modifiers (`--warm`, `--subtle`, `--hero`), saturated `--vivid` colour fields (`--teal`, `--green`, `--ember`) with an `fds-grain__stage` inset, flat `fds-cells` and an `fds-code` chip. Styles ship in `styles.css`; colours derive from the active theme and adapt to light and dark. Review consumers visually before upgrading.

- [#13](https://github.com/scottlinddk/fintech-design-system/pull/13) [`7ad509b`](https://github.com/scottlinddk/fintech-design-system/commit/7ad509be4333991ceb223fc5f74a83418bb743fc) Thanks [@scottlinddk](https://github.com/scottlinddk)! - VISIBLE CHANGE: Button minimum height is now 44px (touch target) in every theme.

  Add spacing, typography, control sizing, focus, elevation, overlay, layer, motion, on-status and chart tokens in every theme without changing existing token values. Use the new focus, motion and popover elevation tokens. Reduced motion sets duration tokens to zero. Portare remains a proposed light theme; automated checks cover text, focus/chart marks and solid danger/success contrast.

  The showcase consumes the new spacing and type tokens and preserves safe-area padding on mobile.

- [#17](https://github.com/scottlinddk/fintech-design-system/pull/17) [`dcb60cc`](https://github.com/scottlinddk/fintech-design-system/commit/dcb60cc3443392655d2dddd949a36599d61ab72b) Thanks [@scottlinddk](https://github.com/scottlinddk)! - CASCADE BEHAVIOUR CHANGE: wrap all package tokens, themes and component rules in the named `fds` CSS cascade layer. Normal unlayered consumer CSS now overrides package CSS even when it appears earlier or has lower specificity. Review consumer resets, token overrides and focus styles before upgrading. Existing selectors and token values are unchanged. Consumers using layers can declare their order, for example `@layer reset, fds, app;`.

  This is breaking for consumers; it ships as a minor only because the package is pre-1.0 (0.x minors may break). Requires browsers with CSS cascade layers (Chrome/Edge 99+, Firefox 97+, Safari 15.4+); older browsers ignore the whole stylesheet.

### Patch Changes

- [#24](https://github.com/scottlinddk/fintech-design-system/pull/24) [`549d42e`](https://github.com/scottlinddk/fintech-design-system/commit/549d42e2a23444f6ec9da35ce0aae50fa5a1bf85) Thanks [@scottlinddk](https://github.com/scottlinddk)! - Grain is now strictly background: inside grain surfaces (every `Panel` by default), badges, notices and the disabled states of buttons and form controls are opaque, so the grain no longer shows through them. Appearance on a flat panel (`data-fds-grain="off"`) is unchanged.

- [#15](https://github.com/scottlinddk/fintech-design-system/pull/15) [`00dfcdb`](https://github.com/scottlinddk/fintech-design-system/commit/00dfcdba38fde3a61c1e314b660a9864217792f8) Thanks [@scottlinddk](https://github.com/scottlinddk)! - Add DOM interaction and axe accessibility coverage for existing Button, Field and Menu, retaining static-markup tests. Add all-theme desktop and 375px mobile browser checks and visual snapshots. All new dependencies are development-only.

- [#14](https://github.com/scottlinddk/fintech-design-system/pull/14) [`1ab7287`](https://github.com/scottlinddk/fintech-design-system/commit/1ab7287f0745795beb56e8c3643963a9e52f55bb) Thanks [@scottlinddk](https://github.com/scottlinddk)! - Split component styles into individual styles/components/*.css files, preserving the public stylesheet imports and the exact declaration order and values. No visual or cascade change is intended.

## 0.2.0

### Minor Changes

- [#4](https://github.com/scottlinddk/fintech-design-system/pull/4) [`17feaaf`](https://github.com/scottlinddk/fintech-design-system/commit/17feaaf495ee16c1b90783e5fa1dde291493ae24) Thanks [@scottlinddk](https://github.com/scottlinddk)! - Add shared primitives extracted from Funder and Investor: `Panel`, `Metric`, `KeyValue`, `Badge`, `Notice`, `EmptyState`, `Field`, `Input`, `Select`, `Textarea`, `Meter`, `SegmentedMeter`, `DistributionList` and `Menu`. Add `--fds-radius-lg` and `--fds-radius-sm` tokens, and light-theme overrides (`success`, `warn`, `danger`, `muted-strong`, `line-soft`, `panel-soft`) in the Portare theme so tones keep WCAG contrast.

## 0.1.0 (unreleased)

- Lock npm dependencies, use reproducible CI and publish installs, and align package exports with build output.

- Initial Funder-derived tokens, three brand themes, accessible Button primitive and Vite+ npm publishing setup.
