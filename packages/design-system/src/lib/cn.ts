import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind classnames intelligently.
 * Later classes override earlier ones when they conflict.
 *
 * @example
 *   cn('px-2 py-1', props.className)
 *   cn('text-red-500', isActive && 'text-accent')
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
