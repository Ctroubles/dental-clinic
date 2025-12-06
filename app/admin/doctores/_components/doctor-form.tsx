"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/app/_components/ui/avatar"
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
import { useCreateDoctor, useUpdateDoctor } from "@/features/doctors/hooks"
import {
  type Doctor,
  type DoctorInsert,
  doctorInsertSchema,
} from "@/domain/entities/doctor"

function isDoctor(member: DoctorInsert | Doctor | null): member is Doctor {
  return !!member && ("_id" in member || "id" in member)
}

export default function DoctorForm({
  initialData,
  pageTitle,
}: {
  initialData: DoctorInsert | Doctor | null
  pageTitle: string
}) {
  const router = useRouter()

  const { mutateAsync: createDoctor, isPending: isCreating } = useCreateDoctor()
  const { mutateAsync: updateDoctor, isPending: isUpdating } = useUpdateDoctor()

  const defaultValues: DoctorInsert = {
    userId: initialData?.userId || null,
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    phone: initialData?.phone || null,
    gender: initialData?.gender || null,
  }

  const form = useForm<DoctorInsert>({
    resolver: zodResolver(doctorInsertSchema),
    values: defaultValues,
  })

  const watchedValues = form.watch()

  async function onSubmit(values: DoctorInsert) {
    if (isDoctor(initialData)) {
      await updateDoctor({ doctorId: initialData.id, doctor: values })
    } else {
      const response = await createDoctor(values)
      router.push(`/admin/doctores/${response.id}`)
    }
  }

  const getFullName = (): string => {
    const firstName = watchedValues.firstName?.trim() || ""
    const lastName = watchedValues.lastName?.trim() || ""

    if (!firstName && !lastName) return "Sin nombre"
    if (!firstName) return lastName
    if (!lastName) return firstName
    return `${firstName} ${lastName}`
  }

  const getInitials = (): string => {
    const firstName = watchedValues.firstName?.trim() || ""
    const lastName = watchedValues.lastName?.trim() || ""

    const firstInitial = firstName.charAt(0).toUpperCase()
    const lastInitial = lastName.charAt(0).toUpperCase()

    return `${firstInitial}${lastInitial}` || "D"
  }

  const getDisplayName = (): string => {
    const fullName = getFullName()
    return `Dr. ${fullName}`
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
        <div className="bg-muted/30 rounded-lg p-6 border">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src="/generic-doctor-avatar.jpg"
                alt="Avatar del doctor"
              />
              <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                {getInitials()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1">
              <h3 className="text-xl font-semibold text-foreground">
                {getDisplayName()}
              </h3>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {watchedValues.phone && (
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Teléfono:</span>
                    <span>{watchedValues.phone}</span>
                  </div>
                )}

                {watchedValues.gender && (
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Sexo:</span>
                    <span>
                      {watchedValues.gender === "M" ? "Masculino" : "Femenino"}
                    </span>
                  </div>
                )}

                {watchedValues.userId && (
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Usuario:</span>
                    <span className="text-green-600">Asociado</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="border-b pb-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Información Personal
                </h3>
                <p className="text-sm text-muted-foreground">
                  Datos básicos de identificación
                </p>
              </div>

              {/* Names - Same row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Nombres *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingrese los nombres"
                          {...field}
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Apellidos *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingrese los apellidos"
                          {...field}
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Phone and Gender - Same row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Teléfono{" "}
                        <span className="text-muted-foreground font-normal">
                          (opcional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingrese el número de teléfono"
                          {...field}
                          value={field.value || ""}
                          onChange={e => {
                            if (e.target.value === "") {
                              field.onChange(null)
                            } else {
                              field.onChange(e.target.value)
                            }
                          }}
                          className="h-11"
                          type="tel"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Sexo{" "}
                        <span className="text-muted-foreground font-normal">
                          (opcional)
                        </span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Seleccione el sexo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value=" ">Seleccione el sexo</SelectItem>
                          <SelectItem value="M">Masculino</SelectItem>
                          <SelectItem value="F">Femenino</SelectItem>
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
                  <span>Guardar Doctor</span>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
