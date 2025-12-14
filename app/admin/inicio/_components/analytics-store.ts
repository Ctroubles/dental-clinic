import { subMonths } from "date-fns"
import { create } from "zustand"

interface DateRange {
  from: Date
  to: Date
}

interface AnalyticsStore {
  dateRange: DateRange
  setDateRange: (range: DateRange) => void
}

export const useAnalytics = create<AnalyticsStore>(set => ({
  dateRange: {
    from: subMonths(new Date(), 1),
    to: new Date(),
  },
  setDateRange: dateRange => set({ dateRange }),
}))
