/**
 * Framer Motion variants — reusable animation configs.
 * Matches the keyframes defined in ./tokens/motion.css so CSS and Framer stay consistent.
 */

import type { Variants, Transition } from 'framer-motion'

// ========== Easings ==========
export const easings = {
  out: [0, 0, 0.2, 1],
  in: [0.4, 0, 1, 1],
  inOut: [0.4, 0, 0.2, 1],
  smooth: [0.22, 1, 0.36, 1],
  elastic: [0.68, -0.55, 0.27, 1.55],
} as const

// ========== Durations ==========
export const durations = {
  instant: 0,
  fast: 0.15,
  normal: 0.3,
  moderate: 0.5,
  slow: 0.6,
  slower: 1.0,
} as const

// ========== Variants ==========

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: durations.slow, ease: easings.out } },
}

export const fadeOut: Variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0, transition: { duration: durations.normal, ease: easings.in } },
}

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.slow, ease: easings.out },
  },
}

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.slow, ease: easings.out },
  },
}

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: durations.slow, ease: easings.out },
  },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.normal, ease: easings.smooth },
  },
}

// Stagger children — pair with slideUp / fadeIn on child items
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.moderate, ease: easings.out },
  },
}

// Persistent animations (looping)
export const pulseGlow = {
  initial: { boxShadow: '0 0 20px rgba(45, 212, 191, 0.3)' },
  animate: {
    boxShadow: [
      '0 0 20px rgba(45, 212, 191, 0.3)',
      '0 0 40px rgba(45, 212, 191, 0.6)',
      '0 0 20px rgba(45, 212, 191, 0.3)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: easings.inOut,
    },
  },
}

export const float = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: easings.inOut,
    },
  },
}

// ========== Transitions ==========
export const transitions = {
  fast: { duration: durations.fast, ease: easings.out } as Transition,
  normal: { duration: durations.normal, ease: easings.out } as Transition,
  slow: { duration: durations.slow, ease: easings.out } as Transition,
  spring: { type: 'spring', stiffness: 200, damping: 20 } as Transition,
  springBouncy: { type: 'spring', stiffness: 300, damping: 15 } as Transition,
}

// ========== Layout animations ==========
/** Use on `<motion.div layout />` for smooth list reordering and resizing. */
export const layoutTransition: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 26,
}
