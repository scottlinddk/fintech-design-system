# Plan: shadcn/ui component coverage

Status: proposal, 2026-11-08. Nothing here is implemented yet.
Source: <https://ui.shadcn.com/docs/components> (66 components, read 2026-11-08). shadcn now ships each component in a **Base UI** flavour (default, `/docs/components/base/*`) and a **React Aria** flavour (`/docs/components/aria/*`).

## 1. Summary

- Port shadcn's **component set and API shape**, not its implementation. shadcn is copy-paste + Tailwind; this package is a published npm library with plain CSS and `--fds-*` tokens (AGENTS.md rules 1–3). We keep that.
- Use **`@base-ui/react`** (1.9.0 on npm, 2026-11-08) for behaviour in anything with focus management, portals or positioning. It is unstyled, and it is what shadcn's default flavour uses, so shadcn's docs and examples stay a valid reference.
- Of the 66 components: **12 already exist** in some form, **38 are planned** across 5 phases, **16 are out of scope or deferred** (chat/AI pieces, app-shell pieces, and things AGENTS.md rule 7 forbids).
- Phase 0 (tokens, test setup, showcase) must land first. Without it every later component adds hardcoded values.

## 2. Decisions needed before work starts

| # | Decision | Recommendation | Why |
| - | -------- | -------------- | --- |
| D1 | Headless library | `@base-ui/react` as a regular `dependency` (`^1.9.0`) | Matches shadcn's default flavour. One package, tree-shakeable, maintained. React Aria is stronger on i18n/date handling but larger and its API is further from shadcn. Hand-rolling (like today's `Menu`) does not scale to Dialog/Combobox/Select. |
| D2 | Tailwind | Do not adopt | Consumers would need a Tailwind build matching ours. Plain CSS + tokens works in Funder (Next.js), Portare and Investor without config. |
| D3 | Export style | Flat named exports with shadcn names (`Dialog`, `DialogTrigger`, `DialogContent`, …) | Familiar to anyone who knows shadcn, and tree-shakes cleanly. |
| D4 | Composition | Base UI `render` prop (not Radix `asChild`) | It is what Base UI and shadcn's base flavour use. |
| D5 | `"use client"` | Add the directive to the built output of every interactive component | Today README asks Next.js consumers to wrap imports themselves. That stops scaling at ~40 components. Needs a per-file build (see §4.6). |
| D6 | CSS cascade layer | Wrap package CSS in `@layer fds` | Lets consumer styles win without specificity fights. **Behaviour change** for existing consumers: unlayered consumer CSS will start overriding package CSS. Ship in its own minor with a changeset note. |
| D7 | Charts | Tokens + styling recipe only, no `Chart` component | AGENTS.md rule 7 bans business-specific charts here. Shipping a recharts wrapper would also force a heavy dependency on all three apps. |
| D8 | Data Table | `Table` primitives + documented TanStack Table recipe, no `DataTable` component | Sorting/filtering/pagination state is app logic. Each app already owns its TanStack Query layer. |

## 3. Component triage (all 66)

Legend: **Exists** = shipped today, extend to shadcn parity. **P1–P5** = phase. **Out** = not planned, reason given.

