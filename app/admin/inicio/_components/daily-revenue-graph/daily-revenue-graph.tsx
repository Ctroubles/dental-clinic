"use client"

import * as React from "react"
import { format, parse } from "date-fns"
import { es } from "date-fns/locale"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
import { useDailyRevenue } from "@/features/analytics/hooks/api/queries"
import { useAnalytics } from "../analytics-store"
import { BarGraphSkeleton } from "./bar-graph-skeleton"

export const description = "Gráfico de ingresos diarios"

const chartConfig = {
  revenue: {
    label: "Ingresos",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function DailyRevenueGraph() {
  const { dateRange } = useAnalytics()
  const { data: dailyRevenue, isLoading } = useDailyRevenue(dateRange)

  const total = React.useMemo(
    () => ({
      revenue: dailyRevenue?.reduce((acc, curr) => acc + curr.revenue, 0) || 0,
    }),
    [dailyRevenue]
  )

  if (isLoading) {
    return <BarGraphSkeleton />
  }

  return (
    <Card className="@container/card pt-3!">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-0!">
          <CardTitle>Ingresos Diarios</CardTitle>
          <CardDescription>
            <span className="hidden @[540px]/card:block">
              Evolución de ingresos diarios en el período
            </span>
            <span className="@[540px]/card:hidden">Por día</span>
          </CardDescription>
        </div>
        <div className="flex">
          <div className="relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-t-0 sm:border-l sm:px-8 sm:py-6">
            <span className="text-muted-foreground text-xs">
              Total del período
            </span>
            <span className="text-lg leading-none font-bold sm:text-3xl text-primary">
              S/ {total.revenue.toLocaleString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            data={dailyRevenue}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
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
              tickFormatter={value => `S/ ${value}`}
              // label={{
              //   value: "Ingresos en soles.",
              //   angle: -90,
              //   position: "insideLeft",
              //   offset: -10,
              //   style: { fill: "#888", fontSize: 13 },
              // }}
            />
            <ChartTooltip
              cursor={{ fill: "var(--primary)", opacity: 0.1 }}
              content={
                <ChartTooltipContent
                  className="w-[180px]"
                  labelFormatter={value => {
                    const date = parse(value, "yyyy-MM-dd", new Date())
                    const text = format(date, "EEEE d 'de' MMMM 'de' yyyy", {
                      locale: es,
                    })
                    return text.charAt(0).toUpperCase() + text.slice(1)
                  }}
                  formatter={value => [`S/ ${value}`]}
                />
              }
            />
            <Bar
              dataKey="revenue"
              fill="var(--color-revenue)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
