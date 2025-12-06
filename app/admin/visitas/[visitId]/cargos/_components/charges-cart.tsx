"use client"

import { useState } from "react"
import { useVisitStore } from "@/features/cargos/hooks/use-visit-store"
import { ChargeCard } from "./charge-card"
import { ChargeNotesDialog } from "./charge-notes-dialog"
import { EmptyChargesState } from "./empty-charges-state"
import { PaymentMethodDialog } from "./payment-method-dialog"
import { VisitHeader } from "./visit-header"
import { VisitSummary } from "./visit-summary"

export function ChargesCart() {
  const { visit, charges, updateCharge, removeCharge, duplicateCharge } =
    useVisitStore()
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [selectedChargeId, setSelectedChargeId] = useState<string | null>(null)

  return (
    <div className="flex flex-col h-full">
      <VisitHeader visit={visit} />

      {/* Charges Table */}
      <div className="flex-1 overflow-y-auto p-6">
        {charges.length === 0 ? (
          <EmptyChargesState />
        ) : (
          <div className="space-y-4">
            {charges.map(charge => (
              <ChargeCard
                key={charge.id}
                charge={charge}
                onUpdateCharge={updateCharge}
                onRemoveCharge={removeCharge}
                onDuplicateCharge={duplicateCharge}
                onNotesClick={setSelectedChargeId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Summary and Actions */}
      <div className="border-t border-border bg-card p-4">
        <VisitSummary onRegisterPayments={() => setShowPaymentDialog(true)} />
      </div>

      <PaymentMethodDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
      />

      <ChargeNotesDialog
        chargeId={selectedChargeId}
        onOpenChange={open => !open && setSelectedChargeId(null)}
      />
    </div>
  )
}
