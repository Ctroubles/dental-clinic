export interface AnalyticsOverview {
  revenue: number
  revenueChangePercent: number
  newPatients: number
  newPatientsChangePercent: number
  visits: number
  visitsChangePercent: number
  accountsReceivable: number
  accountsReceivableChangePercent: number
}

export interface DailyRevenue {
  date: string
  revenue: number
}

export interface DailyVisit {
  date: string
  visits: number
}

export interface MonthlyVisit {
  month: string
  visits: number
}

export interface TopService {
  itemId: string
  serviceName: string
  count: number
  percentage: number
}

export interface RecentPayment {
  id: string
  patientName: string
  serviceName: string
  amount: number
  date: Date
  method: string
  paymentType: "Yape" | "Efectivo" | "Tarjeta" | "Transferencia"
  timeAgo: string
}

export interface DateRange {
  from: Date
  to: Date
}

export interface IAnalyticsRepository {
  getOverview(dateRange: DateRange): Promise<AnalyticsOverview>
  getDailyRevenue(dateRange: DateRange): Promise<DailyRevenue[]>
  getDailyVisits(dateRange: DateRange): Promise<DailyVisit[]>
  getMonthlyVisits(dateRange: DateRange): Promise<MonthlyVisit[]>
  getTopServices(dateRange: DateRange, limit: number): Promise<TopService[]>
  getRecentPayments(
    dateRange: DateRange,
    limit: number
  ): Promise<RecentPayment[]>
}