| shadcn component | Status | FDS name / note |
| ---------------- | ------ | --------------- |
| Accordion | P4 | `Accordion*` (Base UI). FAQ, fee breakdowns. |
| Alert | Exists | `Notice`. Add `title` slot and optional icon. Keep `danger` = `role="alert"`. |
| Alert Dialog | P3 | `AlertDialog*`. Priority: confirming transfers, deletions, irreversible actions. |
| Aspect Ratio | Out | CSS `aspect-ratio` is enough. |
| Attachment | Out | Chat/AI building block. |
| Avatar | P1 | `Avatar` with initials fallback. |
| Badge | Exists | `Badge`. Already has tones. Add `outline` variant only if a product asks. |
| Breadcrumb | P1 | `Breadcrumb*`. Semantic `nav` + `aria-current`. |
| Bubble | Out | Chat. |
| Button | Exists | `Button`. Add `danger` variant, `size` (`sm`/`md`/`icon`), `loading` (with `aria-busy`, keeps width), `render` prop. |
| Button Group | P1 | `ButtonGroup`. CSS-only grouping with `role="group"`. |
| Calendar | P5 | `Calendar` on `react-day-picker` 10. See §5. |
| Card | Exists | `Panel` covers it. Add `PanelFooter` slot rather than a second `Card` component. |
| Carousel | Out | Low value for financial data; poor accessibility record. |
| Chart | P5 (tokens only) | `--fds-chart-*` tokens + CSS recipe. See D7. |
| Checkbox | P2 | `Checkbox`, `CheckboxGroup` (Base UI). 44px hit area. |
| Code Block | Out | Developer docs, not product UI. |
| Collapsible | P4 | `Collapsible*` (Base UI). |
| Combobox | P2 | `Combobox*` (Base UI). Account/ISIN/counterparty pickers. |
| Command | Out (defer) | Command palette is app-shell. Revisit if two apps want one. |
| Context Menu | P3 | `ContextMenu*`. Low priority: right-click is invisible on touch. Always pair with a visible menu. |
| Data Table | P5 (recipe) | See D8. |
| Date Picker | P5 | `DatePicker` = `Popover` + `Calendar` + typed input fallback. |
| Dialog | P3 | `Dialog*`. |
| Direction | Out | Danish/English are LTR. Use logical CSS properties anyway so RTL stays cheap. |
| Drawer | P3 | `Drawer*` (Base UI drawer if available at implementation time, else `Sheet` with bottom side). Mobile action sheets. Verify Base UI support before starting. |
| Dropdown Menu | Exists | `Menu` today (hand-rolled, items array). Add `DropdownMenu*` on Base UI; reimplement `Menu` as a thin wrapper so its API does not break. |
| Empty | Exists | `EmptyState`. Add media/action slots. |
| Field | Exists | `Field`. Add `FieldSet`/`FieldLegend` for grouped radios/checkboxes. |
| Hover Card | P3 | `HoverCard*`. Never the only way to reach info (no hover on touch). |
| Input | Exists | `Input`. |
| Input Group | P1 | `InputGroup`, `InputGroupAddon`. Currency suffix (`DKK`), `%`. Display only: no parsing or formatting in the package. |
| Input OTP | P2 | `InputOTP`. 2FA / MitID-adjacent flows. `autocomplete="one-time-code"`, `inputmode="numeric"`. Hand-roll on one real `<input>` or use `input-otp`; decide in PR. |
| Item | P1 | `Item*`. List rows (account, holding, transaction) with media/title/description/actions. |
| Kbd | P1 | `Kbd`. |
| Label | Exists | Part of `Field`. Export a standalone `Label` for controls outside `Field`. |
| Marker | Out | Chat. |
| Menubar | Out | Desktop-app pattern; not used in these products. |
| Message | Out | Chat. |
| Message Scroller | Out | Chat. |
| Native Select | Exists | `Select` today. Keep it native; it is the best mobile picker. |
| Navigation Menu | Out | AGENTS.md: navigation stays in the consuming app. |
| Pagination | P1 | `Pagination*`. Presentational; page state stays in the app. |
| Popover | P3 | `Popover*`. Foundation for Date Picker and filters. |
| Progress | Exists | `Meter` is for values; add `Progress` for task progress (`role="progressbar"`). They are different ARIA roles, keep both. |
| Questionnaire | Out (defer) | Could fit onboarding/suitability (MiFID) flows, but those are product-specific. Revisit after Field/RadioGroup land. |
| Radio Group | P2 | `RadioGroup`, `Radio` (Base UI). Includes a "card" variant for plan/product choice. |
| Resizable | Out | No current need. |
| Scroll Area | P4 | `ScrollArea`. Use only for contained regions (tables); never the page. |
| Select | P2 | `SelectMenu*` (Base UI custom select). Name differs to avoid clashing with today's native `Select`. Use native by default. |
| Separator | P1 | `Separator`. |
| Sheet | P3 | `Sheet*` (Base UI Dialog with side placement). Safe-area padding. |
| Sidebar | Out | App shell / navigation (AGENTS.md). |
| Skeleton | P1 | `Skeleton`. Width hints so figures do not shift on load. Respects reduced motion. |
| Slider | P2 | `Slider` (Base UI). `aria-valuetext` takes a pre-formatted string from the app. |
| Spinner | P1 | `Spinner`. `role="status"` with visually hidden label. |
| Switch | P2 | `Switch` (Base UI). Settings only; not for actions that move money. |
| Table | P1 | `Table*`. Highest-value P1 item. See §5. |
| Tabs | P4 | `Tabs*` (Base UI). |
| Textarea | Exists | `Textarea`. |
| Toast | P3 | `Toast*` (Base UI Toast). See §5. |
| Toggle | P2 | `Toggle` (Base UI). |
| Toggle Group | P2 | `ToggleGroup` (Base UI). Period pickers (1D/1M/1Y). |
| Tooltip | P3 | `Tooltip*`. Supplementary only; must work on keyboard focus. |
| Trace | Out | Chat/AI. |
| Typography | P1 (CSS) | Type scale tokens + `.fds-prose` utility. No components. |

