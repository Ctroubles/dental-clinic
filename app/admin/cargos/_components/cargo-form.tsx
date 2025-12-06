"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Package, ShoppingCart } from "lucide-react"
import { useForm } from "react-hook-form"
import { Button } from "~/app/_components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form"
import { Input } from "~/app/_components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select"
import {
  type TrackedCharge,
  type TrackedChargeInsert,
  trackedChargeInsertSchema,
} from "@/domain/entities/tracked-charge"
import {
  formatCurrency,
  formatItemType,
  formatPaymentStatus,
  getChargeProgressStatusLabel,
} from "../../../../src/features/cargos/helpers"
import {
  useCreateCargo,
  useDeleteCargo,
  useUpdateCargo,
} from "../../../../src/features/cargos/hooks"

function isCargo(
  cargo: TrackedChargeInsert | TrackedCharge | null
): cargo is TrackedCharge {
  return !!cargo && ("_id" in cargo || "id" in cargo)
}

export default function CargoForm({
  initialData,
  pageTitle,
  patientId,
  doctorId,
  visitId,
}: {
  initialData: TrackedChargeInsert | TrackedCharge | null
  pageTitle: string
  patientId?: string
  doctorId?: string
  visitId?: string
}) {
  const router = useRouter()

  const { mutateAsync: createCargo, isPending: isCreating } = useCreateCargo()
  const { mutateAsync: updateCargo, isPending: isUpdating } = useUpdateCargo()
  const { mutateAsync: deleteCargo, isPending: isDeleting } = useDeleteCargo()

  const defaultValues: TrackedChargeInsert = {
    patientId: initialData?.patientId || patientId || "",
    doctorId: initialData?.doctorId || doctorId || "",
    itemId: initialData?.itemId || "",
    type: initialData?.type || "service",
    description: initialData?.description || "",
    totalPrice: initialData?.totalPrice || 0,
    paidAmount: initialData?.paidAmount || 0,
    paymentStatus: initialData?.paymentStatus || "unpaid",
    progressStatus: initialData?.progressStatus || "inProgress",
    visitIds: initialData?.visitIds || [],
  }

  const form = useForm<TrackedChargeInsert>({
    resolver: zodResolver(trackedChargeInsertSchema),
    values: defaultValues,
  })

  const watchedValues = form.watch()

  async function onSubmit(values: TrackedChargeInsert) {
    if (isCargo(initialData)) {
      await updateCargo({ cargoId: initialData.id, cargo: values })
    } else {
      const response = await createCargo(values)
      if (visitId) {
        router.push(`/admin/visitas/${visitId}/cargos`)
      } else {
        router.push(`/admin/cargos/${response.id}`)
      }
    }
  }

  async function handleDelete() {
    if (!isCargo(initialData)) return

    if (confirm("¿Estás seguro de que quieres eliminar este cargo?")) {
      await deleteCargo(initialData.id)
      if (visitId) {
        router.push(`/admin/visitas/${visitId}/cargos`)
      } else {
        router.push("/admin/cargos")
      }
    }
  }

  const isLoading = isCreating || isUpdating
  const remainingAmount = watchedValues.totalPrice - watchedValues.paidAmount

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-start">
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cargo Info Display */}
        <div className="bg-muted/30 rounded-lg p-6 border">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
              {watchedValues.type === "service" ? (
                <ShoppingCart className="h-8 w-8 text-primary" />
              ) : (
                <Package className="h-8 w-8 text-primary" />
              )}
            </div>

            <div className="flex-1 space-y-1">
              <h3 className="text-xl font-semibold text-foreground">
                {watchedValues.description || "Sin descripción"}
              </h3>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span className="font-medium">Tipo:</span>
                  <span>{formatItemType(watchedValues.type)}</span>
                </div>

                <div className="flex items-center gap-1">
                  <span className="font-medium">Total:</span>
                  <span>{formatCurrency(watchedValues.totalPrice)}</span>
                </div>

                <div className="flex items-center gap-1">
                  <span className="font-medium">Pagado:</span>
                  <span>{formatCurrency(watchedValues.paidAmount)}</span>
                </div>

                <div className="flex items-center gap-1">
                  <span className="font-medium">Restante:</span>
                  <span
                    className={
                      remainingAmount > 0 ? "text-red-600" : "text-green-600"
                    }
                  >
                    {formatCurrency(remainingAmount)}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <span className="font-medium">Estado Pago:</span>
                  <span
                    className={
                      watchedValues.paymentStatus === "paid"
                        ? "text-green-600"
                        : watchedValues.paymentStatus === "partiallyPaid"
                          ? "text-yellow-600"
                          : "text-red-600"
                    }
                  >
                    {formatPaymentStatus(watchedValues.paymentStatus)}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <span className="font-medium">Progreso:</span>
                  <span
                    className={
                      watchedValues.progressStatus === "completed"
                        ? "text-green-600"
                        : "text-blue-600"
                    }
                  >
                    {getChargeProgressStatusLabel(watchedValues.progressStatus)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons for existing cargos */}
        {isCargo(initialData) && (
          <div className="flex justify-center gap-4 pt-2">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="gap-2"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>Eliminar</span>
              )}
            </Button>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <div className="border-b pb-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Información del Cargo
                </h3>
                <p className="text-sm text-muted-foreground">
                  Datos principales del servicio o producto a cargar
                </p>
              </div>

              {/* Type and Description */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Tipo *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Seleccione el tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="service">Servicio</SelectItem>
                          <SelectItem value="product">Producto</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Descripción *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Descripción del cargo"
                          {...field}
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Pricing Information */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="totalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Precio Total *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0.00"
                          {...field}
                          type="number"
                          step="0.01"
                          min="0"
                          className="h-11"
                          onChange={e =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paidAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Monto Pagado *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0.00"
                          {...field}
                          type="number"
                          step="0.01"
                          min="0"
                          className="h-11"
                          onChange={e =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Status Information */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="paymentStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Estado de Pago *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Seleccione el estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="unpaid">Sin Pagar</SelectItem>
                          <SelectItem value="partiallyPaid">
                            Pago Parcial
                          </SelectItem>
                          <SelectItem value="paid">Pagado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="progressStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Estado de Progreso *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Seleccione el estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="inProgress">
                            En Progreso
                          </SelectItem>
                          <SelectItem value="completed">Completado</SelectItem>
                          <SelectItem value="cancelled">Cancelado</SelectItem>
                          <SelectItem value="onHold">En Espera</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-11 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <span>
                    {isCargo(initialData) ? "Actualizar Cargo" : "Crear Cargo"}
                  </span>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
