# Design foundations

Status: initial proposal, 2026-11-07.

## Direction

Blend Funder's serious, dark financial interface with Vercel's disciplined typography, borders and spacing, plus Vite+'s selective atmospheric gradient and fine-grain treatments. This is inspiration, not a visual clone. Avoid the default AI-dashboard aesthetic: no ubiquitous glowing cards, purple gradients, excessive pill radii, or decorative metrics.

Sources:

- Funder: https://github.com/nicklaslind/Funder (reviewed src/app/globals.css)
- Vite+: https://viteplus.dev/ (reviewed 2026-11-07)
- Vercel: https://vercel.com/

## Rules

1. Data is primary. Decoration must never interfere with reading numbers.
2. Prefer a restrained neutral palette, thin borders, compact spacing, and deliberate typography.
3. Use gradients and grain only for brand surfaces, documentation headers, and empty states, never behind dense tables or charts.
4. Light and dark themes are separately tuned, not mechanically inverted.
5. Use semantic status colors with text and icon labels; never communicate meaning through color alone.
6. Tabular numbers and right-aligned numeric columns are the default for financial data.
7. Respect reduced motion, accessible contrast, and visible keyboard focus.

## Token layers

- Primitive: raw neutral, blue, green, amber, red ramps; spacing; radius; typography.
- Semantic: surface, text, border, focus, accent, positive, negative, warning.
- Component: table row, input, button, chart grid and series.

See `src/tokens.css` for the initial working CSS implementation.

## Proposed showcase

`showcase/index.html` demonstrates typography, account overview, transaction table, status treatments, and a restrained atmospheric header. It is a static design review artifact, not a production component library.

## Next steps

Validate contrast and mobile layouts, add interaction states, establish component APIs and accessibility tests, then package tokens and React components. Evaluate Vite+ as tooling separately; its visual design does not require adopting its CLI.
