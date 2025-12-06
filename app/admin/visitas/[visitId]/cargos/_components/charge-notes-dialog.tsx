"use client"

import { useEffect, useState } from "react"
import { Button } from "~/app/_components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/app/_components/ui/dialog"
import { Textarea } from "~/app/_components/ui/textarea"
import { useVisitStore } from "@/features/cargos/hooks/use-visit-store"

interface ChargeNotesDialogProps {
  chargeId: string | null
  onOpenChange: (open: boolean) => void
}

export function ChargeNotesDialog({
  chargeId,
  onOpenChange,
}: ChargeNotesDialogProps) {
  const [notes, setNotes] = useState("")
  const { charges, updateCharge } = useVisitStore()

  const charge = charges.find(c => c.id === chargeId)

  useEffect(() => {
    if (charge) {
      setNotes(charge.notes || "")
    }
  }, [charge])

  const handleSave = () => {
    if (chargeId) {
      updateCharge(chargeId, { notes })
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={!!chargeId} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notas del Cargo</DialogTitle>
          <DialogDescription>{charge?.description}</DialogDescription>
        </DialogHeader>

        <Textarea
          placeholder="Agregar notas sobre este cargo..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="min-h-32"
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar Notas</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
