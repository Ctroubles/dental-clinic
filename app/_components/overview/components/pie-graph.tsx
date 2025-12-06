"use client"

import * as React from "react"
import { IconTrendingUp } from "@tabler/icons-react"
import { Label, Pie, PieChart } from "recharts"
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
} from "~/app/_components/ui/chart"

// Distribución de servicios odontológicos
const chartData = [
  {
    service: "cleaning",
    label: "Limpieza dental",
    count: 54,
    fill: "var(--primary)",
  },
  {
    service: "filling",
    label: "Empastes",
    count: 34,
    fill: "var(--primary)",
  },
  {
    service: "extraction",
    label: "Extracciones",
    count: 18,
    fill: "var(--primary)",
  },
  {
    service: "orthodontics",
    label: "Ortodoncia",
    count: 14,
    fill: "var(--primary)",
  },
]

const chartConfig = {
  count: {
    label: "Servicios",
  },
  cleaning: {
    label: "Limpieza dental",
    color: "var(--primary)",
  },
  filling: {
    label: "Empastes",
    color: "hsl(var(--chart-2))",
  },
  extraction: {
    label: "Extracciones",
    color: "hsl(var(--chart-3))",
  },
  orthodontics: {
    label: "Ortodoncia",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function PieGraph() {
  const totalServices = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0)
  }, [])

  // Encontrar el servicio más solicitado
  const leadingService = chartData.reduce((a, b) => (a.count > b.count ? a : b))
  const leadingPercentage = Math.round(
    (leadingService.count / totalServices) * 100
  )

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Servicios Más Solicitados</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Distribución de servicios odontológicos este mes
          </span>
          <span className="@[540px]/card:hidden">Servicios del mes</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[250px]"
        >
          <PieChart>
            <defs>
              {chartData.map((item, index) => (
                <linearGradient
                  key={item.service}
                  id={`fill${item.service}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--primary)"
                    stopOpacity={1 - index * 0.15}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--primary)"
                    stopOpacity={0.8 - index * 0.15}
                  />
                </linearGradient>
              ))}
            </defs>
            <ChartTooltip
              cursor={false}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              content={({ active, payload }: any) => {
                if (active && payload && payload.length) {
                  const entry = payload[0].payload
                  const percent = Math.round(
                    (entry.count / totalServices) * 100
                  )
                  return (
                    <div className="rounded-md bg-background p-3 shadow-md border text-xs">
                      <div className="font-medium mb-1">{entry.label}</div>
                      <div className="flex justify-between">
                        <span>Servicios</span>
                        <span className="font-bold">{entry.count}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Porcentaje:&nbsp;</span>
                        <span>{percent}%</span>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Pie
              data={chartData.map(item => ({
                ...item,
                fill: `url(#fill${item.service})`,
              }))}
              dataKey="count"
              nameKey="label"
              innerRadius={60}
              strokeWidth={2}
              stroke="var(--background)"
              labelLine={false}
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                percent,
              }) => {
                if (percent * 100 < 5) return null
                const RADIAN = Math.PI / 180
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5
                const x = cx + radius * Math.cos(-midAngle * RADIAN)
                const y = cy + radius * Math.sin(-midAngle * RADIAN)
                return (
                  <g>
                    <text
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="1.1em"
                      fontWeight="bold"
                      fill="var(--background)"
                      style={{ textShadow: "0 1px 4px rgba(0,0,0,0.25)" }}
                    >
                      {`${Math.round(percent * 100)}%`}
                    </text>
                  </g>
                )
              }}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="text-3xl font-bold fill-foreground"
                        >
                          {totalServices.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="text-sm fill-muted-foreground"
                        >
                          Servicios
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {leadingService.label} es el servicio más solicitado con{" "}
          {leadingPercentage}%
          <IconTrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Datos del mes actual
        </div>
      </CardFooter>
    </Card>
  )
}
