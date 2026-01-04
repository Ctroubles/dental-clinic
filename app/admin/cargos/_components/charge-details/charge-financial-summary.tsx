import { Separator } from "~/app/_components/ui/separator"

interface ChargeFinancialSummaryProps {
  totalPrice: number
  paidAmount: number
}

export function ChargeFinancialSummary({
  totalPrice,
  paidAmount,
}: ChargeFinancialSummaryProps) {
  const remainingAmount = totalPrice - paidAmount

  return (
    <div className="flex flex-col md:flex-row gap-6 rounded-lg border bg-muted/30 p-4">
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          Total
        </p>
        <p className="text-lg md:text-xl font-bold">
          S/ {totalPrice.toFixed(2)}
        </p>
      </div>
      <Separator orientation="vertical" className="h-auto hidden md:block" />
      <Separator orientation="horizontal" className="block md:hidden" />
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          Pagado
        </p>
        <p className="text-lg md:text-xl font-bold text-emerald-500">
          S/ {paidAmount.toFixed(2)}
        </p>
      </div>
      <Separator orientation="vertical" className="h-auto hidden md:block" />
      <Separator orientation="horizontal" className="block md:hidden" />
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          Restante
        </p>
        <p className="text-lg md:text-xl font-bold text-orange-500">
          S/ {remainingAmount.toFixed(2)}
        </p>
      </div>
    </div>
  )
}
