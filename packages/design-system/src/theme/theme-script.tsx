/**
 * Pre-paint theme initializer.
 *
 * Reads localStorage('ai-portfolio-theme') and applies the corresponding
 * class to <html> BEFORE first paint, so users don't see a flash of the
 * wrong theme on initial load.
 *
 * Implementation: render a Next.js `<Script strategy="beforeInteractive">`
 * inside the root layout's `<head>`. Next.js inlines the body and runs it
 * during HTML parsing, before React hydrates and before any pixels render.
 *
 * Defaults to dark when no preference is stored.
 */

import Script from 'next/script'
import { STORAGE_KEY } from './storage-key'

const initScript = `(function(){try{var s=localStorage.getItem('${STORAGE_KEY}');var t=(s==='light')?'light':'dark';var r=document.documentElement;r.classList.remove('light','dark');r.classList.add(t);}catch(e){}})()`

export function ThemeScript() {
  return (
    <Script id="ai-portfolio-theme-init" strategy="beforeInteractive">
      {initScript}
    </Script>
  )
}
