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
