# Scttlnd UI

Shared design tokens and primitive components for multiple products and themes (Funder, Portare, Investor, Studio, Classic, Nuance). Each brand and product remains independent.

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
npm install @scttlnd/ui
```

At the app root import the shared styles. Studio is included by default:

```tsx
import "@scttlnd/ui/styles.css";
import { Button } from "@scttlnd/ui";
```

Studio panels are flat by default. Explicit Funder, Investor and Portare themes retain their soft glow and film grain (`data-fds-grain="off"` opts out); see [Foundation tokens](docs/TOKENS.md#grain-surfaces-default-opt-out).

Read [AGENTS.md](AGENTS.md) and [adoption guide](docs/ADOPTION.md) before integrating. Planned component roadmap: [component plan](docs/COMPONENT-PLAN.md). Original Funder palette is sourced from `nicklaslind/Funder/src/app/globals.css`. Portare's light theme is a proposed product-specific adaptation.

## Showcase

The component showcase (`npm run showcase:dev` locally, `npm run showcase:build` for a static build) in [`showcase/index.html`](showcase/index.html) is deployed to GitHub Pages by `.github/workflows/pages.yml` when its components, styles, dependencies, or showcase change on `main`: <https://scottlinddk.github.io/ui/>. One-time setup: repository **Settings → Pages → Source: GitHub Actions**.

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

Releases are automated by `.github/workflows/release.yml` (Changesets) on every push to `main`, using npm trusted publishing (OIDC). **Requires** the npm user/scope `@scttlnd` (npm username `scttlnd`; the GitHub owner `scottlinddk` is a different name), a one-time bootstrap publication because npm can only attach a Trusted Publisher to an existing package, and then a Trusted Publisher configured on npmjs.com for GitHub `scottlinddk/ui`, workflow filename `release.yml`. Releases default to a minor bump on ordinary pushes to `main`; an explicit patch/minor/major changeset overrides that default. Merging the generated version PR publishes without starting another bump. See the [release policy and staging recovery guide](.changeset/README.md).

## Studio theme

The package and showcase default to Studio: a Shadcn Studio-inspired foundation with forest-green depth, sage surfaces, restrained lime accents, and a spacious Vite+-inspired composition. Funder, Investor, and Portare retain their existing token values.

```tsx
import "@scttlnd/ui/styles.css";
```

No theme attribute or additional stylesheet is needed for Studio. The explicit `themes/studio.css` export and `data-fds-theme="studio"` remain supported for existing integrations and named subtrees. Studio uses flat panels. Add `data-fds-mode="dark"` to the app root (`<html>` for a full-page theme) for its dark palette; omit it or use `"light"` for light. Remove the mode attribute when switching to another product theme. All existing components and `--fds-*` token names work unchanged.

The Studio font stack prefers DM Sans. The showcase self-hosts its variable webfont under `showcase/assets/` with its SIL Open Font License. Consumers can load DM Sans themselves or override `--fds-font-sans` with their own brand font; the package does not load fonts or make network requests.

Try `?theme=studio&mode=dark` in the showcase. Its preview tabs support arrow keys, Home, and End; settings, saved views, component actions, and command copying are interactive browser-local examples.

Studio exposes `--fds-brand-*` tokens for the forest, sage, and lime classicrative fields in the showcase. Use `--fds-brand-foreground` and `--fds-brand-muted` on the forest/deep surfaces, and `--fds-brand-ink` on lime/sage surfaces. These accents complement the semantic `--fds-success`, `--fds-warn`, and `--fds-danger` tokens; they do not replace status meaning.

## Classic theme

Classic brings the "Running" editorial design system into the package: warm Dawn paper and ink (light) or Night warm dark brown (dark), a single ember action colour, and brick, olive and amber accents. Import it after the base stylesheet:

```tsx
import "@scttlnd/ui/styles.css";
import "@scttlnd/ui/themes/classic.css";
```

Light is the default. Add `data-fds-mode="dark"` to the root for Night. Panels are flat hairline cards. Running's ember (`#DC4A1E`) is only 3.9:1 with cream, so actions and links use the deeper `#A23010` (dark mode uses its lifted `#F77A50`); the original value remains as the decorative `--fds-brand-ember`. Running's muted grey and semantic colours were likewise darkened or lifted to meet AA, and its charts add a teal and a plum because it defines no blue. The theme also exposes `--fds-font-display` (Instrument Serif), `--fds-font-sans` (Geist) and `--fds-font-mono` (Geist Mono). The package does not load fonts: load them yourself or the stacks fall back to system serif and sans. Buttons and chips are pills in Running but remain the package's rounded rectangles here, because themes change tokens, not component shapes. Use `--fds-brand-foreground` / `--fds-brand-muted` on brick and night, and `--fds-brand-ink` on amber, ember-hover and cream. Contrast is tested in `src/classic-theme.test.ts`. Try `?theme=classic&mode=dark` in the showcase.

## Nuance theme

Nuance carries the "Solskin" (light) and "Aften" (dark) look of the [nuance](https://github.com/scottlinddk/nuance) family guide: a warm cream canvas, frosted cards, deep teal as the brand colour, coral and sun accents, Fraunces headings and generous radii (16px fields, 24px cards). Import it after the base stylesheet:

```tsx
import "@scttlnd/ui/styles.css";
import "@scttlnd/ui/themes/nuance.css";
```

Light is the default; add `data-fds-mode="dark"` to the root for Aften. Values come from nuance's `src/styles/index.css`, and its dark focus ring is the sun yellow. Like nuance, the accent is its ink "action": the primary button is a dark pill in Solskin and a cream pill in Aften, while teal stays the brand and focus colour (and chart 1). Besides tokens, the theme ships a few component rules, active wherever it is imported or inside `[data-fds-theme="nuance"]`: pill buttons and badges, and frosted, 32px-radius panels with a soft warm glow (`--fds-glass-shadow`). `--fds-brand-wash` is the rose and peach background glow and `--fds-brand-coral-gradient` the highlight card gradient; apply them to a page, hero or card yourself. The theme exposes `--fds-font-sans` (Figtree) and `--fds-font-display` (Fraunces); the package loads no fonts, so load them or the stacks fall back to system fonts (the showcase bundles both variable fonts under SIL OFL, as nuance does). `--fds-brand-*` teal, coral, sun and glow fields are decorative: use `--fds-brand-foreground` / `--fds-brand-muted` on teal, and `--fds-brand-ink` on coral, sun and cream. Contrast is tested in `src/nuance-theme.test.ts`. Try `?theme=nuance&mode=dark` in the showcase.

## Choosing a product theme

To keep the original Funder, Investor, or Portare appearance, import exactly one product theme after the base stylesheet:

```tsx
import "@scttlnd/ui/styles.css";
import "@scttlnd/ui/themes/funder.css"; // or investor.css / portare.css
```

These imports work with or without a matching `data-fds-theme` attribute. Set that attribute when selecting named subtrees; remove Studio's `data-fds-mode` when switching products. Existing product theme colors, typography, and panel treatments are preserved.

**Upgrading from the implicit dark default:** `styles.css` alone now selects Studio light. Add `themes/funder.css` to preserve the previous implicit appearance, or use `data-fds-mode="dark"` to adopt Studio dark. Consumers already importing a product theme require no changes. The default change takes effect in the next published npm release; the package does not change consumer dependency versions automatically.
