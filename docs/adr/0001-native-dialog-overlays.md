# ADR 0001: native `<dialog>` for modal overlays

Status: accepted, 2026-11-21. Amends [COMPONENT-PLAN](../COMPONENT-PLAN.md) decision D1 and section 4.5 for modal overlays only.

## Context

D1 chose `@base-ui/react` for every component with focus management, portals or positioning. Dialog, Sheet and AlertDialog are the first such components. Consumers already hand-build them on the native element (Family Meals `BottomSheet`), and Base UI is not installed in this repo.

## Decision

Build `Dialog`, `Sheet` and `AlertDialog` on native `<dialog>` opened with `showModal()`. No new dependency. Base UI stays the candidate for components that need anchored positioning (Popover, Tooltip, Combobox, Select) and is decided again when one of them is requested.

## Why

- **The browser already does the hard parts**: modality, inert background, top-layer stacking above any `z-index` or `overflow`, focus trapping, Escape (`cancel`), nested modals (Escape closes only the topmost).
- **No portal, so no theme loss.** Plan section 4.5 warned that portalled popups lose tokens when a theme is scoped to a subtree. A native dialog stays where it is in the DOM and inherits the theme. `::backdrop` inherits from its originating element, so `--fds-overlay` resolves from a themed subtree too (Chrome 122, Firefox 120, Safari and iOS Safari 17.4; MDN compat data). Because of this there is no `container` option.
- **Smaller and server-compatible shell.** No runtime dependency in every consumer's bundle. The component is still a client module (state, effects), like `Menu`.
- **Scroll lock needs no JS or stack counter**: `:root:has(.fds-dialog[open]) { overflow: hidden }` is stack-aware by construction (Chrome 105, Safari 15.4, Firefox 121).
- **Animation degrades cleanly.** Enter and exit use `@starting-style` and `transition-behavior: allow-discrete` (Chrome 117, Safari 17.4, Firefox 129; Baseline). Older browsers skip the animation; the dialog still opens and closes. Under `prefers-reduced-motion` the transitions are removed, not shortened.

## What the package adds on top

A controlled API (`open` / `onOpenChange`; every dismissal asks the app), required `title` wired to `aria-labelledby`, focus restore to the element that was focused on open, backdrop dismissal that ignores a text selection ending on the backdrop, `closeOnBackdrop` / `dismissible` opt-outs, `initialFocusRef`, and children mounted only while open or animating out. `AlertDialog` focuses Cancel, never the destructive confirm, and is not dismissed by a backdrop press.

## Consequences and limits

- `closedby="any"` (native light dismiss) is not used: support is not yet universal, and the controlled model needs the event anyway.
- Floors: `<dialog>` itself Safari 15.4+; animation needs the versions above; scroll lock needs `:has()`.
- Not verified here: **real iOS Safari** (background rubber-banding with `overflow: hidden`, on-screen keyboard resizing a bottom sheet), **VoiceOver / TalkBack**, Firefox and WebKit engines. Chromium behaviour is covered by `e2e/dialog.spec.ts` (keyboard, focus return, backdrop, scroll lock, nesting, reduced motion, axe and button contrast in all themes and both modes, desktop and 375px). Treat the iOS items as open until checked on a device.
- Popover and Tooltip are a separate decision: they need anchor positioning, which this ADR does not settle.
