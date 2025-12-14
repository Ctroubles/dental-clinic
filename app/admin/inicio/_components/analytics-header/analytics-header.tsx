"use client"

import { DateRangePicker } from "~/app/_components/ui/date-picker"
import { useAnalytics } from "../analytics-store"

export default function AnalyticsHeader() {
  const { dateRange, setDateRange } = useAnalytics()

  return (
    <header className="flex items-center justify-between space-y-2 mb-4">
      <h2 className="text-2xl font-bold tracking-tight mb-0">
        Hola, bienvenido de nuevo 👋
      </h2>
      <div className="flex items-center gap-2">
        <DateRangePicker
          initialDateFrom={dateRange.from}
          initialDateTo={dateRange.to}
          onUpdate={values => {
            setDateRange({
              from: values.range.from,
              to: values.range.to ?? values.range.from,
            })
          }}
          showCompare={false}
        />
      </div>
    </header>
  )
}
