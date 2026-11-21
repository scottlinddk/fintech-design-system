---
"@scttlnd/ui": minor
---

VISIBLE CHANGE: add `Dialog`, `Sheet` and `AlertDialog`, built on the native `<dialog>` element with no new dependency. They are controlled (`open` / `onOpenChange`), return focus to the trigger, close on Escape and backdrop press, lock page scroll without JavaScript, support nested sheets, and animate in and out (removed under reduced motion). `AlertDialog` focuses Cancel, not the confirm button, and ignores backdrop presses. `Button` gains a `danger` variant using `--fds-danger` / `--fds-on-danger`. Existing exports and tokens are unchanged; no migration is needed. The new `Dialog` module is a client module (`"use client"`).
