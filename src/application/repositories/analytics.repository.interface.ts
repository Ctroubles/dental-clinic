export interface AnalyticsOverview {
  revenueMonth: number
  revenueChangePercent: number
  newPatientsMonth: number
  newPatientsChangePercent: number
  visitsMonth: number
  visitsChangePercent: number
  accountsReceivableMonth: number
  accountsReceivableChangePercent: number
}

export interface DailyRevenue {
  date: string
  revenue: number
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

export interface IAnalyticsRepository {
  getOverview(): Promise<AnalyticsOverview>
  getDailyRevenue(from: Date, to: Date): Promise<DailyRevenue[]>
  getMonthlyVisits(months: number): Promise<MonthlyVisit[]>
  getTopServices(limit: number): Promise<TopService[]>
  getRecentPayments(limit: number): Promise<RecentPayment[]>
}
