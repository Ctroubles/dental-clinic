"use client"

import { useMemo } from "react"
import { Plus } from "lucide-react"
import { Button } from "~/app/_components/ui/button"
import { Card } from "~/app/_components/ui/card"
import { dateToHumanReadable } from "~/lib/utils"
import { useGetCargosByPatient } from "@/features/cargos"
import { useVisitStore } from "@/features/cargos/hooks/use-visit-store"
import { TrackedCharge } from "@/domain/entities"

export function TrackedChargesPanel() {
  const { visit, charges, addCharge } = useVisitStore()

  const { data: trackedChargesData } = useGetCargosByPatient(
    visit?.patientId ?? "",
    {
      enabled: !!visit?.patientId,
    }
  )

  // Filter tracked charges for current patient that are IN_PROGRESS
  const availableTrackedCharges = useMemo(() => {
    if (!trackedChargesData) return []
    return trackedChargesData.filter(
      tc =>
        tc.progressStatus === "inProgress" ||
        ["partiallyPaid", "unpaid"].includes(tc.paymentStatus)
    )
  }, [trackedChargesData])

  // Check if a tracked charge is already added
  const isTrackedChargeAdded = (trackedChargeId: string) => {
    return charges.some(
      c => c.mode === "existing" && c.trackedChargeId === trackedChargeId
    )
  }

  const handleAddTrackedCharge = (trackedCharge: TrackedCharge) => {
    console.log("[TrackedChargesPanel] adding tracked charge:", trackedCharge)
    addCharge({
      mode: "existing",
      id: trackedCharge.id,
      trackedChargeId: trackedCharge.id,
      type: trackedCharge.type,
      description: trackedCharge.description,
      quantity: 1,
      totalPrice: trackedCharge.totalPrice,
      paidAmount: trackedCharge.paidAmount,
      paidNow: 0,
      progressStatus: "inProgress",
    })
  }

  if (availableTrackedCharges.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p className="text-sm">No hay cargos pendientes</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-3">
      <div>
        <h3 className="font-semibold text-foreground text-sm">
          Cargos Pendientes
        </h3>
        <p className="text-xs text-muted-foreground">
          Continúa pagando estos cargos
        </p>
      </div>

      <div className="space-y-2">
        {availableTrackedCharges.map(trackedCharge => {
          const isAdded = isTrackedChargeAdded(trackedCharge.id)
          const balance = trackedCharge.totalPrice - trackedCharge.paidAmount

          return (
            <Card
              key={trackedCharge.id}
              className="p-3 hover:bg-accent/50 transition-colors border-purple-200 bg-purple-50 dark:bg-purple-950/20 dark:border-purple-500"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {trackedCharge.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {dateToHumanReadable(trackedCharge.createdAt)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={isAdded ? "secondary" : "default"}
                    disabled={isAdded}
                    onClick={() => handleAddTrackedCharge(trackedCharge)}
                    className="shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Total</p>
                    <p className="font-semibold text-foreground">
                      ${trackedCharge.totalPrice.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Pagado</p>
                    <p className="font-semibold text-green-600">
                      ${trackedCharge.paidAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Saldo</p>
                    <p className="font-semibold text-orange-600">
                      ${balance.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
