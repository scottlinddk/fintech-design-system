# Fintech Design System

Shared Funder-derived design foundations for Portare, Investor and Funder. Each brand and product remains independent.

## Develop with Vite+

```sh
npm ci
npm run check
npm test
npm run build
npm pack --dry-run
```

The project-local `vite-plus` package provides `vp pack`, `vp check` and `vp test`. Global `vp` is optional.

## Use in frontend (after npm release)

```sh
npm install @scttlnd/fintech-design-system
```

At the app root import base styles then exactly one theme:

```tsx
import "@scttlnd/fintech-design-system/styles.css";
import "@scttlnd/fintech-design-system/themes/investor.css"; // or portare.css / funder.css
import { Button } from "@scttlnd/fintech-design-system";
```

Read [AGENTS.md](AGENTS.md) and [adoption guide](docs/ADOPTION.md) before integrating. Planned component roadmap: [component plan](docs/COMPONENT-PLAN.md). Original Funder palette is sourced from `nicklaslind/Funder/src/app/globals.css`. Portare's light theme is a proposed product-specific adaptation.

## Showcase

The component showcase (`npm run showcase:dev` locally, `npm run showcase:build` for a static build) in [`showcase/index.html`](showcase/index.html) is deployed to GitHub Pages by `.github/workflows/pages.yml` when its components, styles, dependencies, or showcase change on `main`: <https://scottlinddk.github.io/fintech-design-system/>. One-time setup: repository **Settings → Pages → Source: GitHub Actions**.

## Components

| Component                                     | Purpose                                                                 | Origin                                                           |
| --------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `Button`                                      | Primary / secondary / ghost actions                                     | Shared                                                           |
| `Panel`                                       | Titled surface with eyebrow, help text and action; labelled `<section>` | Funder `Panel`, Investor `.panel`                                |
| `Metric`, `KeyValue`                          | Label/value tiles for **pre-formatted** figures                         | Funder `Metric` / `KeyValue`, Investor `.metrics`                |
| `Badge`                                       | Status chip (`neutral`, `accent`, `success`, `warn`, `danger`)          | Funder `Pill`, Investor `.status-badge`                          |
| `Notice`, `EmptyState`                        | Inline messages (`danger` = `role="alert"`) and empty placeholders      | Investor `.notice`, `.empty-state`                               |
| `Field`, `Input`, `Select`, `Textarea`        | Label/hint/error wiring with 44px touch targets and 16px mobile font    | Investor `.form-grid`/`.field-hint`, Funder form sizing standard |
| `Meter`, `SegmentedMeter`, `DistributionList` | Bounded bars, discrete scale, ranked share bars (`role="meter"`)        | Funder `EvidenceBar`, `RiskBars`, `ExposureList`                 |
| `Menu`                                        | Action menu with Escape/arrow-key support and focus return              | Funder `Menu`                                                    |

Components render only `--fds-*` styled markup. Formatting, locale, currency and calculations stay in the consuming app (pass pre-formatted strings, or `formatValue`). `Menu`, `Field` and `Panel` use React hooks: in Next.js import them from a file marked `"use client"`.

## npm publishing

Releases are automated by `.github/workflows/release.yml` (Changesets) on every push to `main`, using npm trusted publishing (OIDC). **Requires** the npm user/scope `@scttlnd` (npm username `scttlnd`; the GitHub owner `scottlinddk` is a different name), a one-time bootstrap publication because npm can only attach a Trusted Publisher to an existing package, and then a Trusted Publisher configured on npmjs.com for GitHub `scottlinddk/fintech-design-system`, workflow filename `release.yml`. No package has been published yet.
