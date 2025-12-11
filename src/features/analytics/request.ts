import { apiFetch } from "~/lib/api"
import {
  AnalyticsOverview,
  DailyRevenue,
  MonthlyVisit,
  RecentPayment,
  TopService,
} from "@/application/repositories/analytics.repository.interface"

const FEATURE_PREFIX = "/analytics"

export const getAnalyticsOverview = async () => {
  const response = await apiFetch<AnalyticsOverview>(
    `${FEATURE_PREFIX}/overview`
  )
  return response
}

export const getDailyRevenue = async ({
  from,
  to,
}: {
  from: Date
  to: Date
}) => {
  const response = await apiFetch<DailyRevenue[]>(
    `${FEATURE_PREFIX}/daily-revenue?from=${from.toISOString()}&to=${to.toISOString()}`
  )
  return response
}

export const getMonthlyVisits = async () => {
  const response = await apiFetch<MonthlyVisit[]>(
    `${FEATURE_PREFIX}/monthly-visits`
  )
  return response
}

export const getTopServices = async () => {
  const response = await apiFetch<TopService[]>(
    `${FEATURE_PREFIX}/top-services`
  )
  return response
}

export const getRecentPayments = async () => {
  const response = await apiFetch<RecentPayment[]>(
    `${FEATURE_PREFIX}/recent-payments`
  )
  return response
}
