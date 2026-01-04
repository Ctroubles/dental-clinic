import { Visit } from "@/domain/entities"
import { VisitCard } from "./visit-card"

// interface Payment {
//   id: string
//   amount: number
//   method: string
//   date: string
// }

// interface Visit {
//   id: string
//   date: string
//   location: string
//   notes: string
//   payments: Payment[]
// }

interface ChargeTimelineProps {
  visits?: Visit[] | null
  progressStatus: string
}

export function ChargeTimeline({
  visits,
  progressStatus,
}: ChargeTimelineProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Línea de Tiempo</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {visits?.length ?? 0} visitas registradas
        </p>
      </div>

      <div className="relative space-y-0 pl-8">
        {/* Timeline vertical line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-primary via-primary/50 to-border" />

        {visits?.map((visit, index) => {
          const isLast = index === visits.length - 1
          const isCompleted = isLast && progressStatus === "completado"

          return (
            <VisitCard
              key={visit.id}
              index={index}
              date={visit.date}
              location={visit.location ?? undefined}
              notes={visit.notes ?? undefined}
              payments={visit.payments ?? []}
              isCompleted={isCompleted}
            />
          )
        })}
      </div>
    </div>
  )
}
