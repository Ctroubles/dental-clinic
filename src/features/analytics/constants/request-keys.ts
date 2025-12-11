export const analyticsQueryKeys = {
  base: ["analytics"] as const,
  overview: () => [...analyticsQueryKeys.base, "overview"] as const,
  dailyRevenue: () => [...analyticsQueryKeys.base, "daily-revenue"] as const,
  monthlyVisits: () => [...analyticsQueryKeys.base, "monthly-visits"] as const,
  topServices: () => [...analyticsQueryKeys.base, "top-services"] as const,
  recentPayments: () =>
    [...analyticsQueryKeys.base, "recent-payments"] as const,
} as const
