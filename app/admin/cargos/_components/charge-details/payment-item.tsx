import { DollarSign } from "lucide-react"
import { Badge } from "~/app/_components/ui/badge"
import { PaymentMethod } from "@/domain/enums/payment-method.enum"

interface PaymentItemProps {
  amount: number
  method: PaymentMethod
  date: string
}
const paymentMethodLabels: Record<PaymentMethod, string> = {
  cash: "Efectivo",
  yape: "Yape",
  plin: "Plin",
  card: "Tarjeta",
  transfer: "Transferencia",
}

export function PaymentItem({ amount, method, date }: PaymentItemProps) {
  return (
    <div className="flex items-center justify-between rounded-md border bg-card/50 px-3 py-2">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/10">
          <DollarSign className="h-4 w-4 text-emerald-500" />
        </div>
        <div>
          <p className="font-semibold text-sm text-foreground/90">
            S/ {amount.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(date).toLocaleString("es-ES", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
      <Badge variant="secondary" className="text-xs">
        {paymentMethodLabels[method]}
      </Badge>
    </div>
  )
}
