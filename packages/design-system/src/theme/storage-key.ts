/**
 * Server-safe constants for the theme module.
 *
 * Lives in its own file (no `'use client'`) so both server components like
 * `<ThemeScript />` and client components like `<ThemeProvider />` can import
 * the same key. Importing a constant from a `'use client'` module into a
 * server component would otherwise trip Next.js's client-boundary guard, which
 * replaces the import with a runtime throw whose message contains apostrophes
 * — those break inline single-quoted script literals.
 */

export const STORAGE_KEY = 'ai-portfolio-theme'
