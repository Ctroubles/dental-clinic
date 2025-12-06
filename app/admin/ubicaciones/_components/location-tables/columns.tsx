"use client"

import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { Text } from "lucide-react"
import { DataTableColumnHeader } from "~/app/_components/ui/table/data-table-column-header"
import { dateToHumanReadable } from "~/lib/utils"
import { Location } from "@/domain/entities/location"

export const columns: ColumnDef<Location>[] = [
  {
    id: "search",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ cell }) => (
      <span className="font-medium">{cell.getValue<string>()}</span>
    ),
    enableColumnFilter: true,
    meta: {
      label: "Nombre",
      placeholder: "Buscar por nombre o descripción",
      variant: "text",
      icon: Text,
    },
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ cell }) => {
      const description = cell.getValue<string>()
      return (
        <span className="text-muted-foreground truncate max-w-[300px] block">
          {description || "-"}
        </span>
      )
    },
    meta: {
      label: "Descripción",
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
        href={`/admin/ubicaciones/${row.original.id}`}
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
