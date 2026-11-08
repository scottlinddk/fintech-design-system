---
"@scttlnd/fintech-design-system": minor
---

CASCADE BEHAVIOUR CHANGE: wrap all package tokens, themes and component rules in the named `fds` CSS cascade layer. Normal unlayered consumer CSS now overrides package CSS even when it appears earlier or has lower specificity. Review consumer resets, token overrides and focus styles before upgrading. Existing selectors and token values are unchanged. Consumers using layers can declare their order, for example `@layer reset, fds, app;`.

This is breaking for consumers; it ships as a minor only because the package is pre-1.0 (0.x minors may break). Requires browsers with CSS cascade layers (Chrome/Edge 99+, Firefox 97+, Safari 15.4+); older browsers ignore the whole stylesheet.
