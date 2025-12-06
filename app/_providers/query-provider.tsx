"use client"

import type React from "react"
import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { TIME_CONSTANTS } from "~/lib/constants"

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time: 5 minutes
            staleTime: TIME_CONSTANTS.QUERY_STALE_TIME,
            // Cache time: 10 minutes
            gcTime: TIME_CONSTANTS.QUERY_CACHE_TIME,
            // Retry failed requests 3 times
            retry: 2,
            // Retry delay that increases exponentially
            retryDelay: TIME_CONSTANTS.MUTATION_RETRY_DELAY,
            // Refetch on window focus
            refetchOnWindowFocus: false,
            // Refetch on reconnect
            refetchOnReconnect: true,
            // Throw errors instead of returning them in data
            throwOnError: false,
          },
          mutations: {
            // Retry failed mutations once
            retry: 0,
            // Throw errors for better error boundaries
            throwOnError: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && false && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
