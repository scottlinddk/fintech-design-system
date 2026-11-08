---
"@scttlnd/fintech-design-system": minor
---

Add grain surfaces, on by default: every `Panel` gets a hairline border, a soft two-colour glow and fine film grain, which changes its appearance in all themes. Opt out with `data-fds-grain="off"` on the element or any ancestor (for example `<html>`). Also adds explicit `fds-grain` modifiers (`--warm`, `--subtle`, `--hero`), saturated `--vivid` colour fields (`--teal`, `--green`, `--ember`) with an `fds-grain__stage` inset, flat `fds-cells` and an `fds-code` chip. Styles ship in `styles.css`; colours derive from the active theme and adapt to light and dark. Review consumers visually before upgrading.
