---
"@scttlnd/fintech-design-system": minor
---

Build separate ESM component modules and declarations while preserving the flat named exports and existing CSS entry points. Add `"use client"` to Button, Field/native controls, Menu and Panel only; the root barrel and Badge remain server-compatible. Add packed-package Next.js App Router verification and a Badge-only bundle budget. Consumer callbacks and Field render functions still need a client component.
