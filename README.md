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
npm install @scottlinddk/fintech-design-system
```

At the app root import base styles then exactly one theme:

```tsx
import "@scottlinddk/fintech-design-system/styles.css";
import "@scottlinddk/fintech-design-system/themes/investor.css"; // or portare.css / funder.css
import { Button } from "@scottlinddk/fintech-design-system";
```

Read [AGENTS.md](AGENTS.md) and [adoption guide](docs/ADOPTION.md) before integrating. Original Funder palette is sourced from `nicklaslind/Funder/src/app/globals.css`. Portare's light theme is a proposed product-specific adaptation.

## npm publishing

A matching `vX.Y.Z` tag triggers `.github/workflows/publish.yml`, using npm trusted publishing OIDC and provenance. **Requires** npm ownership of `@scottlinddk`, a first bootstrap publication if the package does not yet exist, and an npm Trusted Publisher configured for GitHub `scottlinddk/fintech-design-system`, workflow filename `publish.yml`. The workflow is configured but no package has been published.
