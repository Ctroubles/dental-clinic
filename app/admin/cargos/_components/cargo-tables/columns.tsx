"use client"

import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye } from "lucide-react"
import { Badge } from "~/app/_components/ui/badge"
import { Button } from "~/app/_components/ui/button"
import { dateToHumanReadable, getEntityFullname } from "~/lib/utils"
import { TrackedCharge } from "@/domain/entities/tracked-charge"
import {
  ChargePaymentStatusEnum,
  ChargeProgressStatusEnum,
} from "@/domain/enums"
import {
  calculateRemainingAmount,
  formatCurrency,
  formatItemType,
  formatPaymentStatus,
  getChargeProgressStatusLabel,
  getPaymentStatusColor,
  getProgressStatusColor,
} from "../../../../../src/features/cargos/helpers"

export const columns: ColumnDef<TrackedCharge>[] = [
  {
    id: "search",
    accessorKey: "description",
    header: "Descripción",
    cell: ({ getValue }) => {
      const description = getValue<string>() || "--"
      return (
        <div className="max-w-[200px] truncate font-medium">{description}</div>
      )
    },
    enableColumnFilter: true,
    meta: {
      label: "Descripción",
      placeholder: "Buscar por paciente o doctor (DNI, nombres, apellidos)...",
      variant: "text",
    },
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.getValue("type") as TrackedCharge["type"]
      return <Badge variant="outline">{formatItemType(type)}</Badge>
    },
    meta: {
      label: "Tipo",
    },
  },
  {
    accessorKey: "patientId",
    header: "Paciente",
    cell: ({ row }) => {
      const patient = row.original.patient
      if (!patient) return <span className="text-muted-foreground">-</span>
      return (
        <span className="font-mono text-xs">
          {getEntityFullname({
            firstName: patient.firstName,
            lastName: patient.lastName,
          })}
        </span>
      )
    },
    meta: {
      label: "Paciente",
    },
  },
  {
    accessorKey: "doctorId",
    header: "Doctor",
    cell: ({ row }) => {
      const doctor = row.original.doctor
      if (!doctor) return <span className="text-muted-foreground">-</span>
      return (
        <span className="font-mono text-xs">
          {getEntityFullname({
            firstName: doctor.firstName,
            lastName: doctor.lastName,
          })}
        </span>
      )
    },
    meta: {
      label: "Doctor",
    },
  },
  {
    accessorKey: "totalPrice",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </Button>
      )
    },
    cell: ({ row }) => {
      const totalPrice = row.getValue("totalPrice") as number
      return <div className="font-medium">{formatCurrency(totalPrice)}</div>
    },
    meta: {
      label: "Total",
    },
  },
  {
    accessorKey: "paidAmount",
    header: "Pagado",
    cell: ({ row }) => {
      const paidAmount = row.getValue("paidAmount") as number
      return <div className="font-medium">{formatCurrency(paidAmount)}</div>
    },
    meta: {
      label: "Pagado",
    },
  },
  {
    id: "remainingAmount",
    header: "Restante",
    cell: ({ row }) => {
      const totalPrice = row.getValue("totalPrice") as number
      const paidAmount = row.getValue("paidAmount") as number
      const remaining = calculateRemainingAmount(totalPrice, paidAmount)
      return (
        <div
          className={`font-medium ${remaining > 0 ? "text-orange-500" : "text-muted-foreground"}`}
        >
          {formatCurrency(remaining)}
        </div>
      )
    },
    meta: {
      label: "Restante",
    },
  },
  {
    id: "paymentStatus",
    accessorKey: "paymentStatus",
    header: "Estado Pago",
    cell: ({ row }) => {
      const status = row.getValue(
        "paymentStatus"
      ) as TrackedCharge["paymentStatus"]
      return (
        <Badge variant="outline" className={getPaymentStatusColor(status)}>
          {formatPaymentStatus(status)}
        </Badge>
      )
    },
    enableColumnFilter: true,
    meta: {
      label: "Estado Pago",
      variant: "multiSelect",
      options: [
        { label: "Pagado", value: ChargePaymentStatusEnum.Values.paid },
        {
          label: "Parcial",
          value: ChargePaymentStatusEnum.Values.partiallyPaid,
        },
        { label: "Pendiente", value: ChargePaymentStatusEnum.Values.unpaid },
      ],
    },
  },
  {
    id: "progressStatus",
    accessorKey: "progressStatus",
    header: "Progreso",
    cell: ({ row }) => {
      const status = row.getValue(
        "progressStatus"
      ) as TrackedCharge["progressStatus"]
      return (
        <Badge variant="outline" className={getProgressStatusColor(status)}>
          {getChargeProgressStatusLabel(status)}
        </Badge>
      )
    },
    enableColumnFilter: true,
    meta: {
      label: "Progreso",
      variant: "multiSelect",
      options: [
        {
          label: "Completado",
          value: ChargeProgressStatusEnum.Values.completed,
        },
        {
          label: "En proceso",
          value: ChargeProgressStatusEnum.Values.inProgress,
        },
        {
          label: "Cancelado",
          value: ChargeProgressStatusEnum.Values.cancelled,
        },
      ],
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Creado en
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date
      return (
        <div className="text-sm text-muted-foreground">
          {dateToHumanReadable(date)}
        </div>
      )
    },
    meta: {
      label: "Creado en",
    },
  },
  // view details
  {
    id: "actions",
    enableHiding: false,
    header() {
      return <div className="flex items-center justify-end">Acciones</div>
    },
    cell: ({ row }) => {
      const cargo = row.original

      return (
        <div className="flex items-center justify-end">
          <Link href={`/admin/cargos/${cargo.id}`} title="Ver detalles">
            <Eye className="mr-2 h-4 w-4" />
          </Link>
        </div>
      )
    },
  },
  // {
  //   id: "actions",
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     const cargo = row.original

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Abrir menú</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Acciones</DropdownMenuLabel>
  //           <DropdownMenuItem asChild>
  //             <Link href={`/admin/cargos/${cargo.id}`}>
  //               <Eye className="mr-2 h-4 w-4" />
  //               Ver detalles
  //             </Link>
  //           </DropdownMenuItem>
  //           <DropdownMenuItem asChild>
  //             <Link href={`/admin/cargos/${cargo.id}/editar`}>
  //               <Edit className="mr-2 h-4 w-4" />
  //               Editar
  //             </Link>
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem className="text-red-600">
  //             <Trash2 className="mr-2 h-4 w-4" />
  //             Eliminar
  //           </DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     )
  //   },
  // },
]
