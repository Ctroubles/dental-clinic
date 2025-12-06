"use client"

import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { Badge } from "~/app/_components/ui/badge"
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
import {
  formatPaymentStatus,
  getChargeProgressStatusLabel,
  getPaymentStatusColor,
  getProgressStatusColor,
} from "@/features/cargos"
import { TrackedCharge } from "@/domain/entities/tracked-charge"

interface PatientChargesTableProps {
  charges: TrackedCharge[]
}

export function PatientChargesTable({ charges }: PatientChargesTableProps) {
  return (
    <article className="">
      <header className="mb-5">
        <h2 className="text-base font-semibold text-foreground mb-1">
          Cargos registrados
        </h2>
        <p className="text-sm text-muted-foreground">
          {charges.length} cargos registrados
        </p>
      </header>
      {charges.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No charges recorded
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descripción</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Servicio/Producto</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Pagado</TableHead>
              <TableHead>Restante</TableHead>
              <TableHead>Estado Pago</TableHead>
              <TableHead>Progreso</TableHead>
              <TableHead>Creado en</TableHead>
              {/* <TableHead className="w-[50px]"></TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {charges.map(charge => (
              <TableRow key={charge.id}>
                <TableCell>{charge.description}</TableCell>
                <TableCell>{getEntityFullname(charge.doctor)}</TableCell>
                <TableCell>
                  <Link
                    href={`/admin/items/${charge.item?.id}`}
                    className="font-xs hover:underline hover:opacity-80 flex items-center gap-1"
                    title={charge.item?.code || charge.item?.name}
                  >
                    <span className="max-w-[150px] block w-full truncate">
                      {charge.item?.code || charge.item?.name}
                    </span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </TableCell>
                <TableCell>{formatCurrency(charge.totalPrice)}</TableCell>
                <TableCell>{formatCurrency(charge.paidAmount)}</TableCell>
                <TableCell>
                  {formatCurrency(charge.totalPrice - charge.paidAmount)}
                </TableCell>
                <TableCell>
                  <Badge
                    className={getPaymentStatusColor(charge.paymentStatus)}
                  >
                    {formatPaymentStatus(charge.paymentStatus)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={getProgressStatusColor(charge.progressStatus)}
                  >
                    {getChargeProgressStatusLabel(charge.progressStatus)}
                  </Badge>
                </TableCell>
                <TableCell>{dateToHumanReadable(charge.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </article>
  )
}
