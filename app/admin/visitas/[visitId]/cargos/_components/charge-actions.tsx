import { Copy, MessageSquare, Trash2 } from "lucide-react"
import { Badge } from "~/app/_components/ui/badge"
import { Button } from "~/app/_components/ui/button"
import { ChargeProgressStatus } from "@/domain/enums"

interface ChargeActionsProps {
  chargeId: string
  mode: "new" | "existing"
  progressStatus: ChargeProgressStatus
  totalPrice: number | null
  paidAmount: number | null
  paidNow: number | null
  onNotesClick: () => void
  onDuplicate: () => void
  onRemove: () => void
}

export function ChargeActions({
  mode,
  progressStatus,
  totalPrice,
  paidAmount,
  paidNow,
  onNotesClick,
  onDuplicate,
  onRemove,
}: ChargeActionsProps) {
  const getPaymentStatus = () => {
    const total = totalPrice ?? 0
    const paid = (paidAmount ?? 0) + (paidNow ?? 0)
    if (paid >= total) return "Pagado"
    if (paid > 0) return "Pago Parcial"
    return "Sin Pagar"
  }

  const getProgressStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      IN_PROGRESS: "bg-blue-100 text-blue-800",
      COMPLETED: "bg-green-100 text-green-800",
      ON_HOLD: "bg-yellow-100 text-yellow-800",
      CANCELLED: "bg-red-100 text-red-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getChargeBadge = () => {
    if (mode === "existing") {
      return (
        <Badge
          variant="outline"
          className="bg-purple-50 text-purple-700 border-purple-200"
        >
          Pendiente
        </Badge>
      )
    }
    return (
      <Badge className={getProgressStatusColor(progressStatus)}>
        {getPaymentStatus()}
      </Badge>
    )
  }

  return (
    <div className="flex items-center justify-between">
      {getChargeBadge()}
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={onNotesClick}>
          <MessageSquare className="h-4 w-4" />
        </Button>
        {mode === "new" && (
          <Button size="sm" variant="ghost" onClick={onDuplicate}>
            <Copy className="h-4 w-4" />
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={onRemove}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  )
}
