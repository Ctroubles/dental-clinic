"use client"

import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { ExternalLink, Eye, MoreHorizontal, Plus, Text } from "lucide-react"
import { Button } from "~/app/_components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu"
import { DataTableColumnHeader } from "~/app/_components/ui/table/data-table-column-header"
import { dateToHumanReadable, getEntityFullname } from "~/lib/utils"
import { Visit } from "@/domain/entities/visit"

export const columns: ColumnDef<Visit>[] = [
  {
    accessorKey: "patientId",
    header: "Paciente",
    cell: ({ cell }) => {
      const patientId = cell.row.original.patientId
      const patientName = getEntityFullname({
        firstName: cell.row.original.patient?.firstName,
        lastName: cell.row.original.patient?.lastName,
      })
      return (
        <Link
          href={`/admin/pacientes/${patientId}`}
          className="hover:underline hover:text-primary flex items-center gap-1"
        >
          {patientName}
          <ExternalLink className="h-3 w-3" />
        </Link>
      )
    },
    enableColumnFilter: true,
    meta: {
      label: "Paciente",
    },
  },
  {
    accessorKey: "doctorId",
    header: "Doctor",
    cell: ({ cell }) => {
      const doctorId = cell.row.original.doctorId
      const doctorName = getEntityFullname({
        firstName: cell.row.original.doctor?.firstName,
        lastName: cell.row.original.doctor?.lastName,
      })
      return (
        <Link
          href={`/admin/doctores/${doctorId}`}
          className="hover:underline hover:text-primary flex items-center gap-1"
        >
          {doctorName}
          <ExternalLink className="h-3 w-3" />
        </Link>
      )
    },
    enableColumnFilter: true,
    meta: {
      label: "Doctor",
    },
  },
  {
    accessorKey: "locationId",
    header: "Ubicación",
    cell: ({ cell }) => {
      const locationId = cell.row.original.locationId
      const locationName = cell.row.original.location?.name
      if (!locationName) {
        return <span className="text-muted-foreground">--</span>
      }
      return (
        <Link
          href={`/admin/ubicaciones/${locationId}`}
          className="hover:underline hover:text-primary flex items-center gap-1"
        >
          {locationName}
          <ExternalLink className="h-3 w-3" />
        </Link>
      )
    },
    enableColumnFilter: true,
    meta: {
      label: "Ubicación",
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de atención" />
    ),
    cell: ({ cell }) => {
      const date = cell.getValue<Date>()
      return <span>{dateToHumanReadable(date)}</span>
    },
    meta: {
      label: "Fecha de atención",
    },
  },
  {
    id: "search",
    accessorKey: "notes",
    header: "Notas",
    cell: ({ cell }) => {
      const notes = cell.getValue<string>()
      return notes ? (
        <div className="max-w-[200px] truncate" title={notes}>
          {notes}
        </div>
      ) : (
        <div className="text-muted-foreground">--</div>
      )
    },
    enableColumnFilter: true,
    meta: {
      label: "Notas",
      placeholder: "Buscar por paciente, doctor (DNI, nombre, apellido)..",
      variant: "text",
      icon: Text,
    },
  },
  // Note: chargeIds removed from Visit entity
  // Charge count should be calculated using VisitChargesService
  // This column will need to be updated to use the service
  // {
  //   accessorKey: "id", // Temporary placeholder
  //   header: "Cargos",
  //   cell: () => <span className="text-muted-foreground">-</span>,
  // },
  {
    accessorKey: "invoiceId",
    header: "Factura",
    cell: ({ cell }) => {
      const invoiceId = cell.getValue<string>()
      return invoiceId ? (
        <span className="text-green-600">{invoiceId}</span>
      ) : (
        <span className="text-muted-foreground">--</span>
      )
    },
    meta: {
      label: "Factura",
    },
  },
  {
    accessorKey: "createdAt",
    header: "Creado en",
    cell: ({ cell }) => (
      <span>{dateToHumanReadable(cell.getValue<Date>())}</span>
    ),
    meta: {
      label: "Creado en",
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const visit = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/admin/visitas/${visit.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                Ver detalles
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/visitas/${visit.id}/cargos`}>
                <Plus className="mr-2 h-4 w-4" />
                Registrar cargos
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    meta: {
      label: "Acciones",
    },
  },
]
