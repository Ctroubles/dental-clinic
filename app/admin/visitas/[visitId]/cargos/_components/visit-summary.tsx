"use client"

import { useMemo } from "react"
import { Button } from "~/app/_components/ui/button"
import { useVisitStore } from "@/features/cargos/hooks/use-visit-store"

interface VisitSummaryProps {
  onRegisterPayments: () => void
}

export function VisitSummary({ onRegisterPayments }: VisitSummaryProps) {
  const { charges, autoCalculatePaymentsToday } = useVisitStore()

  const subtotal = useMemo(
    () => charges.reduce((sum, charge) => sum + (charge.totalPrice || 0), 0),
    [charges]
  )
  const paymentsToday = useMemo(
    () => charges.reduce((sum, charge) => sum + (charge.paidNow || 0), 0),
    [charges]
  )
  const paidAccumulated = useMemo(
    () => charges.reduce((sum, charge) => sum + (charge.paidAmount || 0), 0),
    [charges]
  )

  const estimatedBalance = useMemo(
    () => subtotal - paidAccumulated - paymentsToday,
    [subtotal, paidAccumulated, paymentsToday]
  )

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4 text-sm">
        <section className="bg-muted p-2 rounded">
          <p className="text-muted-foreground text-xs mb-1">Subtotal</p>
          <p className="text-lg font-bold text-foreground">
            ${subtotal.toLocaleString()}
          </p>
        </section>
        <section className="bg-muted p-2 rounded">
          <p className="text-muted-foreground text-xs mb-1">Pagado Acumulado</p>
          <p className="text-lg font-bold text-foreground">
            ${paidAccumulated.toLocaleString()}
          </p>
        </section>
        <section className="bg-muted p-2 rounded">
          <p className="text-muted-foreground text-xs mb-1">Pagos Hoy</p>
          {/* <p className="text-lg font-bold text-primary">
            ${paymentsToday.toLocaleString()}
          </p> */}
          <input
            type="number"
            value={String(paymentsToday) ?? ""}
            onChange={e => {
              const value = e.target.value.trim()
              const numberValue = Number(value === "" ? 0 : value)
              autoCalculatePaymentsToday(numberValue)
            }}
            className="text-sm border-none bg-transparent outline-none w-full"
          />
        </section>
        <section className="bg-primary/10 p-2 rounded border border-primary/20">
          <p className="text-muted-foreground text-xs mb-1">Saldo Estimado</p>
          <p className="text-lg font-bold text-primary">
            ${estimatedBalance.toLocaleString()}
          </p>
        </section>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onRegisterPayments}
          disabled={charges.length === 0}
          className="flex-1"
        >
          Registrar Pagos y Continuar
        </Button>
        {/* <Button
          variant="outline"
          onClick={handleGenerateInvoice}
          disabled={charges.length === 0}
          className="gap-2 bg-transparent"
        >
          <FileText className="h-4 w-4" />
          Generar Factura
        </Button> */}
      </div>
    </div>
  )
}
