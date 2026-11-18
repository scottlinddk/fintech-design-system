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

Panels have a soft glow and film grain by default (`data-fds-grain="off"` opts out); see [Foundation tokens](docs/TOKENS.md#grain-surfaces-default-opt-out).

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

Components render only `--fds-*` styled markup. Formatting, locale, currency and calculations stay in the consuming app (pass pre-formatted strings, or `formatValue`). The published modules for `Button`, `Menu`, `Field` (including its native controls), and `Panel` carry `"use client"`. The root barrel and static primitives such as `Badge` remain server-compatible. Event handlers, `Menu.items` callbacks and `Field.children` render functions still belong in a consumer client component because functions cannot cross the server/client boundary. See [Next.js verification](docs/verification/next-app-router.md).

## Cascade layer

Package styles and themes live in `@layer fds`. Normal unlayered consumer CSS overrides them regardless of specificity or import order. This changes cascade behaviour in Phase 0; review consumer resets and focus rules before upgrading. Layered apps can declare `@layer reset, fds, app;`. See [cascade migration notes](docs/CASCADE.md).

## npm publishing

Releases are automated by `.github/workflows/release.yml` (Changesets) on every push to `main`, using npm trusted publishing (OIDC). **Requires** the npm user/scope `@scttlnd` (npm username `scttlnd`; the GitHub owner `scottlinddk` is a different name), a one-time bootstrap publication because npm can only attach a Trusted Publisher to an existing package, and then a Trusted Publisher configured on npmjs.com for GitHub `scottlinddk/fintech-design-system`, workflow filename `release.yml`. Releases default to a minor bump on ordinary pushes to `main`; an explicit patch/minor/major changeset overrides that default. Merging the generated version PR publishes without starting another bump. See the [release policy and staging recovery guide](.changeset/README.md).

## Studio theme

The showcase defaults to the opt-in Studio theme: a Shadcn Studio-inspired foundation with forest-green depth, sage surfaces, restrained lime accents, and a spacious Vite+-inspired composition. Funder, Investor, and Portare retain their existing token values.

```tsx
import "@scttlnd/fintech-design-system/styles.css";
import "@scttlnd/fintech-design-system/themes/studio.css";
```

Set `data-fds-theme="studio"` on the app root (`<html>` for a full-page theme). Studio uses flat panels. Add `data-fds-mode="dark"` to the same element for its dark palette; omit it or use `"light"` for light. Remove the mode attribute when switching to another product theme. All existing components and `--fds-*` token names work unchanged.

The Studio font stack prefers DM Sans. The showcase self-hosts its variable webfont under `showcase/assets/` with its SIL Open Font License. Consumers can load DM Sans themselves or override `--fds-font-sans` with their own brand font; the package does not load fonts or make network requests.

Try `?theme=studio&mode=dark` in the showcase. Its preview tabs support arrow keys, Home, and End; settings, saved views, component actions, and command copying are interactive browser-local examples.

Studio exposes `--fds-brand-*` tokens for the forest, sage, and lime decorative fields in the showcase. Use `--fds-brand-foreground` and `--fds-brand-muted` on the forest/deep surfaces, and `--fds-brand-ink` on lime/sage surfaces. These accents complement the semantic `--fds-success`, `--fds-warn`, and `--fds-danger` tokens; they do not replace status meaning.
