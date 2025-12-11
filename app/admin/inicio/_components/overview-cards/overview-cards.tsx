"use client"

import { useMemo } from "react"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "~/app/_components/ui/badge"
import { Card, CardContent, CardHeader } from "~/app/_components/ui/card"
import { useAnalyticsOverview } from "@/features/analytics/hooks/api/queries"
import { OverviewCardsSkeleton } from "./overview-cards-skeleton"

export function OverviewCards() {
  const { data, isLoading } = useAnalyticsOverview()

  const overview = useMemo(
    () =>
      data || {
        revenueMonth: 0,
        revenueChangePercent: 0,
        newPatientsMonth: 0,
        newPatientsChangePercent: 0,
        visitsMonth: 0,
        visitsChangePercent: 0,
        accountsReceivableMonth: 0,
        accountsReceivableChangePercent: 0,
      },
    [data]
  )

  if (isLoading) {
    return <OverviewCardsSkeleton />
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4 mb-4">
      {/* 1. Monthly Revenue */}
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
            S/ {overview.revenueMonth.toLocaleString()}
          </span>
          <Badge
            variant="outline"
            className="mt-1 flex items-center gap-1 text-xs px-2 py-0.5"
          >
            {overview.revenueChangePercent >= 0 ? (
              <IconTrendingUp className="h-3 w-3" />
            ) : (
              <IconTrendingDown className="h-3 w-3" />
            )}
            {overview.revenueChangePercent > 0 ? "+" : ""}
            {overview.revenueChangePercent}% vs mes anterior
          </Badge>
          <span className="text-sm text-muted-foreground mt-2">
            Total de pagos recibidos este mes
          </span>
        </CardContent>
      </Card>

      {/* 2. New Patients */}
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
          <span className="text-4xl font-bold text-foreground">
            {overview.newPatientsMonth}
          </span>
          <Badge
            variant="outline"
            className="mt-1 flex items-center gap-1 text-xs px-2 py-0.5"
          >
            {overview.newPatientsChangePercent >= 0 ? (
              <IconTrendingUp className="h-3 w-3" />
            ) : (
              <IconTrendingDown className="h-3 w-3" />
            )}
            {overview.newPatientsChangePercent > 0 ? "+" : ""}
            {overview.newPatientsChangePercent}% vs mes anterior
          </Badge>
          <span className="text-sm text-muted-foreground mt-2">
            Registrados este mes
          </span>
        </CardContent>
      </Card>

      {/* 3. Monthly Visits */}
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
          <span className="text-4xl font-bold text-foreground">
            {overview.visitsMonth}
          </span>
          <Badge
            variant="outline"
            className="mt-1 flex items-center gap-1 text-xs px-2 py-0.5"
          >
            {overview.visitsChangePercent >= 0 ? (
              <IconTrendingUp className="h-3 w-3" />
            ) : (
              <IconTrendingDown className="h-3 w-3" />
            )}
            {overview.visitsChangePercent > 0 ? "+" : ""}
            {overview.visitsChangePercent}% vs mes anterior
          </Badge>
          <span className="text-sm text-muted-foreground mt-2">
            Total de visitas registradas este mes
          </span>
        </CardContent>
      </Card>

      {/* 4. Accounts Receivable */}
      <Card className="@container/card gap-0">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-base font-medium text-muted-foreground">
            <span role="img" aria-label="Cargos por cobrar">
              📊
            </span>
            Cuentas por Cobrar
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-1 pb-2">
          <span className="text-4xl font-bold text-foreground">
            S/ {overview.accountsReceivableMonth.toLocaleString()}
          </span>
          <Badge
            variant="outline"
            className="mt-1 flex items-center gap-1 text-xs px-2 py-0.5"
          >
            {overview.accountsReceivableChangePercent >= 0 ? (
              <IconTrendingUp className="h-3 w-3" />
            ) : (
              <IconTrendingDown className="h-3 w-3" />
            )}
            {overview.accountsReceivableChangePercent > 0 ? "+" : ""}
            {overview.accountsReceivableChangePercent}% vs mes anterior
          </Badge>
          <span className="text-sm text-muted-foreground mt-2">
            Cargos pendientes de pago
          </span>
        </CardContent>
      </Card>
    </div>
  )
}
