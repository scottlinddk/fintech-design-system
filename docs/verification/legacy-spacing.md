# Retired showcase spacing

`src/tokens.css` was unshipped and used only by the old showcase. Its useful 4px spacing scale is preserved here for Phase 0 token work: 1 = 4px, 2 = 8px, 3 = 12px, 4 = 16px, 5 = 20px, 6 = 24px, 8 = 32px. Fill the missing seventh step with 28px when adding `--fds-space-1…8`.

The obsolete colours and unprefixed aliases are intentionally retired. The showcase now renders the actual source components with `styles/index.css` and exactly one theme stylesheet, selected on `<html>`. Built output is static and includes React locally; it needs no CDN.
