# Changelog

## 0.6.0

### Minor Changes

- [#30](https://github.com/scottlinddk/ui/pull/30) [`bfe7665`](https://github.com/scottlinddk/ui/commit/bfe7665b3ce9ae30b627cf7a1639523da252e925) Thanks [@scottlinddk](https://github.com/scottlinddk)! - VISIBLE CHANGE: add an opt-in Classic theme, `@scttlnd/ui/themes/classic.css`, derived from the Running editorial design system. It has warm Dawn (light) and Night (`data-fds-mode="dark"`) palettes, an ember accent, brick/olive/amber `--fds-brand-*` fields and Geist / Instrument Serif font stacks. Existing themes and the Studio default are unchanged; import classic.css after styles.css to adopt it.

- [#32](https://github.com/scottlinddk/ui/pull/32) [`95b3892`](https://github.com/scottlinddk/ui/commit/95b3892960084b613559acef5aee100d48e99d87) Thanks [@scottlinddk](https://github.com/scottlinddk)! - VISIBLE CHANGE: add an opt-in Nuance theme, `@scttlnd/ui/themes/nuance.css`, based on the nuance app's Solskin (light) and Aften (`data-fds-mode="dark"`) palettes: cream canvas, teal accent, coral and sun `--fds-brand-*` fields, rounded radii and Figtree / Fraunces font stacks. Existing themes and the Studio default are unchanged; import nuance.css after styles.css to adopt it.

- [#33](https://github.com/scottlinddk/ui/pull/33) [`bc1233c`](https://github.com/scottlinddk/ui/commit/bc1233c87c46ea41d8f990c634d85acbc943f44e) Thanks [@scottlinddk](https://github.com/scottlinddk)! - BREAKING: the package is renamed from `@scttlnd/fintech-design-system` to `@scttlnd/ui` because it now serves multiple products and themes in any domain. Exports, `--fds-*` tokens, `data-fds-*` attributes and theme files are unchanged. Migrate by replacing the dependency name in package.json and every `@scttlnd/fintech-design-system` import path (including `/styles.css` and `/themes/*.css`) with `@scttlnd/ui`; the old package is deprecated and receives no further releases.

## 0.5.0

### Minor Changes

- [#27](https://github.com/scottlinddk/fintech-design-system/pull/27) [`a267e98`](https://github.com/scottlinddk/fintech-design-system/commit/a267e98b5c4f0082909232ba538a9a5b21089127) Thanks [@scottlinddk](https://github.com/scottlinddk)! - VISIBLE CHANGE: Add an opt-in Studio theme with forest, sage, and restrained lime accents, light and dark modes, flat panels, and semantic status colors. Redesign the showcase with a spacious, bordered layout, live component examples, theme switching, and token inspection. Existing Funder, Investor, and Portare theme values are unchanged. Import `themes/studio.css` and set `data-fds-theme="studio"` on the root to adopt it; add `data-fds-mode="dark"` for dark mode.

- [#29](https://github.com/scottlinddk/fintech-design-system/pull/29) [`e4b6fd0`](https://github.com/scottlinddk/fintech-design-system/commit/e4b6fd0bd8ffb50987abfa875a01dba67a0a7d7d) Thanks [@scottlinddk](https://github.com/scottlinddk)! - VISIBLE CHANGE: Make Studio the default when consumers import styles.css, including flat panels and light/dark mode without an extra stylesheet or theme attribute. Preserve explicit Funder, Investor and Portare imports, including the dark values previously inherited from the base palette. Consumers previously relying on styles.css alone can add themes/funder.css after it to keep the former implicit dark appearance. Existing product-theme consumers need no changes.

## 0.4.0

### Minor Changes

- Release the changes merged into main with the default minor version bump. Review [the source commit](https://github.com/scottlinddk/fintech-design-system/commit/f5f28444c73fceb422d16b4df730dc64aa0f4d4d) and verify affected consumers before upgrading.

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
