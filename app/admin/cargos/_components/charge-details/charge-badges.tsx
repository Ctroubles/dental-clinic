import { Badge } from "~/app/_components/ui/badge"
import {
  formatPaymentStatus,
  getChargeProgressStatusLabel,
  getPaymentStatusColor,
  getProgressStatusColor,
} from "@/features/cargos/helpers/cargo-format"
import { TrackedCharge } from "@/domain/entities/tracked-charge"

interface ChargeBadgesProps {
  paymentStatus: TrackedCharge["paymentStatus"]
  progressStatus: TrackedCharge["progressStatus"]
}

export function ChargeBadges({
  paymentStatus,
  progressStatus,
}: ChargeBadgesProps) {
  return (
    <div className="flex gap-2">
      <Badge className={getPaymentStatusColor(paymentStatus)}>
        {formatPaymentStatus(paymentStatus)}
      </Badge>
      <Badge className={getProgressStatusColor(progressStatus)}>
        {getChargeProgressStatusLabel(progressStatus)}
      </Badge>
    </div>
  )
}
