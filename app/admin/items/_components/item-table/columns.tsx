"use client"

import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { Text } from "lucide-react"
import { Badge } from "~/app/_components/ui/badge"
import { DataTableColumnHeader } from "~/app/_components/ui/table/data-table-column-header"
import { dateToHumanReadable } from "~/lib/utils"
import { ITEM_TYPES_OPTIONS } from "@/features/items/constants"
import { Item } from "@/domain/entities/item"
import { ItemTypeEnum } from "@/domain/enums"

export const columns: ColumnDef<Item>[] = [
  {
    id: "search",
    accessorKey: "code",
    header: "Código",
    cell: ({ cell }) => (
      <span className="font-mono">{cell.getValue<string>()}</span>
    ),
    enableColumnFilter: true,
    meta: {
      label: "Código",
      placeholder: "Buscar por código, nombre o descripción",
      variant: "text",
      icon: Text,
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ cell }) => <span>{cell.getValue<string>()}</span>,
    meta: {
      label: "Nombre",
    },
  },
  {
    id: "type",
    accessorKey: "type",
    header: "Tipo",
    cell: ({ cell }) => {
      const type = cell.getValue<string>()
      return (
        <Badge variant={type === "service" ? "default" : "secondary"}>
          {type === "service" ? "Servicio" : "Producto"}
        </Badge>
      )
    },
    enableColumnFilter: true,
    meta: {
      label: "Tipo",
      placeholder: "Buscar por tipo",
      variant: "select",
      options: ITEM_TYPES_OPTIONS,
    },
  },
  {
    accessorKey: "defaultPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Precio por Defecto" />
    ),
    cell: ({ cell }) => {
      const price = cell.getValue<number>()
      return <span>S/ {price?.toFixed(2)}</span>
    },
    meta: {
      label: "Precio por Defecto",
    },
  },
  {
    id: "isActive",
    accessorKey: "isActive",
    header: "Estado",
    cell: ({ cell }) => {
      const isActive = cell.getValue<boolean>()
      return (
        <Badge variant={isActive ? "success" : "destructive"}>
          {isActive ? "Activo" : "Inactivo"}
        </Badge>
      )
    },
    enableColumnFilter: true,
    meta: {
      label: "Estado",
      placeholder: "Buscar por estado",
      variant: "select",
      options: [
        { label: "Activo", value: "true" },
        { label: "Inactivo", value: "false" },
      ],
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
        href={`/admin/items/${row.original.id}`}
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
