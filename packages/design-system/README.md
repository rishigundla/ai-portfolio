# @rishi/design-system

Design system for the AI Portfolio monorepo. Tokens, primitives, AI-specific components, and Framer Motion variants — extracted from [rishikeshgundla.com](https://rishikeshgundla.com) and extended for streaming UIs, KPI dashboards, and narrative-heavy interfaces.

**Live showcase**: [ai-portfolio-design-system-docs.vercel.app](https://ai-portfolio-design-system-docs.vercel.app)

## What's Inside

### Tokens — CSS variables + typed constants

| File | Covers |
|------|--------|
| `src/tokens/colors.css` | Accent (`#2dd4bf`), base-900→600 scale, surface / text / status / severity + light theme |
| `src/tokens/typography.css` | Space Grotesk + JetBrains Mono + Source Serif 4 with font face imports, size/weight/tracking scales |
| `src/tokens/spacing.css` | 4px base scale, radius, container widths, border widths |
| `src/tokens/motion.css` | Durations, easings, keyframes (fadeIn, slideUp, pulseGlow, float, gridFlow, shimmer, blink) + utility classes |
| `src/tokens/shadows.css` | Elevation + accent glow shadows + card/focus/modal variants |
| `src/tokens/index.css` | Barrel — the single CSS import apps consume |
| `src/tokens/index.ts` | Typed constants (`tokens.color.accent`, etc.) for programmatic access |

### Primitives — 14 accessible base components

Built on Radix UI + `cva` + `clsx` + `tailwind-merge`, themed to tokens:

```
Button · Card · Badge · Input · Label · Dialog · Tabs · Tooltip
Popover · Select · Toast · Command · Combobox · Avatar
```

Deep imports for tree-shaking or the barrel for convenience:

```ts
import { Button } from '@rishi/design-system/primitives/button'  // granular
import { Button, Card, Badge } from '@rishi/design-system/primitives'  // barrel
```

### Components — 5 AI-specific composed components

| Component | Purpose |
|-----------|---------|
| `KpiCard` | Value + directional delta + inline SVG sparkline + 4 states (ready / loading / empty / error). `invertGood` flips color semantics for metrics where down is good (e.g. churn). |
| `ChartCard` | Library-agnostic themed container. Accepts any chart library as children. 4 states with skeleton loader and error fallback. |
| `AiNarrativeBlock` | Markdown renderer (react-markdown + remark-gfm) with blink cursor when `streaming=true`. 3 variants. **This is the component every Claude output flows through.** |
| `FilterBar` | Compound component — `.Search`, `.Select`, `.DateRange` (6 preset ranges), `.Clear`. |
| `DataGrid` | Sortable columns (3-state cycle), pagination, row click handler, per-column render fn. |

### Motion — Framer variants

```ts
import { fadeIn, slideUp, staggerContainer, pulseGlow } from '@rishi/design-system/motion'
```

Variants match the CSS keyframes so the motion language stays consistent whether you use CSS or Framer.

### Tailwind preset

```ts
// your app's tailwind.config.ts
import type { Config } from 'tailwindcss'
import baseConfig from '@rishi/design-system/tailwind.config'

export default {
  presets: [baseConfig],
  content: ['./src/**/*.{ts,tsx}'],
} satisfies Config
```

## Quick Start

```css
/* app globals.css */
@import '@rishi/design-system/tokens';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```tsx
// app/layout.tsx
import '@rishi/design-system/tokens'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="dark">
      <body className="bg-base-900 text-text-primary">{children}</body>
    </html>
  )
}
```

```tsx
// any component
import { Button, Card } from '@rishi/design-system/primitives'
import { KpiCard, AiNarrativeBlock } from '@rishi/design-system/components'
```

## Design Principles

- **One teal accent** (`#2dd4bf`) is the single brand signature. Never introduce a second accent color.
- **Dark theme primary**; light theme variables exist for future toggle but aren't the default.
- **Space Grotesk for display and body**; pair with JetBrains Mono for technical details and Source Serif 4 for editorial accents only.
- **Motion is subtle** — fadeIn / slideUp on entry, pulseGlow reserved for active / primary states. Respect `prefers-reduced-motion` at the app level.
- **Primitives expose the Radix contract unchanged.** Apps that need custom behavior wrap them; they don't fight the primitive.

## Dependencies

Runtime: `@radix-ui/*` (9 packages), `class-variance-authority`, `clsx`, `tailwind-merge`, `cmdk`, `framer-motion`, `lucide-react`, `react-markdown`, `remark-gfm`, `@fontsource/*` (3 fonts).

Peer: `react >= 18`, `react-dom >= 18`.

Dev: Tailwind 3.4.17, TypeScript 5.9.

## Related

- **[@rishi/ai-core](../ai-core)** — streaming replay primitive used by `AiNarrativeBlock` consumers
- **[../../docs/master-plan.md](../../docs/master-plan.md)** — 14-week build plan
- **[../../apps/design-system-docs](../../apps/design-system-docs)** — live showcase application
