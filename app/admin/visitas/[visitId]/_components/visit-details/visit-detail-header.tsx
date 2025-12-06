"use client"

import { Calendar, Stethoscope, User } from "lucide-react"
import { dateToHumanReadable, getEntityFullname } from "~/lib/utils"
import { Visit } from "@/domain/entities"

interface VisitDetailHeaderProps {
  visit: Visit
}

export function VisitDetailHeader({ visit }: VisitDetailHeaderProps) {
  return (
    <header>
      <div className="px-6 py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-foreground">
                Detalle de Visita
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{dateToHumanReadable(visit.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{getEntityFullname(visit.patient)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  <span>{getEntityFullname(visit.doctor)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
