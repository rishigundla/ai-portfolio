import type { Config } from 'tailwindcss'
import baseConfig from '@rishi/design-system/tailwind.config'

const config: Config = {
  // Extend the shared design-system preset so all apps stay visually aligned
  presets: [baseConfig],
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    // Include design-system source so its Tailwind classes are emitted
    '../../packages/design-system/src/**/*.{ts,tsx}',
  ],
}

export default config
