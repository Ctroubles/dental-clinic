"use client"

import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { Text } from "lucide-react"
import { DataTableColumnHeader } from "~/app/_components/ui/table/data-table-column-header"
import { dateToHumanReadable } from "~/lib/utils"
import { Doctor } from "@/domain/entities/doctor"

export const columns: ColumnDef<Doctor>[] = [
  {
    id: "search",
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombres" />
    ),
    cell: ({ cell }) => <span>{cell.getValue<string>()}</span>,
    enableColumnFilter: true,
    enableSorting: false,
    meta: {
      label: "Nombres",
      placeholder: "Buscar por nombres o apellidos",
      variant: "text",
      icon: Text,
    },
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Apellidos" />
    ),
    cell: ({ cell }) => <span>{cell.getValue<string>()}</span>,
    enableColumnFilter: true,
    enableSorting: false,
    meta: {
      label: "Apellidos",
    },
    enableHiding: true,
  },
  {
    accessorKey: "phone",
    header: "Teléfono",
    cell: ({ cell }) => {
      const phone = cell.getValue<string>()
      return phone ? (
        <span>{phone}</span>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
    meta: {
      label: "Teléfono",
    },
  },
  {
    id: "gender",
    accessorKey: "gender",
    header: "Sexo",
    cell: ({ cell }) => {
      const gender = cell.getValue<string>()
      if (!gender) return <span className="text-muted-foreground">-</span>
      return <span>{gender === "M" ? "Masculino" : "Femenino"}</span>
    },
    enableColumnFilter: true,
    meta: {
      label: "Sexo",
      options: [
        { label: "Masculino", value: "M" },
        { label: "Femenino", value: "F" },
      ],
      variant: "select",
    },
  },
  {
    accessorKey: "userId",
    header: "Usuario",
    cell: ({ cell }) => {
      const userId = cell.getValue<string>()
      return userId ? (
        <span className="text-green-600">Sí</span>
      ) : (
        <span className="text-muted-foreground">No</span>
      )
    },
    meta: {
      label: "Usuario",
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
    header: "Acciones",
    accessorFn: () => "",
    cell: ({ row }) => (
      <Link
        href={`/admin/doctores/${row.original.id}`}
        className="text-primary underline hover:opacity-80"
      >
        Ver
      </Link>
    ),
    meta: {
      label: "Acciones",
    },
  },
]
