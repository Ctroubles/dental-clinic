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
import { Switch } from "~/app/_components/ui/switch"
import { Textarea } from "~/app/_components/ui/textarea"
import {
  useCreateItem,
  useDeleteItem,
  useToggleItemStatus,
  useUpdateItem,
} from "@/features/items/hooks"
import {
  type Item,
  type ItemInsert,
  itemInsertSchema,
} from "@/domain/entities/item"

function isItem(item: ItemInsert | Item | null): item is Item {
  return !!item && ("_id" in item || "id" in item)
}

export default function ItemForm({
  initialData,
  pageTitle,
}: {
  initialData: ItemInsert | Item | null
  pageTitle: string
}) {
  const router = useRouter()

  const { mutateAsync: createItem, isPending: isCreating } = useCreateItem()
  const { mutateAsync: updateItem, isPending: isUpdating } = useUpdateItem()
  const { mutateAsync: deleteItem, isPending: isDeleting } = useDeleteItem()
  const { mutateAsync: toggleItemStatus, isPending: isToggling } =
    useToggleItemStatus()

  const defaultValues: ItemInsert = {
    code: initialData?.code || "",
    name: initialData?.name || "",
    type: initialData?.type || "service",
    defaultPrice: initialData?.defaultPrice || 0,
    isActive: initialData?.isActive ?? true,
    description: initialData?.description || null,
  }

  const form = useForm<ItemInsert>({
    resolver: zodResolver(itemInsertSchema),
    values: defaultValues,
  })

  const watchedValues = form.watch()

  async function onSubmit(values: ItemInsert) {
    if (isItem(initialData)) {
      await updateItem({ itemId: initialData.id, item: values })
    } else {
      const response = await createItem(values)
      router.push("/admin/items")
    }
  }

  async function handleDelete() {
    if (!isItem(initialData)) return

    if (confirm("¿Estás seguro de que quieres eliminar este item?")) {
      await deleteItem(initialData.id)
      router.push("/admin/items")
    }
  }

  async function handleToggleStatus() {
    if (!isItem(initialData)) return

    // optimistic update
    await toggleItemStatus(initialData.id)
      .then(() => {
        form.setValue("isActive", !watchedValues.isActive)
      })
      .catch(() => {
        form.setValue("isActive", watchedValues.isActive)
      })
  }

  const isLoading = isCreating || isUpdating
  const isItemActive = form.watch("isActive")

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-start">
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Item Info Display */}
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
                {watchedValues.name || "Sin nombre"}
              </h3>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {watchedValues.code && (
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Código:</span>
                    <span className="font-mono">{watchedValues.code}</span>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <span className="font-medium">Tipo:</span>
                  <span>
                    {watchedValues.type === "service" ? "Servicio" : "Producto"}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <span className="font-medium">Precio:</span>
                  <span>
                    S/ {watchedValues.defaultPrice?.toFixed(2) || "0.00"}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <span className="font-medium">Estado:</span>
                  <span
                    className={isItemActive ? "text-green-600" : "text-red-600"}
                  >
                    {isItemActive ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>

              {watchedValues.description && (
                <div className="mt-3 pt-3 border-t">
                  <div className="text-sm">
                    <span className="font-medium text-muted-foreground">
                      Descripción:
                    </span>
                    <p className="mt-1 text-foreground">
                      {watchedValues.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons for existing items */}
        {isItem(initialData) && (
          <div className="flex justify-center gap-4 pt-2">
            <Button
              variant="outline"
              onClick={handleToggleStatus}
              disabled={isToggling}
              className="gap-2"
            >
              {isToggling ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>{isItemActive ? "Desactivar" : "Activar"}</span>
              )}
            </Button>
            {/* <Button
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
            </Button> */}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <div className="border-b pb-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Información Básica
                </h3>
                <p className="text-sm text-muted-foreground">
                  Datos principales del servicio o producto
                </p>
              </div>

              {/* Code and Name */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Código *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: SRV001, PROD010"
                          {...field}
                          className="h-11 font-mono"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Nombre *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Limpieza dental, Cepillo dental"
                          {...field}
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Type and Price */}
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
                  name="defaultPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Precio por Defecto *
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

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Descripción
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descripción opcional del servicio o producto (máximo 500 caracteres)"
                        {...field}
                        value={field.value || ""}
                        onChange={e => field.onChange(e.target.value || null)}
                        className="min-h-[100px] resize-none"
                        maxLength={500}
                      />
                    </FormControl>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <FormMessage />
                      <span>{field.value?.length || 0}/500 caracteres</span>
                    </div>
                  </FormItem>
                )}
              />

              {/* Active Status */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Estado Activo</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Determina si el item está disponible para uso
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
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
                    {isItem(initialData) ? "Actualizar Item" : "Crear Item"}
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
