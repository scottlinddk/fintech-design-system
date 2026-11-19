---
"@scttlnd/ui": minor
---

BREAKING: the package is renamed from `@scttlnd/fintech-design-system` to `@scttlnd/ui` because it now serves multiple products and themes in any domain. Exports, `--fds-*` tokens, `data-fds-*` attributes and theme files are unchanged. Migrate by replacing the dependency name in package.json and every `@scttlnd/fintech-design-system` import path (including `/styles.css` and `/themes/*.css`) with `@scttlnd/ui`; the old package is deprecated and receives no further releases.
