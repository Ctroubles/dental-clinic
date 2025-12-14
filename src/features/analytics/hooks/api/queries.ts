import { makeQuery } from "~/lib/api/queryFactory"
import {
  AnalyticsOverview,
  DailyRevenue,
  DailyVisit,
  DateRange,
  MonthlyVisit,
  RecentPayment,
  TopService,
} from "@/application/repositories/analytics.repository.interface"
import { analyticsQueryKeys } from "../../constants"
import {
  getAnalyticsOverview,
  getDailyRevenue,
  getDailyVisits,
  getMonthlyVisits,
  getRecentPayments,
  getTopServices,
} from "../../request"

export const { useHook: useAnalyticsOverview } = makeQuery<
  DateRange,
  AnalyticsOverview
>(dateRange => ({
  queryKey: analyticsQueryKeys.overview(dateRange),
  queryFn: () => getAnalyticsOverview(dateRange),
}))

export const { useHook: useDailyRevenue } = makeQuery<
  DateRange,
  DailyRevenue[]
>(dateRange => ({
  queryKey: analyticsQueryKeys.dailyRevenue(dateRange),
  queryFn: () => getDailyRevenue(dateRange),
}))

export const { useHook: useDailyVisits } = makeQuery<DateRange, DailyVisit[]>(
  dateRange => ({
    queryKey: analyticsQueryKeys.dailyVisits(dateRange),
    queryFn: () => getDailyVisits(dateRange),
  })
)

export const { useHook: useMonthlyVisits } = makeQuery<
  DateRange,
  MonthlyVisit[]
>(dateRange => ({
  queryKey: analyticsQueryKeys.monthlyVisits(dateRange),
  queryFn: () => getMonthlyVisits(dateRange),
}))

export const { useHook: useTopServices } = makeQuery<DateRange, TopService[]>(
  dateRange => ({
    queryKey: analyticsQueryKeys.topServices(dateRange),
    queryFn: () => getTopServices(dateRange),
  })
)

export const { useHook: useRecentPayments } = makeQuery<
  DateRange,
  RecentPayment[]
>(dateRange => ({
  queryKey: analyticsQueryKeys.recentPayments(dateRange),
  queryFn: () => getRecentPayments(dateRange),
}))
