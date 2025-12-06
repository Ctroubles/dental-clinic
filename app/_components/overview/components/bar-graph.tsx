"use client"

import * as React from "react"
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

export const description = "Gráfico de ingresos diarios"

// Datos de ejemplo: ingresos diarios de los últimos 30 días
const chartData = [
  { date: "2025-11-01", revenue: 580 },
  { date: "2025-11-02", revenue: 420 },
  { date: "2025-11-03", revenue: 650 },
  { date: "2025-11-04", revenue: 720 },
  { date: "2025-11-05", revenue: 490 },
  { date: "2025-11-06", revenue: 550 },
  { date: "2025-11-07", revenue: 680 },
  { date: "2025-11-08", revenue: 730 },
  { date: "2025-11-09", revenue: 410 },
  { date: "2025-11-10", revenue: 590 },
  { date: "2025-11-11", revenue: 820 },
  { date: "2025-11-12", revenue: 670 },
  { date: "2025-11-13", revenue: 540 },
  { date: "2025-11-14", revenue: 710 },
  { date: "2025-11-15", revenue: 780 },
  { date: "2025-11-16", revenue: 450 },
  { date: "2025-11-17", revenue: 620 },
  { date: "2025-11-18", revenue: 850 },
  { date: "2025-11-19", revenue: 690 },
  { date: "2025-11-20", revenue: 570 },
  { date: "2025-11-21", revenue: 640 },
  { date: "2025-11-22", revenue: 750 },
  { date: "2025-11-23", revenue: 480 },
  { date: "2025-11-24", revenue: 610 },
  { date: "2025-11-25", revenue: 720 },
  { date: "2025-11-26", revenue: 680 },
  { date: "2025-11-27", revenue: 590 },
  { date: "2025-11-28", revenue: 740 },
  { date: "2025-11-29", revenue: 820 },
  { date: "2025-11-30", revenue: 650 },
]

const chartConfig = {
  revenue: {
    label: "Ingresos",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function BarGraph() {
  const total = React.useMemo(
    () => ({
      revenue: chartData.reduce((acc, curr) => acc + curr.revenue, 0),
    }),
    []
  )

  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <Card className="@container/card !pt-3">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 !py-0">
          <CardTitle>Ingresos Diarios</CardTitle>
          <CardDescription>
            <span className="hidden @[540px]/card:block">
              Evolución de ingresos diarios en noviembre 2025
            </span>
            <span className="@[540px]/card:hidden">Noviembre 2025</span>
          </CardDescription>
        </div>
        <div className="flex">
          <div className="relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-t-0 sm:border-l sm:px-8 sm:py-6">
            <span className="text-muted-foreground text-xs">Total del mes</span>
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
            data={chartData}
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
                const date = new Date(value)
                return date.toLocaleDateString("es-PE", {
                  day: "numeric",
                  month: "short",
                })
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={value => `S/ ${value}`}
              label={{
                value: "Ingresos (S/)",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                style: { fill: "#888", fontSize: 13 },
              }}
            />
            <ChartTooltip
              cursor={{ fill: "var(--primary)", opacity: 0.1 }}
              content={
                <ChartTooltipContent
                  className="w-[180px]"
                  labelFormatter={value => {
                    const date = new Date(value)
                    return date.toLocaleDateString("es-PE", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  }}
                  formatter={value => [`S/ ${value}`, "Ingresos"]}
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
