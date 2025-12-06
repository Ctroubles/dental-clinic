"use client"

import Link from "next/link"
import { Calendar, DollarSign, Receipt, User } from "lucide-react"
import { Badge } from "~/app/_components/ui/badge"
import { Button } from "~/app/_components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card"
import { dateToHumanReadable } from "~/lib/utils"
import {
  calculateRemainingAmount,
  formatCurrency,
  formatItemType,
  formatPaymentStatus,
  getChargeProgressStatusLabel,
  getPaymentStatusColor,
  getProgressStatusColor,
} from "../../../../src/features/cargos/helpers"
import { useGetTrackedChargeById } from "../../../../src/features/cargos/hooks"

type TCargoViewPageProps = {
  cargoId: string
}

export default function CargoViewPage({ cargoId }: TCargoViewPageProps) {
  const { data: cargo, isLoading } = useGetTrackedChargeById(cargoId)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    )
  }

  if (!cargo) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-muted-foreground">
          Cargo no encontrado
        </h2>
        <p className="text-muted-foreground mt-2">
          El cargo que buscas no existe o ha sido eliminado.
        </p>
        <Button asChild className="mt-4">
          <Link href="/admin/cargos">Volver a Cargos</Link>
        </Button>
      </div>
    )
  }

  const cargoData = cargo
  const remainingAmount = calculateRemainingAmount(
    cargoData.totalPrice,
    cargoData.paidAmount
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {cargoData.description}
          </h1>
          <p className="text-muted-foreground">
            Cargo creado el {dateToHumanReadable(cargoData.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/admin/cargos/${cargoId}/editar`}>Editar</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/cargos">Volver</Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Información del Cargo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Tipo
                </label>
                <div className="mt-1">
                  <Badge variant="outline">
                    {formatItemType(cargoData.type)}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Descripción
                </label>
                <p className="mt-1 text-sm">{cargoData.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Información Financiera
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Precio Total
                </label>
                <p className="mt-1 text-lg font-semibold">
                  {formatCurrency(cargoData.totalPrice)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Monto Pagado
                </label>
                <p className="mt-1 text-lg font-semibold">
                  {formatCurrency(cargoData.paidAmount)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Monto Restante
                </label>
                <p
                  className={`mt-1 text-lg font-semibold ${remainingAmount > 0 ? "text-red-600" : "text-green-600"}`}
                >
                  {formatCurrency(remainingAmount)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Estado de Pago
                </label>
                <div className="mt-1">
                  <Badge
                    variant="outline"
                    className={getPaymentStatusColor(cargoData.paymentStatus)}
                  >
                    {formatPaymentStatus(cargoData.paymentStatus)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Estado y Progreso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Estado de Progreso
                </label>
                <div className="mt-1">
                  <Badge
                    variant="outline"
                    className={getProgressStatusColor(cargoData.progressStatus)}
                  >
                    {getChargeProgressStatusLabel(cargoData.progressStatus)}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Última Actualización
                </label>
                <p className="mt-1 text-sm">
                  {cargoData.updatedAt
                    ? dateToHumanReadable(cargoData.updatedAt)
                    : "--"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información de Auditoría
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Creado por
                </label>
                <p className="mt-1 text-sm">{cargoData.createdBy}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Fecha de Creación
                </label>
                <p className="mt-1 text-sm">
                  {new Date(cargoData.createdAt).toLocaleString("es-PE")}
                </p>
              </div>
              {cargoData.updatedBy && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Actualizado por
                  </label>
                  <p className="mt-1 text-sm">{cargoData.updatedBy}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Fecha de Actualización
                </label>
                <p className="mt-1 text-sm">
                  {cargoData.updatedAt
                    ? new Date(cargoData.updatedAt).toLocaleString("es-PE")
                    : "--"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
