import { Input } from "~/app/_components/ui/input"

interface ChargePricingFieldsProps {
  type: "product" | "service"
  quantity: number | null
  totalPrice: number | null
  paidAmount: number | null
  paidNow: number | null
  onQuantityChange: (quantity: number | null) => void
  onTotalPriceChange: (price: number | null) => void
  onPaidNowChange: (amount: number | null) => void
  disabled?: boolean
}

export function ChargePricingFields({
  type,
  quantity,
  totalPrice,
  paidAmount,
  paidNow,
  onQuantityChange,
  onTotalPriceChange,
  onPaidNowChange,
  disabled = false,
}: ChargePricingFieldsProps) {
  console.log("[ChargePricingFields] totalPrice:", totalPrice)
  console.log("[ChargePricingFields] paidAmount:", paidAmount)
  console.log("[ChargePricingFields] paidNow:", paidNow)

  const balance = totalPrice
    ? totalPrice - (paidAmount ?? 0) - (paidNow ?? 0)
    : 0

  return (
    <div className="grid grid-cols-5 gap-3">
      {type === "product" && (
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1 block">
            Cantidad
          </label>
          <Input
            type="number"
            min="1"
            value={quantity ?? ""}
            onChange={e => {
              const value = e.target.value.trim()
              const numberValue =
                value === "" || isNaN(Number(value)) ? null : Number(value)
              onQuantityChange(numberValue)
            }}
            className="text-sm"
            disabled={disabled}
          />
        </div>
      )}
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-1 block">
          Total
        </label>
        <Input
          type="number"
          value={totalPrice ?? ""}
          onChange={e => {
            const value = e.target.value.trim()
            const numberValue =
              value === "" || isNaN(Number(value)) ? null : Number(value)
            onTotalPriceChange(numberValue)
          }}
          className="text-sm"
          disabled={disabled}
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-1 block">
          Pagado Acum.
        </label>
        <div className="px-3 py-2 bg-muted rounded text-sm font-semibold">
          S/. {paidAmount ? paidAmount.toLocaleString() : "0"}
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-1 block">
          Pago Hoy
        </label>
        <Input
          type="number"
          min="0"
          max={totalPrice ? totalPrice - (paidAmount ?? 0) : 0}
          value={String(paidNow) ?? ""}
          onChange={e => {
            const value = e.target.value.trim()
            const pendingAmount = totalPrice
              ? totalPrice - (paidAmount ?? 0)
              : 0

            const numberValue =
              value === "" || isNaN(Number(value))
                ? null
                : Number(Math.min(Number(value), pendingAmount))
            onPaidNowChange(numberValue)
          }}
          className="text-sm"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-1 block">
          Saldo
        </label>
        <div className="px-3 py-2 bg-muted rounded text-sm font-semibold">
          S/. {balance.toLocaleString()}
        </div>
      </div>
    </div>
  )
}
