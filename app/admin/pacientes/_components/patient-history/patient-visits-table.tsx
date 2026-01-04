"use client"

import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { Button } from "~/app/_components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/app/_components/ui/table"
import {
  dateToHumanReadable,
  formatCurrency,
  getEntityFullname,
} from "~/lib/utils"
import { Visit } from "@/domain/entities/visit"

interface PatientVisitsTableProps {
  visits: Visit[]
}

export function PatientVisitsTable({ visits }: PatientVisitsTableProps) {
  return (
    <article className="">
      <header className="mb-5">
        <h2 className="text-base font-semibold text-foreground mb-1">
          Visitas registradas
        </h2>
        <p className="text-sm text-muted-foreground">
          {visits.length} visitas registradas
        </p>
      </header>
      {visits.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No hay visitas registradas
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Notas</TableHead>
              <TableHead>Monto Pagado</TableHead>
              <TableHead>Cargos Atendidos</TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visits.map(visit => {
              const totalPrice =
                visit.payments?.reduce(
                  (acc, payment) => acc + payment.amount,
                  0
                ) ?? 0
              return (
                <TableRow key={visit.id}>
                  <TableCell>{dateToHumanReadable(visit.date)}</TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/doctores/${visit.doctor?.id}`}
                      className="font-xs hover:underline hover:opacity-80 flex items-center gap-2"
                      title={getEntityFullname(visit.doctor)}
                    >
                      {getEntityFullname(visit.doctor)}
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </TableCell>
                  <TableCell>{visit.location?.name || "-"}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {visit.notes || "-"}
                  </TableCell>
                  <TableCell className="text-start font-semibold">
                    {formatCurrency(totalPrice)}
                  </TableCell>
                  <TableCell>{visit.charges?.length ?? 0}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="gap-2" asChild>
                      <Link href={`/admin/visitas/${visit.id}`}>
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </article>
  )
}
