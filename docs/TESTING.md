# Tests

- `npm test`: retains the Node static-markup tests and adds happy-dom interaction/axe tests for existing Button, Field and Menu. Tests exercise typing, label/hint/error associations, native selection, keyboard activation, disabled items, arrow/Home/End navigation, Escape/focus return, outside dismissal, and Tab dismissal.
- `npm run test:browser`: builds and serves the showcase over HTTP, checks all three themes at 1280px desktop and 375px touch/mobile, runs real-browser axe, verifies focus, keyboard, 44px touch targets, 16px mobile controls, reduced motion and absence of page overflow/errors. Saves open/closed-menu screenshots and axe reports. Linux CI runs this suite; the post-merge audit now uses the same locked tooling and fails on violations.
- `npm run test:visual`: the same suite plus screenshot regression assertions. macOS baselines are committed under `e2e/__screenshots__/darwin`; the visual CI job uses macOS to match them. Rendering can vary with OS/font versions; review unexpected differences rather than blindly accepting them.
- `npm run test:visual:update`: regenerate baselines intentionally, inspect the images, and commit reviewed changes. Install Chromium first with `npx playwright install chromium` (CI Linux uses `--with-deps`).

DOM axe checks do not establish visual colour contrast or screen-reader usability. Real-browser axe complements the explicit token contrast tests. VoiceOver, real iOS/Android, other browser engines, and visual verification in consuming product apps still require manual review.

Local Phase 0 test-setup result (2026-11-08): 32 unit/static/interaction tests and all 6 Chromium theme/viewport scenarios pass, including axe and all 12 snapshot comparisons. The CSS split separately matched 12 before/after PNGs byte-for-byte; see `verification/css-split.md`.

The macOS CI runner differs from the local baseline by 49–851 pixels in native controls/text antialiasing (reviewed CI diff images). Snapshot assertions allow at most 1000 differing pixels per full-page image; token, size, focus and axe assertions remain exact. This tolerance is independent of image area. The CSS split comparison used exact PNG hashes with no tolerance.
