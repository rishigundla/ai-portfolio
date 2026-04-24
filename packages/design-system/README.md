# @rishi/design-system

Design system for the AI Portfolio monorepo. Tokens, primitives, and AI-specific components extracted from [rishikeshgundla.com](https://rishikeshgundla.com) portfolio site.

## Status

- **Day 2 (Tokens)**: Complete — all tokens extracted and exported
- **Day 3 (Primitives)**: Pending — install shadcn and theme to tokens
- **Day 4 (AI Components)**: Pending — KpiCard, ChartCard, AiNarrativeBlock, FilterBar, DataGrid

## Exports

```ts
// CSS tokens (loads :root CSS variables)
import '@rishi/design-system/tokens'

// Typed token constants for programmatic use
import { tokens } from '@rishi/design-system/tokens/typed'

// Tailwind preset for consuming apps
import baseConfig from '@rishi/design-system/tailwind.config'
```

## Token Files

| File | Purpose |
|------|---------|
| `src/tokens/colors.css` | Accent (teal), base-900→600 scale, surface, text, status, severity |
| `src/tokens/typography.css` | Space Grotesk, JetBrains Mono, Source Serif 4 + size / weight / spacing scales |
| `src/tokens/spacing.css` | 4px base spacing scale, radius scale, container widths |
| `src/tokens/motion.css` | Durations, easings, keyframes (fadeIn, slideUp, pulseGlow, float, gridFlow, shimmer, blink) + animation utility classes |
| `src/tokens/shadows.css` | Elevation system + accent glow shadows + card variants |
| `src/tokens/index.css` | Barrel import — the one file apps consume |
| `src/tokens/index.ts` | Typed token constants for JS access |

## Usage in a Consuming App

```css
/* app globals.css */
@import '@rishi/design-system/tokens';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```ts
// app tailwind.config.ts
import type { Config } from 'tailwindcss'
import baseConfig from '@rishi/design-system/tailwind.config'

const config: Config = {
  presets: [baseConfig],
  content: ['./src/**/*.{ts,tsx}'],
}

export default config
```

## Design Principles

- **One teal accent** — `#2dd4bf` is the single brand signature. Never introduce a second accent color.
- **Dark theme primary** — light theme variables exist for future toggle but are not the default.
- **Space Grotesk for display and body** — pair with JetBrains Mono for technical details and Source Serif 4 for editorial accents only.
- **Motion is subtle** — fadeIn / slideUp on entry. pulseGlow reserved for active / primary states. Always respect `prefers-reduced-motion` at the app level.

## Planned Next Layers

- `src/primitives/` — shadcn-themed Button, Dialog, Card, Tabs, Tooltip, Popover, Input, Select, Toast, Command, Combobox
- `src/components/` — `KpiCard`, `ChartCard`, `AiNarrativeBlock`, `FilterBar`, `DataGrid`
- `src/motion/` — Framer Motion variants (variants objects for common animations)

See [master plan](../../docs/master-plan.md) for the full build schedule.
