import { CalendarDays, CheckCircle2, Circle, Clock, MapPin } from "lucide-react"
import { Badge } from "~/app/_components/ui/badge"
import { Payment } from "@/domain/entities"
import { Location } from "@/domain/entities/location"
import { PaymentItem } from "./payment-item"

interface VisitCardProps {
  index: number
  date: Date
  location?: Location
  notes?: string
  payments: Payment[]
  isCompleted: boolean
}

export function VisitCard({
  index,
  date,
  location,
  notes,
  payments,
  isCompleted,
}: VisitCardProps) {
  return (
    <div className="relative pb-16 last:pb-0">
      <div className="absolute -left-8 top-0">
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
            isCompleted
              ? "border-emerald-500 bg-emerald-500/10"
              : "border-primary bg-background"
          }`}
        >
          {isCompleted ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          ) : (
            <Circle className="h-2 w-2 fill-primary text-primary" />
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Visit header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-semibold">Visita {index + 1}</h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                {new Date(date).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {new Date(date).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {location?.name ?? "Sin ubicación"}
              </div>
            </div>
          </div>
          {isCompleted && (
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
            >
              Completado
            </Badge>
          )}
        </div>

        {/* Visit notes */}
        {notes && (
          <div className="pl-4 border-l-2 border-muted">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {notes}
            </p>
          </div>
        )}

        {/* Payments section */}
        {payments.length > 0 ? (
          <div className="space-y-1">
            <div className="text font-medium">
              <span>Pagos</span>
            </div>
            <div className="space-y-2 pl-0">
              {payments.map(payment => (
                <PaymentItem
                  key={payment.id}
                  amount={payment.amount}
                  method={payment.method}
                  date={payment.date.toString()}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="pl-0 text-sm text-muted-foreground italic">
            Sin pagos en esta visita
          </div>
        )}
      </div>
    </div>
  )
}
