import { DateRange } from "@/application/repositories/analytics.repository.interface"

const buildDateKey = (dateRange: DateRange) => [
  dateRange.from.toISOString(),
  dateRange.to.toISOString(),
]

export const analyticsQueryKeys = {
  base: ["analytics"],
  overview: (dateRange: DateRange) => [
    ...analyticsQueryKeys.base,
    "overview",
    ...buildDateKey(dateRange),
  ],
  dailyRevenue: (dateRange: DateRange) => [
    ...analyticsQueryKeys.base,
    "daily-revenue",
    ...buildDateKey(dateRange),
  ],
  dailyVisits: (dateRange: DateRange) => [
    ...analyticsQueryKeys.base,
    "daily-visits",
    ...buildDateKey(dateRange),
  ],
  monthlyVisits: (dateRange: DateRange) => [
    ...analyticsQueryKeys.base,
    "monthly-visits",
    ...buildDateKey(dateRange),
  ],
  topServices: (dateRange: DateRange) => [
    ...analyticsQueryKeys.base,
    "top-services",
    ...buildDateKey(dateRange),
  ],
  recentPayments: (dateRange: DateRange) => [
    ...analyticsQueryKeys.base,
    "recent-payments",
    ...buildDateKey(dateRange),
  ],
}
