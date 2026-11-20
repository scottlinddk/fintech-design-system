---
"@scttlnd/ui": minor
---

VISIBLE CHANGE: add Skeleton, SkeletonText, SkeletonGroup, Toast, ToastRegion and Table primitives (Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell) with sticky headers, 48px/32px rows and tabular numerals. New motion tokens (`--fds-duration-enter/exit/slow`, `--fds-ease-emphasized/decelerate/accelerate`) go to 0s under reduced motion, and `--fds-sticky-offset` (default 0px) sets root `scroll-padding-top` so focus is not hidden behind sticky chrome. Badge, notice, meter, segmented meter, button and focus rings gain forced-colors rules, and Nuance panels fall back to opaque surfaces under `prefers-reduced-transparency` or `prefers-contrast: more`. Existing tokens and exports are unchanged; no migration is required.
