"use client"

import { useState } from "react"
import { Button } from "~/app/_components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/app/_components/ui/dialog"
import { Input } from "~/app/_components/ui/input"
import { Label } from "~/app/_components/ui/label"

interface ItemQuantityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (quantity: number) => void
  itemName?: string
}

export function ItemQuantityDialog({
  open,
  onOpenChange,
  onConfirm,
  itemName,
}: ItemQuantityDialogProps) {
  const [quantity, setQuantity] = useState(1)

  const handleConfirm = () => {
    if (quantity > 0) {
      onConfirm(quantity)
      setQuantity(1)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cantidad de {itemName}</DialogTitle>
          <DialogDescription>
            Ingresa la cantidad de unidades que deseas agregar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="quantity">Cantidad</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={e =>
                setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))
              }
              className="mt-2"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