Also out: all 21 "AI Elements" (separate shadcn section, not core components).

Count: 12 Exists + 38 planned (P1–P5) + 16 Out = 66.

## 4. Phase 0: groundwork (blocks everything else)

### 4.1 Token gaps

`styles/tokens.css` has colours and three radii only. New components need:

| Group | Tokens | Used by |
| ----- | ------ | ------- |
| Space | `--fds-space-1…8` (4px scale) | Everything. Today spacing is hardcoded rem in `components.css`. |
| Type | `--fds-text-xs…2xl`, `--fds-leading-*`, `--fds-font-mono`, `--fds-numeric: tabular-nums` | Table, Metric, Typography |
| Size | `--fds-control-h` (44px touch / 36px fine pointer), `--fds-control-h-sm` | Button, Input, Select, Toggle |
| Focus | `--fds-focus-ring` (today reuses `--fds-accent`) | All interactive |
| Elevation | `--fds-shadow-popover`, `--fds-shadow-dialog` | Popover, Menu, Dialog |
| Overlay | `--fds-overlay` (scrim colour) | Dialog, Sheet, Drawer |
| Layer | `--fds-z-dropdown`, `-sticky`, `-overlay`, `-modal`, `-toast`, `-tooltip` | All floating UI |
| Motion | `--fds-duration-fast/base`, `--fds-ease-out` | All transitions (0 under reduced motion) |
| On-colour | `--fds-on-danger`, `--fds-on-success` | Danger button, solid badges |
| Chart | `--fds-chart-1…6`, `--fds-chart-grid`, `--fds-chart-positive/negative` | Chart recipe |

Every new token needs a value in all three themes, and Portare's light values need a contrast check (AGENTS.md rule 4: Portare is proposed, not verified).

### 4.2 Clean-up found during review

- **Two token files.** `src/tokens.css` (unprefixed `--surface-*`, `--space-*`) is not shipped and not imported by `styles/index.css`, but `showcase/index.html` and `pages.yml` use it. So the public showcase does not show the published package. Fix: showcase imports `styles/index.css` + a theme and renders the real components; retire or merge `src/tokens.css` (its space scale is a good starting point for §4.1).
- `components.css` is one 367-line file. Split into `styles/components/<name>.css` imported by `styles/components.css`, so each component PR touches its own file.

### 4.3 Testing

Current tests use `renderToStaticMarkup` only, which cannot test focus, keyboard or open/close. Add:

1. `happy-dom` (or `jsdom`) + `@testing-library/react` + `user-event` for interaction tests.
2. `vitest-axe` (axe-core) assertion per component.
3. Playwright visual snapshots of the showcase in all three themes, desktop + 375px mobile. Chromium is already available in CI images.

### 4.4 Conventions (every component PR)

- File: `src/components/<Name>.tsx`, CSS `styles/components/<name>.css`, class prefix `fds-<name>`, BEM elements (`fds-dialog__popup`).
- Style state through Base UI data attributes (`[data-open]`, `[data-disabled]`, `[data-highlighted]`), not extra classes.
- Only `--fds-*` tokens. No hex values in component CSS.
- Forward `className` and `ref` (React 19 ref-as-prop; React 18 still in peer range, so use `forwardRef` until 18 is dropped).
- Logical properties (`margin-inline`, `inset-inline-start`).
- No formatting, locale, currency or arithmetic (AGENTS.md rule 7). Props take pre-formatted strings.
- Each PR: tests (static + interaction + axe), showcase section, README table row, changeset.

### 4.5 Portals and themes

Base UI portals into `document.body`. Themes are applied on `:root` or `[data-fds-theme]`. If an app scopes the theme to a subtree, portalled popups lose its tokens. Document "set the theme on `<html>`", and expose the Base UI `container` prop on every `*Portal`.

### 4.6 Build

