---
"@scttlnd/fintech-design-system": minor
---

VISIBLE CHANGE: Make Studio the default when consumers import styles.css, including flat panels and light/dark mode without an extra stylesheet or theme attribute. Preserve explicit Funder, Investor and Portare imports, including the dark values previously inherited from the base palette. Consumers previously relying on styles.css alone can add themes/funder.css after it to keep the former implicit dark appearance. Existing product-theme consumers need no changes.
