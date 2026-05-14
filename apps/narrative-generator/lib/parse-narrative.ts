/**
 * Tiny markdown-section parser for narrative fixtures.
 *
 * Splits a narrative's markdown text on `## ` H2 headings and returns
 * a section-name → section-body map. The deck renderer (W6.D5) uses
 * this to feed each slide with its own content; the PPTX exporter
 * (W7.D1) will use the same parse to build per-slide content blocks.
 *
 * Why not react-markdown's plugin pipeline? We need the structured
 * map at module level (for static rendering), not a React node tree.
 * A regex-driven split is ~20 lines and avoids pulling unified/remark
 * into routes that just need text manipulation.
 */

export interface NarrativeSections {
  /** Map of section heading (e.g. "Headline") → body markdown. */
  byHeading: Record<string, string>
  /** Same data ordered as it appeared in the source. */
  ordered: Array<{ heading: string; body: string }>
}

const HEADING_PATTERN = /^##\s+(.+?)\s*$/

/**
 * Parse a narrative markdown blob into named sections.
 *
 * Treats lines matching `^## (heading)` as section breaks. Everything
 * between a heading and the next heading (exclusive of leading/trailing
 * whitespace) becomes that section's body. Headings are matched
 * case-sensitively but trimmed.
 */
export function parseNarrativeSections(text: string): NarrativeSections {
  const lines = text.split('\n')
  const byHeading: Record<string, string> = {}
  const ordered: Array<{ heading: string; body: string }> = []

  let currentHeading: string | null = null
  let buffer: string[] = []

  const flush = () => {
    if (currentHeading === null) return
    const body = buffer.join('\n').trim()
    byHeading[currentHeading] = body
    ordered.push({ heading: currentHeading, body })
  }

  for (const line of lines) {
    const match = line.match(HEADING_PATTERN)
    if (match && match[1]) {
      flush()
      currentHeading = match[1].trim()
      buffer = []
    } else if (currentHeading !== null) {
      buffer.push(line)
    }
  }
  flush()

  return { byHeading, ordered }
}

/**
 * Extract markdown bullet lines (`- foo`) from a section body, with
 * leading `- ` stripped. Used by the deck's talking-points slide to
 * render each bullet as its own typographic element instead of a
 * blob of markdown.
 */
export function extractBullets(sectionBody: string): string[] {
  return sectionBody
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) => line.replace(/^[-*]\s+/, '').trim())
}
