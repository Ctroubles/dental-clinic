// Time Constants
export const TIME_CONSTANTS = {
  QUERY_STALE_TIME: 20 * 60 * 1000, // 20 minutes
  QUERY_CACHE_TIME: 20 * 60 * 1000, // 20 minutes
  MUTATION_RETRY_DELAY: (attemptIndex: number) =>
    Math.min(1000 * 2 ** attemptIndex, 30000),
  ANIMATION_DURATION: 200,
  DEBOUNCE_DELAY: 300,
} as const

export const HOME_PATH = "/admin/inicio"
