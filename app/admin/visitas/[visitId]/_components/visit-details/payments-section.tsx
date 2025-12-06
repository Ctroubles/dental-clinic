"use client"

import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ExternalLink } from "lucide-react"
import { Badge } from "~/app/_components/ui/badge"
import { Button } from "~/app/_components/ui/button"
import { Card } from "~/app/_components/ui/card"
import { formatCurrency } from "@/features/cargos"
import { Payment, Visit } from "@/domain/entities"

interface PaymentsSectionProps {
  payments: Visit["payments"]
  charges: Visit["charges"]
}

export function PaymentsSection({ payments, charges }: PaymentsSectionProps) {
  const getMethodLabel = (method: Payment["method"]) => {
    const labels: Record<Payment["method"], string> = {
      cash: "Efectivo",
      card: "Tarjeta",
      transfer: "Transferencia",
      plin: "Plin",
      yape: "Yape",
    }
    return labels[method] || method
  }

  const getMethodColor = (method: Payment["method"]) => {
    const colorMap: Record<Payment["method"], string> = {
      cash: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
      card: "bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300",
      transfer:
        "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400",
      plin: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
      yape: "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400",
    }

    return colorMap[method] || "bg-muted text-muted-foreground"
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Pagos registrados
      </h2>

      {payments?.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No hay pagos registrados.
        </p>
      ) : (
        <div className="space-y-4">
          {payments?.map(payment => {
            const charge = charges?.find(c => c.id === payment.chargeId)

            return (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-foreground">
                    {charge?.description || "Pago sin cargo"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(
                      new Date(payment.date),
                      "d 'de' MMMM 'de' yyyy 'a las' HH:mm",
                      { locale: es }
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-lg font-bold text-accent-foreground">
                    {formatCurrency(payment.amount)}
                  </p>
                  <Badge className={getMethodColor(payment.method)}>
                    {getMethodLabel(payment.method)}
                  </Badge>
                  {/* <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/payments/${payment.id}`)}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button> */}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
