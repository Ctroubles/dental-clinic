"use client"

import { Card } from "~/app/_components/ui/card"
import { Progress } from "~/app/_components/ui/progress"
import { formatCurrency } from "@/features/payments/helpers"
import { Visit } from "@/domain/entities"

interface FinancialSummaryProps {
  charges: Visit["charges"]
  payments: Visit["payments"]
}

export function FinancialSummary({ charges, payments }: FinancialSummaryProps) {
  const totalVisitPaid = payments?.reduce((sum, p) => sum + p.amount, 0) ?? 0

  const totalCharges = charges?.reduce((sum, c) => sum + c.totalPrice, 0) ?? 0

  const totalAccumulatedPaid =
    charges?.reduce((sum, c) => sum + c.paidAmount, 0) ?? 0

  const totalBalance = totalCharges - totalAccumulatedPaid

  const paymentPercentage =
    totalCharges > 0 ? (totalAccumulatedPaid / totalCharges) * 100 : 0

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="space-y-6">
          {/* Total Charged */}
          <div className="">
            <p className="text-sm font-bold uppercase tracking-wide mb-1">
              Total pagado en la visita
            </p>
            <p className="text-4xl font-bold text-green-500">
              {formatCurrency(totalVisitPaid)}
            </p>
          </div>

          {/* Total Paid */}
          <div className="p-4 rounded-lg border border-accent">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Total de cargos relacionados
            </p>
            <p className="text-xl font-bold text-muted-foreground">
              {formatCurrency(totalCharges)}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {paymentPercentage.toFixed(1)}% del total
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Progreso de pago de cargos
              </span>
              <span className="font-semibold text-foreground">
                {paymentPercentage.toFixed(0)}%
              </span>
            </div>
            <Progress value={paymentPercentage} className="h-2" />
          </div>

          {/* Balance */}
          <div className={`p-4 rounded-lg border border-accent`}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Saldo Pendiente de cargos
            </p>
            <p className={`text-xl font-bold text-muted-foreground`}>
              {formatCurrency(totalBalance)}
            </p>
          </div>

          {/* Payment Summary */}
          <div className="pt-4 border-t border-border space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cargos totales</span>
              <span className="font-semibold">{charges?.length ?? 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Pagos registrados</span>
              <span className="font-semibold">{payments?.length ?? 0}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
