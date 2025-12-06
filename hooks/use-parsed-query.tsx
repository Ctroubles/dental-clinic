"use client"

import { useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { createLoader, inferParserType, ParserMap } from "nuqs"

/**
 * Hook to parse URL search params using Nuqs parsers.
 *
 * This hook ensures that the parsed values always reflect the current URL state,
 * avoiding stale values that can occur with `useQueryStates` during navigation.
 *
 * @param parsers - Object mapping query param keys to their Nuqs parsers
 * @returns Parsed query parameters with inferred types
 *
 * @example
 * const parsers = {
 *   search: parseAsString,
 *   page: parseAsInteger.withDefault(1),
 * }
 *
 * const filters = useParsedQuery(parsers)
 * // filters is automatically typed as { search: string | null, page: number }
 */
export function useParsedQuery<T extends ParserMap>(
  parsers: T
): inferParserType<T> {
  const searchParams = useSearchParams()

  const parsed = useMemo(() => {
    const loader = createLoader(parsers)
    return loader(searchParams)
  }, [parsers, searchParams])

  return parsed
}
