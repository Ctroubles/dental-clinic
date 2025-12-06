import { dateToHumanReadable, getEntityFullname } from "~/lib/utils"
import { Visit } from "@/domain/entities"

interface VisitHeaderProps {
  visit: Visit | null
}

export function VisitHeader({ visit }: VisitHeaderProps) {
  return (
    <div className="px-5 py-3 border-b border-border bg-card">
      <div className="grid grid-cols-3 gap-x-4 gap-y-4 text-sm">
        <div>
          <p className="text-muted-foreground">Paciente</p>
          <p className="font-semibold text-foreground">
            {getEntityFullname(visit?.patient)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Doctor</p>
          <p className="font-semibold text-foreground">
            {getEntityFullname(visit?.doctor)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Fecha</p>
          <p className="font-semibold text-foreground">
            {visit?.date ? dateToHumanReadable(visit?.date) : "--"}
          </p>
        </div>
        {visit?.notes && (
          <div className="">
            <p className="text-muted-foreground">Notas</p>
            <p className="font-semibold text-foreground">{visit.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
