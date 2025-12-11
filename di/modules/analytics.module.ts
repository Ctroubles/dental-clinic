import { createModule } from "@evyweb/ioctopus"
import { getAnalyticsOverviewUseCase } from "@/application/use-cases/analytics/get-analytics-overview.use-case"
import { getDailyRevenueUseCase } from "@/application/use-cases/analytics/get-daily-revenue.use-case"
import { getMonthlyVisitsUseCase } from "@/application/use-cases/analytics/get-monthly-visits.use-case"
import { getRecentPaymentsUseCase } from "@/application/use-cases/analytics/get-recent-payments.use-case"
import { getTopServicesUseCase } from "@/application/use-cases/analytics/get-top-services.use-case"
import { AnalyticsRepository } from "@/infrastructure/persistence/repositories/analytics.repository"
import { getAnalyticsOverviewController } from "@/interface-adapters/controllers/analytics/get-analytics-overview.controller"
import { getDailyRevenueController } from "@/interface-adapters/controllers/analytics/get-daily-revenue.controller"
import { getMonthlyVisitsController } from "@/interface-adapters/controllers/analytics/get-monthly-visits.controller"
import { getRecentPaymentsController } from "@/interface-adapters/controllers/analytics/get-recent-payments.controller"
import { getTopServicesController } from "@/interface-adapters/controllers/analytics/get-top-services.controller"
import { DI_SYMBOLS } from "../types"

export function createAnalyticsModule() {
  const analyticsModule = createModule()

  // Repositories
  analyticsModule
    .bind(DI_SYMBOLS.IAnalyticsRepository)
    .toClass(AnalyticsRepository)

  // Use Cases
  analyticsModule
    .bind(DI_SYMBOLS.IGetAnalyticsOverviewUseCase)
    .toHigherOrderFunction(getAnalyticsOverviewUseCase, [
      DI_SYMBOLS.IAnalyticsRepository,
    ])

  analyticsModule
    .bind(DI_SYMBOLS.IGetDailyRevenueUseCase)
    .toHigherOrderFunction(getDailyRevenueUseCase, [
      DI_SYMBOLS.IAnalyticsRepository,
    ])

  analyticsModule
    .bind(DI_SYMBOLS.IGetMonthlyVisitsUseCase)
    .toHigherOrderFunction(getMonthlyVisitsUseCase, [
      DI_SYMBOLS.IAnalyticsRepository,
    ])

  analyticsModule
    .bind(DI_SYMBOLS.IGetTopServicesUseCase)
    .toHigherOrderFunction(getTopServicesUseCase, [
      DI_SYMBOLS.IAnalyticsRepository,
    ])

  analyticsModule
    .bind(DI_SYMBOLS.IGetRecentPaymentsUseCase)
    .toHigherOrderFunction(getRecentPaymentsUseCase, [
      DI_SYMBOLS.IAnalyticsRepository,
    ])

  // Controllers
  analyticsModule
    .bind(DI_SYMBOLS.IGetAnalyticsOverviewController)
    .toHigherOrderFunction(getAnalyticsOverviewController, [
      DI_SYMBOLS.IGetAnalyticsOverviewUseCase,
    ])

  analyticsModule
    .bind(DI_SYMBOLS.IGetDailyRevenueController)
    .toHigherOrderFunction(getDailyRevenueController, [
      DI_SYMBOLS.IGetDailyRevenueUseCase,
    ])

  analyticsModule
    .bind(DI_SYMBOLS.IGetMonthlyVisitsController)
    .toHigherOrderFunction(getMonthlyVisitsController, [
      DI_SYMBOLS.IGetMonthlyVisitsUseCase,
    ])

  analyticsModule
    .bind(DI_SYMBOLS.IGetTopServicesController)
    .toHigherOrderFunction(getTopServicesController, [
      DI_SYMBOLS.IGetTopServicesUseCase,
    ])

  analyticsModule
    .bind(DI_SYMBOLS.IGetRecentPaymentsController)
    .toHigherOrderFunction(getRecentPaymentsController, [
      DI_SYMBOLS.IGetRecentPaymentsUseCase,
    ])

  return analyticsModule
}
