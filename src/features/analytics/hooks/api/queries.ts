import { useQuery } from "@tanstack/react-query"
import { makeQuery } from "~/lib/api/queryFactory"
import { analyticsQueryKeys } from "../../constants"
import {
  getAnalyticsOverview,
  getDailyRevenue,
  getMonthlyVisits,
  getRecentPayments,
  getTopServices,
} from "../../request"

export const { useHook: useAnalyticsOverview } = makeQuery({
  queryKey: analyticsQueryKeys.overview(),
  queryFn: getAnalyticsOverview,
})

export const { useHook: useDailyRevenue } = makeQuery({
  queryKey: analyticsQueryKeys.dailyRevenue(),
  queryFn: () => {
    const now = new Date()
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    return getDailyRevenue({ from: monthAgo, to: now })
  },
})

export const { useHook: useMonthlyVisits } = makeQuery({
  queryKey: analyticsQueryKeys.monthlyVisits(),
  queryFn: getMonthlyVisits,
})

export const { useHook: useTopServices } = makeQuery({
  queryKey: analyticsQueryKeys.topServices(),
  queryFn: getTopServices,
})

export const { useHook: useRecentPayments } = makeQuery({
  queryKey: analyticsQueryKeys.recentPayments(),
  queryFn: getRecentPayments,
})
