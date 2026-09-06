/**
 * Series registry. `total` is the planned episode count — the track renders
 * that many dots and greys out the ones not published yet.
 */
export const SERIES = {
  'ai-application': {
    title: 'AI Application for Startups & SME',
    total: 10,
    description: null, // null = fall back to episode 0's excerpt on the hub and hero
  },
} as const

export type SeriesKey = keyof typeof SERIES
