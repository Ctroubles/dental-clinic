import { Card } from "~/app/_components/ui/card"
import { Charge } from "@/features/cargos/hooks/use-visit-store"
import { ChargeActions } from "./charge-actions"
import { ChargeDescriptionField } from "./charge-description-field"
import { ChargePricingFields } from "./charge-pricing-fields"
import { ChargeProgressSelect } from "./charge-progress-select"

interface ChargeCardProps {
  charge: Charge
  onUpdateCharge: (chargeId: string, updates: Partial<Charge>) => void
  onRemoveCharge: (chargeId: string) => void
  onDuplicateCharge: (chargeId: string) => void
  onNotesClick: (chargeId: string) => void
}

export function ChargeCard({
  charge,
  onUpdateCharge,
  onRemoveCharge,
  onDuplicateCharge,
  onNotesClick,
}: ChargeCardProps) {
  const handleUpdateCharge = (updates: Partial<Charge>) => {
    onUpdateCharge(charge.id, updates)
  }

  return (
    <Card
      className={`p-4 ${charge.mode === "existing" ? "border-purple-500 bg-purple-50/10" : "bg-card/25"}`}
    >
      <div className="space-y-4">
        {/* Row 1: Description and Status */}
        <div className="flex items-start justify-between gap-4">
          <ChargeDescriptionField
            value={charge.description}
            onChange={value => handleUpdateCharge({ description: value })}
            disabled={charge.mode === "existing"}
          />
          <ChargeProgressSelect
            value={charge.progressStatus}
            onChange={value => handleUpdateCharge({ progressStatus: value })}
          />
        </div>

        {/* Row 2: Quantity, Prices */}
        <ChargePricingFields
          type={charge.type}
          quantity={charge.quantity}
          totalPrice={charge.totalPrice}
          paidAmount={charge.paidAmount}
          paidNow={charge.paidNow}
          onQuantityChange={quantity => handleUpdateCharge({ quantity })}
          onTotalPriceChange={totalPrice =>
            handleUpdateCharge({ totalPrice: totalPrice ?? undefined })
          }
          onPaidNowChange={paidNow =>
            handleUpdateCharge({ paidNow: paidNow ?? undefined })
          }
          disabled={charge.mode === "existing"}
        />

        {/* Row 3: Payment Status and Actions */}
        <ChargeActions
          chargeId={charge.id}
          mode={charge.mode}
          progressStatus={charge.progressStatus}
          totalPrice={charge.totalPrice}
          paidAmount={charge.paidAmount}
          paidNow={charge.paidNow}
          onNotesClick={() => onNotesClick(charge.id)}
          onDuplicate={() => onDuplicateCharge(charge.id)}
          onRemove={() => onRemoveCharge(charge.id)}
        />
      </div>
    </Card>
  )
}
