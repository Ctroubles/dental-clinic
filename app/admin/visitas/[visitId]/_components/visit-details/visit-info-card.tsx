"use client"

import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { Card } from "~/app/_components/ui/card"
import { cn, getEntityFullname } from "~/lib/utils"
import { Visit } from "@/domain/entities"

interface VisitInfoCardProps {
  visit: Visit
}

export function VisitInfoCard({ visit }: VisitInfoCardProps) {
  return (
    <Card className="p-6">
      <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Patient Info */}
        <section className="space-y-3">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Paciente
          </p>
          <Link
            href={`/admin/pacientes/${visit.patientId}`}
            className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors group"
          >
            <span className="font-medium ">
              {getEntityFullname(visit.patient)}
            </span>
            <ExternalLink className="w-3.5 h-3.5 transition-opacity" />
          </Link>
        </section>

        {/* Doctor Info */}
        <section className="space-y-3">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Doctor
          </p>
          <Link
            href={`/admin/doctores/${visit.doctorId}`}
            className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors group"
          >
            <span className="font-medium">
              {getEntityFullname(visit.doctor)}
            </span>
            <ExternalLink className="w-3.5 h-3.5 transition-opacity" />
          </Link>
        </section>

        {/* Location Info */}
        {visit.location && (
          <section className="space-y-3">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Ubicación
            </p>
            <Link
              href={`/admin/ubicaciones/${visit.locationId}`}
              className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors group"
            >
              <span className="font-medium">{visit.location.name}</span>
              <ExternalLink className="w-3.5 h-3.5 transition-opacity" />
            </Link>
          </section>
        )}

        {/* Notes */}
        {visit.notes && (
          <section
            className={cn("space-y-3", {
              "md:col-span-2 lg:col-span-3": !visit.invoiceId,
            })}
          >
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Notas
            </p>
            <p className="text-foreground leading-relaxed text-sm">
              {visit.notes}
            </p>
          </section>
        )}

        {/* Invoice Link */}
        {visit.invoiceId && (
          <section
            className={cn("space-y-3", {
              "md:col-span-2 lg:col-span-3": !visit.notes,
            })}
          >
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Factura Asociada
            </p>
            <Link
              href="/invoices/invoice-001"
              className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors group"
            >
              <span className="font-medium">INV-001</span>
              <ExternalLink className="w-3.5 h-3.5 transition-opacity" />
            </Link>
          </section>
        )}
      </article>
    </Card>
  )
}
