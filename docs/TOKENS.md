# Foundation tokens

Import `styles.css` and exactly one theme stylesheet at the app root. Put `data-fds-theme` on `<html>` when selecting a named theme. Subtree themes do not automatically follow content portalled to `document.body`; future portal primitives must expose a `container` prop.

All three themes explicitly define the Phase 0 foundation tokens. Funder and Investor retain the existing dark palette. New elevation, typography, motion and chart choices are proposed foundations, not values verified against the upstream Funder app. Portare remains a proposed light adaptation.

- `space-1` through `space-8`: 4px through 32px, including 28px.
- `text-xs/sm/base/lg/xl/2xl`: 0.75/0.875/1/1.125/1.25/1.5rem. `leading-tight/normal/relaxed`: 1.25/1.5/1.75. `font-mono` and `numeric` support display figures without formatting them.
- `control-h` / `control-h-sm`: 44px on touch and small screens; 36px / 32px with a fine pointer at 640px or wider. Keep form text at 16px on mobile. Buttons now use `control-h`, correcting their previous 40px touch target.
- `focus-ring`: ring colour (use a 2px solid outline and 2px offset). `shadow-popover`, `shadow-dialog`, `overlay`: elevations and scrim.
- `z-sticky/dropdown/overlay/modal/toast/tooltip`: 20/30/40/50/60/70.
- `duration-fast/base`: 150/200ms, both 0s under reduced motion. `ease-out`: easing curve.
- `on-danger`, `on-success`: text on the corresponding solid semantic background. Use these instead of foreground or on-accent for solid status fills.
- `chart-1` through `chart-6`, `chart-grid`, `chart-positive/negative`: recipe colours only. Supply labels, signs, patterns or shapes as well as colour. No chart library or financial calculation is included.

`src/tokens.test.ts` checks all pre-existing declarations are unchanged, every new token exists in each theme, text on solid success/danger meets 4.5:1, Portare text on all four surfaces meets 4.5:1, and Portare focus/chart marks meet 3:1. This does not certify complete consumer screens or the existing low-contrast decorative border tokens.

## Grain surfaces (default, opt-out)

Every `Panel` (`.fds-panel`) has a hairline border, a soft two-colour glow and fine film grain by default. This ships in `styles.css`; there is no separate import.

Opt out with `data-fds-grain="off"` on the element or on any ancestor, including `<html>` for a whole app. The panel then renders exactly as before.

```tsx
<Panel title="Portfolio value">…</Panel>                     {/* grain */}
<Panel data-fds-grain="off" title="Flat">…</Panel>           {/* flat */}
<html data-fds-grain="off">…</html>                          {/* every panel flat */}
```

Explicit classes add stronger treatments on any element:

- `fds-grain` on non-panel elements; modifiers `--warm` (warn to danger glow), `--subtle` (quieter), `--hero` (large padding and radius).
- Vivid: `fds-grain fds-grain--vivid` (plus `--teal`, `--green`, `--ember`) is a saturated colour field with light streaks and strong grain for hero bands and feature panels. Put all text on an `fds-grain__stage` (a near-black inset, same in every theme) so contrast never depends on the gradient. Tokens: `--fds-vivid-{indigo,teal,green,ember}-{1,2}`, `--fds-stage-{bg,fg,muted,line}`.
- `fds-cells` (flat 1px-divided cells instead of shadowed cards) and `fds-code` (inline mono chip).
- Tokens: `--fds-glow-a`, `--fds-glow-b`, `--fds-glow-warm-a`, `--fds-glow-warm-b`, `--fds-glow-l`/`--fds-glow-d`, `--fds-grain-l`/`--fds-grain-d` (light/dark share and alpha), `--fds-grain-size`, `--fds-grain-image`. Glow A follows the theme accent; colours switch with `color-scheme` through `light-dark()` (colours only; numeric light/dark pairs are separate `-l`/`-d` tokens). Rules are wrapped in `@supports (color: light-dark(…))`; browsers without it show the plain panel.
- The decoration is removed under `forced-colors` and in print, and the grain layer is `pointer-events: none` and sits below content.
- `/grain.html` in the showcase shows every variant and the opt-out in all three themes. `npm run test:browser` runs axe on it and asserts the opt-out.

**Upgrading:** this changes the appearance of every `Panel`. Review each app visually (Portare is the accessibility-oriented light theme) or set `data-fds-grain="off"` on the root first and adopt per area.
