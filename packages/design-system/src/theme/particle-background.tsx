'use client'

import * as React from 'react'
import { useTheme } from './use-theme'

/**
 * Animated canvas background. Ported from rishikeshgundla.com's
 * GlobalBackground.jsx so the AI portfolio sites visually match the user's
 * personal portfolio.
 *
 * Visual elements:
 *   - Faint grid lines
 *   - Pulsing nodes at random grid intersections
 *   - Horizontal "data stream" gradient lines (desktop only)
 *   - Connected particle field (dots that draw lines to nearby neighbors)
 *
 * Theme-aware: dark mode uses teal-400 (#2dd4bf-ish) at higher alpha; light
 * mode uses teal-600 (#0d9488-ish) at slightly higher alpha because the
 * lighter background washes the color out otherwise.
 *
 * Position: fixed inset-0, z-index 0, pointer-events-none. Consumer must
 * place its content inside a wrapper with `position: relative; z-index: 1`
 * so it sits above the canvas and remains interactive.
 *
 * Performance: particle count scales with viewport — 15 mobile / 80 tablet /
 * 140 desktop. Connections only render on tablet+ (O(n²) cost).
 */

interface ParticleBackgroundProps {
  /** Override the canvas opacity. Defaults to 0.85 (matches portfolio-site). */
  opacity?: number
}

export function ParticleBackground({ opacity = 0.85 }: ParticleBackgroundProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const { theme } = useTheme()

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio
      canvas.height = window.innerHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()

    const isMobile = window.innerWidth < 768
    const isTablet = window.innerWidth < 1024
    const particleCount = isMobile ? 15 : isTablet ? 80 : 140
    const w = window.innerWidth
    const h = window.innerHeight

    const isDark = theme === 'dark'
    // Dark mode: teal-400 (45, 212, 191). Light mode: teal-600 (13, 148, 136).
    // Light alpha values bumped slightly because lighter backgrounds wash out
    // low-alpha strokes more aggressively than dark backgrounds do.
    const particleR = isDark ? 45 : 13
    const particleG = isDark ? 212 : 148
    const particleB = isDark ? 191 : 136
    const gridAlpha = isDark ? 0.06 : 0.1
    const nodeAlpha = isDark ? 0.12 : 0.18

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.4 + 0.15,
    }))

    const gridSpacing = 60
    const pulseNodes: Array<{
      x: number
      y: number
      phase: number
      speed: number
      maxRadius: number
    }> = []
    for (let x = gridSpacing; x < w; x += gridSpacing) {
      for (let y = gridSpacing; y < h; y += gridSpacing) {
        if (Math.random() > 0.7) {
          pulseNodes.push({
            x,
            y,
            phase: Math.random() * Math.PI * 2,
            speed: 0.02 + Math.random() * 0.02,
            maxRadius: 2 + Math.random() * 2,
          })
        }
      }
    }

    const streams = isMobile
      ? []
      : Array.from({ length: 8 }, () => ({
          y: Math.random() * h,
          speed: 0.3 + Math.random() * 0.5,
          length: 80 + Math.random() * 200,
          x: Math.random() * w,
          opacity: 0.03 + Math.random() * 0.04,
        }))

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      time++

      // Grid lines
      ctx.lineWidth = 0.5
      for (let x = 0; x < w; x += gridSpacing) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.strokeStyle = `rgba(${particleR}, ${particleG}, ${particleB}, ${gridAlpha})`
        ctx.stroke()
      }
      for (let y = 0; y < h; y += gridSpacing) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.strokeStyle = `rgba(${particleR}, ${particleG}, ${particleB}, ${gridAlpha})`
        ctx.stroke()
      }

      // Pulsing nodes
      pulseNodes.forEach((node) => {
        const pulse = Math.sin(time * node.speed + node.phase)
        const radius = node.maxRadius * (0.5 + pulse * 0.5)
        const alpha = nodeAlpha * (0.4 + pulse * 0.6)
        ctx.beginPath()
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${particleR}, ${particleG}, ${particleB}, ${alpha})`
        ctx.fill()
      })

      // Data streams
      streams.forEach((s) => {
        s.x += s.speed
        if (s.x > w + s.length) s.x = -s.length
        const grad = ctx.createLinearGradient(s.x, s.y, s.x + s.length, s.y)
        grad.addColorStop(0, `rgba(${particleR}, ${particleG}, ${particleB}, 0)`)
        grad.addColorStop(
          0.5,
          `rgba(${particleR}, ${particleG}, ${particleB}, ${s.opacity})`,
        )
        grad.addColorStop(1, `rgba(${particleR}, ${particleG}, ${particleB}, 0)`)
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(s.x + s.length, s.y)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1
        ctx.stroke()
      })

      // Particles
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${particleR}, ${particleG}, ${particleB}, ${p.opacity})`
        ctx.fill()
      })

      // Connections (desktop + tablet only — O(n²))
      if (!isMobile) {
        const connectionDist = isTablet ? 100 : 150
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i]
            const b = particles[j]
            if (!a || !b) continue
            const dx = a.x - b.x
            const dy = a.y - b.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < connectionDist) {
              ctx.beginPath()
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(b.x, b.y)
              ctx.strokeStyle = `rgba(${particleR}, ${particleG}, ${particleB}, ${
                0.1 * (1 - dist / connectionDist)
              })`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        }
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ opacity, zIndex: 0 }}
    />
  )
}
