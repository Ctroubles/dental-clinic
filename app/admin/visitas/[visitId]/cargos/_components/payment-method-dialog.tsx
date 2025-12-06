"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "~/app/_components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/app/_components/ui/dialog"
import { Label } from "~/app/_components/ui/label"
import { RadioGroup, RadioGroupItem } from "~/app/_components/ui/radio-group"
import { logger } from "~/config/logger"
import { useRegisterChargesForVisit } from "@/features/cargos"
import { cargosQueryKeys } from "@/features/cargos/constants"
import { useVisitStore } from "@/features/cargos/hooks/use-visit-store"
import { paymentQueryKeys } from "@/features/payments"
import { visitsQueryKeys } from "@/features/visits/constants"
import {
  ChargeLine,
  ExistingChargeLine,
  NewChargeLine,
} from "@/application/use-cases/visits/register-charges-for-visit"
import {
  PaymentMethod,
  PaymentMethodEnum,
} from "@/domain/enums/payment-method.enum"

interface PaymentMethodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Payment method labels mapping
const paymentMethodLabels: Record<PaymentMethod, string> = {
  cash: "Efectivo",
  yape: "Yape",
  plin: "Plin",
  card: "Tarjeta",
  transfer: "Transferencia",
}

export function PaymentMethodDialog({
  open,
  onOpenChange,
}: PaymentMethodDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash")
  const { charges, visit } = useVisitStore()
  const router = useRouter()

  const totalPayments = charges.reduce(
    (sum, charge) => sum + (charge.paidNow ?? 0),
    0
  )

  const { mutateAsync: registerChargesForVisit, isPending } =
    useRegisterChargesForVisit()

  const handleConfirmPayment = async () => {
    const visitId = visit?.id
    if (!visitId) {
      return
    }

    const lines: ChargeLine[] = charges.map(c => {
      if (c.mode === "existing") {
        return {
          mode: "existing",
          trackedChargeId: c.trackedChargeId!,
          progressStatus: c.progressStatus,
          paidNow: c.paidNow || 0,
        } satisfies ExistingChargeLine
      }
      return {
        mode: "new",
        itemId: c.itemId!,
        type: c.type,
        description: c.description,
        quantity: c.quantity!,
        totalPrice: c.totalPrice,
        progressStatus: c.progressStatus,
        paidNow: c.paidNow || 0,
      } satisfies NewChargeLine
    })

    await registerChargesForVisit({
      visitId,
      lines,
      paymentMethod,
    })

    onOpenChange(false)
    router.push("/admin/cargos")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Visita y Pagos</DialogTitle>
          <DialogDescription>
            Selecciona el método de pago para registrar la visita y los pagos de
            hoy
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-muted p-4 rounded">
            <p className="text-sm text-muted-foreground mb-1">
              Total a Pagar Hoy
            </p>
            <p className="text-2xl font-bold text-foreground">
              ${totalPayments.toLocaleString()}
            </p>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-semibold">Método de Pago</Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={v => setPaymentMethod(v as PaymentMethod)}
            >
              {PaymentMethodEnum.options.map(method => (
                <div
                  key={method}
                  className="flex items-center space-x-2 p-3 border border-border rounded hover:bg-muted cursor-pointer"
                  onClick={() => setPaymentMethod(method)}
                >
                  <RadioGroupItem value={method} id={method.toLowerCase()} />
                  <Label className="flex-1 cursor-pointer">
                    {paymentMethodLabels[method]}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button onClick={handleConfirmPayment} disabled={isPending}>
            {isPending ? "Registrando..." : "Confirmar Pago"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
