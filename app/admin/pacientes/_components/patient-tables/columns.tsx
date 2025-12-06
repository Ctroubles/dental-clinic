"use client"

import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { Text } from "lucide-react"
import { DataTableColumnHeader } from "~/app/_components/ui/table/data-table-column-header"
import { dateToHumanReadable } from "~/lib/utils"
import { Patient } from "@/domain/entities/patient"

export const columns: ColumnDef<Patient>[] = [
  // {
  //   id: 'avatar',
  //   // accessorKey: "",
  //   header: () => <div></div>,
  //   cell: ({ row }) => (
  //     <div className='relative aspect-square w-10 h-10'>
  //       <Image
  //         // src={row.getValue('avatar') as string}
  //         src={"https://api.slingacademy.com/public/sample-users/1.png"}
  //         alt={(row.getValue('firstName') as string) + ' ' + (row.getValue('lastName') as string) || 'Foto de miembro'}
  //         fill
  //         className='rounded-full object-cover border'
  //       />
  //     </div>
  //   )
  // },
  {
    id: "search",
    accessorKey: "dni",
    header: "DNI",
    cell: ({ cell }) => <span>{cell.getValue<string>()}</span>,
    enableColumnFilter: true,
    meta: {
      label: "DNI",
      placeholder: "Buscar por nombres o apellidos",
      variant: "text",
      icon: Text,
    },
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombres" />
    ),
    cell: ({ cell }) => <span>{cell.getValue<string>()}</span>,
    meta: {
      label: "Nombres",
    },
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Apellidos" />
    ),
    cell: ({ cell }) => <span>{cell.getValue<string>()}</span>,
    meta: {
      label: "Apellidos",
    },
  },
  {
    accessorKey: "phone",
    header: "WhatsApp",
    cell: ({ cell }) => {
      const phone = cell.getValue<string>()
      return phone ? (
        <span>{phone}</span>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
    meta: {
      label: "WhatsApp",
    },
  },
  {
    accessorKey: "dateOfBirth",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Edad" />
    ),
    cell: ({ cell }) => {
      const dateOfBirth = cell.getValue<string>()
      if (!dateOfBirth) return <span className="text-muted-foreground">-</span>

      try {
        const birthDate = new Date(dateOfBirth)
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()

        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--
        }

        return <span>{age >= 0 ? `${age} años` : "-"}</span>
      } catch {
        return <span className="text-muted-foreground">-</span>
      }
    },
    meta: {
      label: "Edad",
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
    accessorKey: "origin",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Procedencia" />
    ),
    cell: ({ cell }) => {
      const origin = cell.getValue<string>()
      return origin ? (
        <span>{origin}</span>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
    meta: {
      label: "Procedencia",
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
        href={`/admin/pacientes/${row.original.id}`}
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