`vp pack` bundles one entry. To add `"use client"` (D5) only where needed, build with multiple entries (one per component, `preserveModules`-style) and add the banner per file. Verify with `npm pack --dry-run` and a Next.js App Router smoke test that a server component can import `Badge` without the client boundary.

## 5. Fintech-specific requirements

These go beyond shadcn's defaults and are why we do not take its CSS as-is.

- **Table**: `font-variant-numeric: tabular-nums`; `align="numeric"` column prop that right-aligns; optional sticky header and first column; `density` (`comfortable`/`compact`); caption required (visually hidden allowed); horizontal scroll inside the table wrapper, never the page; positive/negative use text + sign, not colour alone.
- **Alert Dialog**: destructive confirm button never gets initial focus; optional "type to confirm" slot; title states the consequence ("Transfer 10.000 kr. to …?") using app-supplied text.
- **Toast**: `role="status"` for success; errors that block a task go in a `Notice`, not only a toast. Pause on hover/focus. No auto-dismiss for anything with an action.
- **Tooltip / Hover Card**: never hold required information (fees, risk). Open on focus as well as hover.
- **Input Group / Input OTP / Slider**: 16px font on mobile (already a rule), `inputmode` hints, `autocomplete` passthrough.
- **Calendar / Date Picker**: week starts Monday by default; `locale` comes from the app; selected value is a `Date`/ISO string, never a formatted string; disabled dates (bank holidays, settlement days) are passed in. Always allow typed entry.
- **Skeleton**: reserve final width so numbers do not jump.
- **Switch**: settings only. Never for actions with money movement (use a button + confirm).

## 6. Phases and release plan

Each phase is one or more PRs and one **minor** release (0.x). Every release needs a changeset and a visual check in at least one consumer app (AGENTS.md rules 6 and 8).

| Phase | Scope | New deps | Release |
| ----- | ----- | -------- | ------- |
| 0 | Tokens (§4.1), file split, showcase uses real package, interaction + axe tests, build per entry with `"use client"`, `@layer fds` (D6, own changeset) | dev only | 0.3.0 |
| 1 | Static primitives: Table, Item, Separator, Skeleton, Spinner, Kbd, Label, Avatar, Breadcrumb, Pagination, ButtonGroup, InputGroup, Typography CSS; extend Button, Panel, Notice, EmptyState, Field | none | 0.4.0 |
| 2 | Form controls: Checkbox, RadioGroup, Switch, Toggle, ToggleGroup, Slider, SelectMenu, Combobox, InputOTP, FieldSet | `@base-ui/react` | 0.5.0 |
| 3 | Overlays: Dialog, AlertDialog, Popover, Tooltip, HoverCard, Sheet, Drawer, DropdownMenu (+ `Menu` wrapper), ContextMenu, Toast | — | 0.6.0 |
| 4 | Disclosure: Accordion, Collapsible, Tabs, ScrollArea | — | 0.7.0 |
| 5 | Calendar, DatePicker, chart tokens + recipe doc, Data Table recipe doc | `react-day-picker` | 0.8.0 |

Order inside phases follows consumer demand. If Portare or Investor need a component sooner, pull it forward; Phase 0 is the only hard prerequisite, and Phase 3 needs Phase 2's dependency.

## 7. Risks

- **Dependency weight**: Base UI adds to every consumer's bundle. Mitigate with per-entry build and `sideEffects` so unused components drop out. Add a size check (e.g. `size-limit`) in Phase 0.
- **Base UI API churn**: pin a caret range on 1.x; Renovate in this repo, then visual checks.
- **Theme drift**: new tokens need Funder values verified against `nicklaslind/Funder/src/app/globals.css`; Portare stays labelled "proposed".
- **Scope creep**: anything that needs domain data (Data Table, Chart, Sidebar, Questionnaire) stays in apps unless two apps need the same thing.
- **Package not yet on npm**: consumers cannot adopt any of this until the bootstrap publish in README is done.

## 8. Open questions

1. Which components do Portare and Investor need first? That should reorder P1–P3.
2. Is `@layer fds` (D6) acceptable now, while there are no published consumers? It gets more expensive after 1.0.
3. Drop React 18 from peers before Phase 3? Simplifies refs; depends on Funder/Portare/Investor versions.
4. Should the showcase move to a proper docs site (Storybook or Ladle) once there are 40+ components, or stay a single static page?
