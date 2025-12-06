"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Text } from "lucide-react"
import { CreditCard } from "lucide-react"
import { getEntityFullname } from "~/lib/utils"
import {
  formatCurrency,
  formatDate,
  formatPaymentMethod,
  getPaymentMethodColor,
} from "@/features/payments/helpers"
import { Payment } from "@/domain/entities/payment"
import { PaymentMethodEnum } from "@/domain/enums"

export const columns: ColumnDef<Payment>[] = [
  {
    id: "search",
    accessorKey: "charge.item.name",
    header: "Servicio/Producto",
    cell: ({ row }) => {
      const item = row.original.charge?.item?.name
      return <span className="font-medium">{item}</span>
    },
    enableColumnFilter: true,
    meta: {
      label: "Servicio/Producto",
      variant: "text",
      icon: Text,
    },
  },
  {
    accessorKey: "charge.patientId",
    header: "Paciente",
    cell: ({ row }) => {
      const patient = row.original.charge?.patient
      return <span className="font-medium">{getEntityFullname(patient)}</span>
    },
    meta: {
      label: "Paciente",
    },
  },
  {
    accessorKey: "charge.doctorId",
    header: "Doctor",
    cell: ({ row }) => {
      const doctor = row.original.charge?.doctor
      return <span className="font-medium">{getEntityFullname(doctor)}</span>
    },
    meta: {
      label: "Doctor",
    },
  },
  {
    accessorKey: "amount",
    header: "Monto",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number
      return <span className="font-medium">{formatCurrency(amount)}</span>
    },
    meta: {
      label: "Monto",
    },
  },
  {
    id: "method",
    accessorKey: "method",
    header: "Método",
    cell: ({ row }) => {
      const method = row.getValue("method") as Payment["method"]
      return (
        <span className={getPaymentMethodColor(method)}>
          {formatPaymentMethod(method)}
        </span>
      )
    },
    enableColumnFilter: true,
    meta: {
      label: "Método",
      variant: "multiSelect",
      options: [
        { label: "Efectivo", value: PaymentMethodEnum.Values.cash },
        { label: "Yape", value: PaymentMethodEnum.Values.yape },
        { label: "Plin", value: PaymentMethodEnum.Values.plin },
        { label: "Tarjeta", value: PaymentMethodEnum.Values.card },
        { label: "Transferencia", value: PaymentMethodEnum.Values.transfer },
      ],
      icon: CreditCard,
    },
  },
  {
    accessorKey: "date",
    header: "Fecha",
    cell: ({ row }) => {
      const date = row.getValue("date") as Date
      return <span>{formatDate(date)}</span>
    },
    meta: {
      label: "Fecha",
    },
  },
  // {
  //   accessorKey: "chargeId",
  //   header: "Cargo",
  //   cell: ({ row }) => {
  //     const chargeId = row.getValue("chargeId") as string | null
  //     if (!chargeId) return <span className="text-muted-foreground">-</span>
  //     return <span className="font-mono text-xs">{chargeId}</span>
  //   },
  // },
  {
    accessorKey: "invoiceId",
    header: "Factura",
    cell: ({ row }) => {
      const invoiceId = row.getValue("invoiceId") as string | null
      if (!invoiceId) return <span className="text-muted-foreground">-</span>
      return <span className="font-mono text-xs">{invoiceId}</span>
    },
    meta: {
      label: "Factura",
    },
  },
  {
    accessorKey: "createdAt",
    header: "Creado",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date
      return <span>{formatDate(date)}</span>
    },
    meta: {
      label: "Creado",
    },
  },
]
