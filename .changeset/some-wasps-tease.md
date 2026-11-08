---
"@scttlnd/fintech-design-system": minor
---

CASCADE BEHAVIOUR CHANGE: wrap all package tokens, themes and component rules in the named `fds` CSS cascade layer. Normal unlayered consumer CSS now overrides package CSS even when it appears earlier or has lower specificity. Review consumer resets, token overrides and focus styles before upgrading. Existing selectors and token values are unchanged. Consumers using layers can declare their order, for example `@layer reset, fds, app;`.
