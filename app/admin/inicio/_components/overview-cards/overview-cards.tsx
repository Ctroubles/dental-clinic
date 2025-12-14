"use client"

import { useMemo } from "react"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "~/app/_components/ui/badge"
import { Card, CardContent, CardHeader } from "~/app/_components/ui/card"
import { useAnalyticsOverview } from "@/features/analytics/hooks/api/queries"
import { useAnalytics } from "../analytics-store"
import { OverviewCardsSkeleton } from "./overview-cards-skeleton"

export function OverviewCards() {
  const { dateRange } = useAnalytics()
  const { data, isLoading } = useAnalyticsOverview(dateRange)

  const overview = useMemo(
    () =>
      data || {
        revenue: 0,
        revenueChangePercent: 0,
        newPatients: 0,
        newPatientsChangePercent: 0,
        visits: 0,
        visitsChangePercent: 0,
        accountsReceivable: 0,
        accountsReceivableChangePercent: 0,
      },
    [data]
  )

  if (isLoading) {
    return <OverviewCardsSkeleton />
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4 mb-4">
      {/* 1. Revenue */}
      <Card className="@container/card gap-0">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-base font-medium text-muted-foreground">
            <span role="img" aria-label="Ingresos">
              💰
            </span>
            Ingresos
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-1 pb-2">
          <span className="text-4xl font-bold text-foreground">
            S/ {overview.revenue.toLocaleString()}
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
            {overview.revenueChangePercent}% vs período anterior
          </Badge>
          <span className="text-sm text-muted-foreground mt-2">
            Total de pagos recibidos
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
            {overview.newPatients}
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
            {overview.newPatientsChangePercent}% vs período anterior
          </Badge>
          <span className="text-sm text-muted-foreground mt-2">
            Registrados en el período
          </span>
        </CardContent>
      </Card>

      {/* 3. Visits */}
      <Card className="@container/card gap-0">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-base font-medium text-muted-foreground">
            <span role="img" aria-label="Visitas">
              🦷
            </span>
            Visitas
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-1 pb-2">
          <span className="text-4xl font-bold text-foreground">
            {overview.visits}
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
            {overview.visitsChangePercent}% vs período anterior
          </Badge>
          <span className="text-sm text-muted-foreground mt-2">
            Total de visitas registradas
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
            S/ {overview.accountsReceivable.toLocaleString()}
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
            {overview.accountsReceivableChangePercent}% vs período anterior
          </Badge>
          <span className="text-sm text-muted-foreground mt-2">
            Cargos pendientes de pago
          </span>
        </CardContent>
      </Card>
    </div>
  )
}
