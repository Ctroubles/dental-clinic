import { apiFetch } from "~/lib/api"
import {
  AnalyticsOverview,
  DailyRevenue,
  DailyVisit,
  DateRange,
  MonthlyVisit,
  RecentPayment,
  TopService,
} from "@/application/repositories/analytics.repository.interface"

const FEATURE_PREFIX = "/analytics"

const buildDateParams = (dateRange: DateRange) =>
  `from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}`

export const getAnalyticsOverview = async (dateRange: DateRange) => {
  const response = await apiFetch<AnalyticsOverview>(
    `${FEATURE_PREFIX}/overview?${buildDateParams(dateRange)}`
  )
  return response
}

export const getDailyRevenue = async (dateRange: DateRange) => {
  const response = await apiFetch<DailyRevenue[]>(
    `${FEATURE_PREFIX}/daily-revenue?${buildDateParams(dateRange)}`
  )
  return response
}

export const getDailyVisits = async (dateRange: DateRange) => {
  const response = await apiFetch<DailyVisit[]>(
    `${FEATURE_PREFIX}/daily-visits?${buildDateParams(dateRange)}`
  )
  return response
}

export const getMonthlyVisits = async (dateRange: DateRange) => {
  const response = await apiFetch<MonthlyVisit[]>(
    `${FEATURE_PREFIX}/monthly-visits?${buildDateParams(dateRange)}`
  )
  return response
}

export const getTopServices = async (dateRange: DateRange) => {
  const response = await apiFetch<TopService[]>(
    `${FEATURE_PREFIX}/top-services?${buildDateParams(dateRange)}`
  )
  return response
}

export const getRecentPayments = async (dateRange: DateRange) => {
  const response = await apiFetch<RecentPayment[]>(
    `${FEATURE_PREFIX}/recent-payments?${buildDateParams(dateRange)}`
  )
  return response
}
