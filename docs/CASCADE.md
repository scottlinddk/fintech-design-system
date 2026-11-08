# The fds cascade layer

All package token, theme and component declarations are inside `@layer fds`. Import base styles followed by exactly one theme, as before. This is the explicitly approved Phase 0 D6 behaviour change, shipped in its own PR and minor changeset.

Normal unlayered consumer styles take precedence over package styles even when the consumer rule appears earlier or has lower specificity. A global `button` reset can therefore override `.fds-button`; review resets, focus rules and token overrides in every consumer before upgrading. Package focus rings, touch sizing and reduced-motion rules remain present, but consumers now control the cascade above them.

If the consumer uses layers, declare their order before imports:

```css
@layer reset, fds, app;
```

Put consumer overrides in `app`, or leave them unlayered. Existing `--fds-*` names and values do not change. An unlayered `:root` token override also wins over the theme's normal layered declarations. For portalled UI, apply the selected theme on `<html>`; a subtree's tokens do not follow a portal into the document body.

Tests unwrap only the new layer boundary and verify the previous CSS declaration stream remains intact. Browser tests prove an earlier `button { font-weight: 400 }` overrides the more-specific package rule, and an earlier unlayered token override changes the actual Button background while keeping its focus outline. The all-theme desktop/mobile visual suite checks the showcase against pre-layer baselines.
