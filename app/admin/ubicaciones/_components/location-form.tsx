"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, MapPin } from "lucide-react"
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
import { Textarea } from "~/app/_components/ui/textarea"
import {
  useCreateLocation,
  useDeleteLocation,
  useUpdateLocation,
} from "@/features/locations/hooks"
import {
  type Location,
  type LocationInsert,
  locationInsertSchema,
} from "@/domain/entities/location"

function isLocation(
  location: LocationInsert | Location | null
): location is Location {
  return !!location && ("_id" in location || "id" in location)
}

export default function LocationForm({
  initialData,
  pageTitle,
}: {
  initialData: LocationInsert | null
  pageTitle: string
}) {
  const router = useRouter()

  const { mutateAsync: createLocation, isPending: isCreating } =
    useCreateLocation()
  const { mutateAsync: updateLocation, isPending: isUpdating } =
    useUpdateLocation()
  const { mutateAsync: deleteLocation, isPending: isDeleting } =
    useDeleteLocation()

  const defaultValues: LocationInsert = {
    name: initialData?.name || "",
    description: initialData?.description || null,
  }

  const form = useForm<LocationInsert>({
    resolver: zodResolver(locationInsertSchema),
    values: defaultValues,
  })

  const watchedValues = form.watch()

  async function onSubmit(values: LocationInsert) {
    if (isLocation(initialData)) {
      await updateLocation({ id: initialData.id, location: values as Location })
    } else {
      await createLocation(values)
      router.push(`/admin/ubicaciones`)
    }
  }

  async function handleDelete() {
    if (!isLocation(initialData)) return

    if (confirm("¿Estás seguro de que quieres eliminar esta ubicación?")) {
      await deleteLocation(initialData.id)
      router.push("/admin/ubicaciones")
    }
  }

  const isLoading = isCreating || isUpdating

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-start">
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location Info Display */}
        <div className="bg-muted/30 rounded-lg p-6 border">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
              <MapPin className="h-8 w-8 text-primary" />
            </div>

            <div className="flex-1 space-y-1">
              <h3 className="text-xl font-semibold text-foreground">
                {watchedValues.name || "Sin nombre"}
              </h3>

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

        {/* Action Buttons for existing locations */}
        {/* {isLocation(initialData) && (
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
        )} */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <div className="border-b pb-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Información Básica
                </h3>
                <p className="text-sm text-muted-foreground">
                  Datos principales de la ubicación
                </p>
              </div>

              {/* Name */}
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
                        placeholder="Ej: Consultorio 1, Laboratorio"
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        placeholder="Descripción opcional de la ubicación (máximo 500 caracteres)"
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
                    {isLocation(initialData)
                      ? "Actualizar Ubicación"
                      : "Crear Ubicación"}
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
