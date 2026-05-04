/**
 * Theme module — shared light/dark theming for all AI portfolio apps.
 *
 * Wiring pattern in a Next.js root layout:
 *
 *   import { ThemeProvider, ThemeScript, ParticleBackground, ThemeToggle }
 *     from '@rishi/design-system/theme'
 *
 *   export default function RootLayout({ children }) {
 *     return (
 *       <html lang="en" suppressHydrationWarning>
 *         <head><ThemeScript /></head>
 *         <body>
 *           <ThemeProvider>
 *             <ParticleBackground />
 *             <div className="relative" style={{ zIndex: 1 }}>
 *               <Nav />  // includes <ThemeToggle />
 *               <main>{children}</main>
 *             </div>
 *           </ThemeProvider>
 *         </body>
 *       </html>
 *     )
 *   }
 */

export { ThemeProvider, useTheme, STORAGE_KEY } from './use-theme'
export type { Theme } from './use-theme'
export { ThemeScript } from './theme-script'
export { ParticleBackground } from './particle-background'
export { ThemeToggle } from './theme-toggle'
