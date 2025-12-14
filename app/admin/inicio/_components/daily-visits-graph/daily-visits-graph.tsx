"use client"

import { useMemo } from "react"
import { differenceInDays, format, parse } from "date-fns"
import { es } from "date-fns/locale"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/app/_components/ui/chart"
import { useDailyVisits } from "@/features/analytics/hooks/api/queries"
import { useAnalytics } from "../analytics-store"
import { AreaGraphSkeleton } from "./area-graph-skeleton"

const chartConfig = {
  visits: {
    label: "Visitas",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function AreaGraph() {
  const { dateRange } = useAnalytics()
  const { data, isLoading } = useDailyVisits(dateRange)

  const { visitsData, totalVisits, avgVisits } = useMemo(() => {
    const visitsData = data || []
    // +1 to include both boundary dates (inclusive range)
    const totalDays = differenceInDays(dateRange.to, dateRange.from) + 1
    const totalVisits = visitsData.reduce((acc, curr) => acc + curr.visits, 0)
    const avgVisits =
      totalDays > 0 ? (totalVisits / totalDays).toFixed(1) : "0.0"

    return { visitsData, totalVisits, avgVisits }
  }, [data, dateRange])

  if (isLoading) {
    return <AreaGraphSkeleton />
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Visitas Diarias</CardTitle>
        <CardDescription>Evolución de visitas en el período</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart
            data={visitsData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <defs>
              <linearGradient id="fillVisits" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--primary)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--primary)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={value => {
                const date = parse(value, "yyyy-MM-dd", new Date())
                return format(date, "EEE d/M", { locale: es })
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDecimals={false}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={value => {
                    const date = parse(value, "yyyy-MM-dd", new Date())
                    const text = format(date, "EEE d 'de' MMMM 'de' yyyy", {
                      locale: es,
                    })
                    return text.charAt(0).toUpperCase() + text.slice(1)
                  }}
                  formatter={value => [`${value} visitas`]}
                />
              }
            />
            <Area
              dataKey="visits"
              type="monotone"
              fill="url(#fillVisits)"
              stroke="var(--color-visits)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <div className="px-6 pb-4 text-sm text-muted-foreground">
        Promedio: {avgVisits} visitas/día | Total: {totalVisits} visitas
      </div>
    </Card>
  )
}
