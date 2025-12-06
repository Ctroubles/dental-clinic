"use client"

import { IconTrendingUp } from "@tabler/icons-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/app/_components/ui/chart"

// Datos de visitas mensuales de los últimos 6 meses
const chartData = [
  { month: "Jun", visits: 95 },
  { month: "Jul", visits: 108 },
  { month: "Ago", visits: 118 },
  { month: "Sep", visits: 125 },
  { month: "Oct", visits: 132 },
  { month: "Nov", visits: 145 },
]

const chartConfig = {
  visits: {
    label: "Visitas",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function AreaGraph() {
  const totalVisits = chartData.reduce((acc, curr) => acc + curr.visits, 0)
  const avgVisits = Math.round(totalVisits / chartData.length)
  const lastMonth = chartData[chartData.length - 1]
  const previousMonth = chartData[chartData.length - 2]
  const growthPercentage = Math.round(
    ((lastMonth.visits - previousMonth.visits) / previousMonth.visits) * 100
  )

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Visitas Mensuales</CardTitle>
        <CardDescription>
          Evolución de visitas en los últimos 6 meses
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart
            data={chartData}
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
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDecimals={false}
              label={{
                value: "Visitas",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                style: { fill: "#888", fontSize: 13 },
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={value => [`${value} visitas`, "Total"]}
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
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Crecimiento de {growthPercentage}% en el último mes
              <IconTrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Promedio mensual: {avgVisits} visitas | Total: {totalVisits}{" "}
              visitas
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
