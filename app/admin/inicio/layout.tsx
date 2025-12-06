import React from "react"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import PageContainer from "~/app/_components/layout/page-container"
import { Badge } from "~/app/_components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card"

export default function OverViewLayout({
  sales,
  // eslint-disable-next-line camelcase
  pie_stats,
  // eslint-disable-next-line camelcase
  bar_stats,
  // eslint-disable-next-line camelcase
  area_stats,
}: {
  sales: React.ReactNode
  pie_stats: React.ReactNode
  bar_stats: React.ReactNode
  area_stats: React.ReactNode
}) {
  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-2 pb-5">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Hola, bienvenido de nuevo 👋
          </h2>
        </div>

        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4">
          {/* 1. Ingresos del Mes */}
          <Card className="@container/card gap-0">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-base font-medium text-muted-foreground">
                <span role="img" aria-label="Ingresos">
                  💰
                </span>
                Ingresos del Mes
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-start gap-1 pb-2">
              <span className="text-4xl font-bold text-foreground">
                S/ 18,450
              </span>
              <Badge
                variant="outline"
                className="mt-1 flex items-center gap-1 text-xs px-2 py-0.5"
              >
                <IconTrendingUp className="h-3 w-3" />
                +15.2% vs mes anterior
              </Badge>
              <span className="text-sm text-muted-foreground mt-2">
                Total de pagos recibidos en noviembre
              </span>
            </CardContent>
          </Card>

          {/* 2. Pacientes Nuevos */}
          <Card className="@container/card gap-0">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-base font-medium text-muted-foreground">
                <span role="img" aria-label="Pacientes nuevos">
                  👥
                </span>
                Pacientes Nuevos
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-start gap-1 pb-2">
              <span className="text-4xl font-bold text-foreground">24</span>
              <Badge
                variant="outline"
                className="mt-1 flex items-center gap-1 text-xs px-2 py-0.5"
              >
                <IconTrendingUp className="h-3 w-3" />
                +8 más que octubre
              </Badge>
              <span className="text-sm text-muted-foreground mt-2">
                Registrados en noviembre
              </span>
            </CardContent>
          </Card>

          {/* 3. Visitas del Mes */}
          <Card className="@container/card gap-0">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-base font-medium text-muted-foreground">
                <span role="img" aria-label="Visitas del mes">
                  🦷
                </span>
                Visitas del Mes
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-start gap-1 pb-2">
              <span className="text-4xl font-bold text-foreground">145</span>
              <Badge
                variant="outline"
                className="mt-1 flex items-center gap-1 text-xs px-2 py-0.5"
              >
                <IconTrendingUp className="h-3 w-3" />
                +9.8% vs mes anterior
              </Badge>
              <span className="text-sm text-muted-foreground mt-2">
                Total de visitas registradas en noviembre
              </span>
            </CardContent>
          </Card>

          {/* 4. Cuentas por Cobrar */}
          <Card className="@container/card gap-0">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-base font-medium text-muted-foreground">
                <span role="img" aria-label="Cuentas por cobrar">
                  📊
                </span>
                Cuentas por Cobrar
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-start gap-1 pb-2">
              <span className="text-4xl font-bold text-foreground">
                S/ 5,280
              </span>
              <Badge
                variant="outline"
                className="mt-1 flex items-center gap-1 text-xs px-2 py-0.5"
              >
                <IconTrendingDown className="h-3 w-3" />
                -12% vs mes anterior
              </Badge>
              <span className="text-sm text-muted-foreground mt-2">
                Cargos pendientes de pago
              </span>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* eslint-disable-next-line camelcase */}
          <div className="col-span-4">{bar_stats}</div>
          <div className="col-span-4 md:col-span-3">
            {/* sales parallel routes */}
            {sales}
          </div>
          {/* eslint-disable-next-line camelcase */}
          <div className="col-span-4">{area_stats}</div>
          {/* eslint-disable-next-line camelcase */}
          <div className="col-span-4 md:col-span-3">{pie_stats}</div>
        </div>
      </div>
    </PageContainer>
  )
}
