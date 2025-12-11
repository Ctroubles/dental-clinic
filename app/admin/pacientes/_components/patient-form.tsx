"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Search, ShoppingCart } from "lucide-react"
import QRCode from "qrcode"
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
import { logger } from "~/config"
import {
  useCreatePatient,
  useLookUpPatientInfoByDni,
  useUpdatePatient,
} from "@/features/patients/hooks"
import {
  type Patient,
  type PatientInsert,
  patientInsertSchema,
} from "@/domain/entities/patient"

function isPatient(member?: Patient | null): member is Patient {
  return !!member && "id" in member
}

function generateQrDataForPatient(member: Patient) {
  const qrPayload = {
    id: member.id,
    dni: member.dni,
    firstName: member.firstName,
    lastName: member.lastName,
    phone: member.phone,
    origin: member.origin,
    dateOfBirth: member.dateOfBirth,
    gender: member.gender,
    isValidCCCode: true,
  }
  return JSON.stringify(qrPayload)
}

const defaultDate = new Date()

export default function PatientForm({
  initialData,
  pageTitle,
}: {
  initialData?: Patient | null
  pageTitle: string
}) {
  const router = useRouter()

  const { mutateAsync: createPatient, isPending: isCreating } =
    useCreatePatient()
  const { mutateAsync: updatePatient, isPending: isUpdating } =
    useUpdatePatient()
  const { mutateAsync: lookUpPatient, isPending: isLookingUp } =
    useLookUpPatientInfoByDni({ dni: "" })

  const defaultValues: PatientInsert = useMemo(
    () => ({
      dni: initialData?.dni || "",
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      phone: initialData?.phone || null,
      origin: initialData?.origin || null,
      dateOfBirth: initialData?.dateOfBirth
        ? new Date(initialData.dateOfBirth)
        : defaultDate,
      gender: initialData?.gender || "M",
    }),
    [initialData]
  )

  const form = useForm<PatientInsert>({
    resolver: zodResolver(patientInsertSchema),
    values: defaultValues,
  })

  const watchedValues = form.watch()

  async function onSubmit(values: PatientInsert) {
    if (isPatient(initialData)) {
      await updatePatient({ patientId: initialData.id, patient: values })
    } else {
      await createPatient(values)
    }

    router.push(`/admin/pacientes`)
  }

  const calculateAge = (dateOfBirth: Date | null): number | null => {
    if (!dateOfBirth) return null

    try {
      // Parse YYYY-MM-DD format
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

      return age >= 0 ? age : null
    } catch (error) {
      logger.error("[FormPatient.calculateAge] error", error)
      return null
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

    return `${firstInitial}${lastInitial}` || "U"
  }

  async function handleLookupPatient() {
    if (isLookingUp) return

    // Use Zod validation instead of manual validation
    const isDniValid = await form.trigger("dni")
    if (!isDniValid) {
      return // Zod validation will show the error message
    }

    const currentDni = form.getValues("dni")
    try {
      const patientData = await lookUpPatient(currentDni)
      if (patientData) {
        // Fill the form with the looked up data
        form.reset(patientData)
      }
    } catch (error) {
      logger.error("[handleLookupPatient] error", error)
    }
  }

  const [qrCode, setQrCode] = useState<string | null>(null)

  useEffect(() => {
    if (!initialData || !isPatient(initialData)) return
    async function generateQrs() {
      const qrString = generateQrDataForPatient(initialData as Patient)
      const image = await QRCode.toDataURL(qrString, { width: 200 })
      setQrCode(image)
    }
    generateQrs()
  }, [initialData])

  const isLoading = isCreating || isUpdating
  const calculatedAge = calculateAge(watchedValues.dateOfBirth || null)

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
                src="/generic-user-avatar.jpg"
                alt="Avatar del paciente"
              />
              <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                {getInitials()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1">
              <h3 className="text-xl font-semibold text-foreground">
                {getFullName()}
              </h3>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {watchedValues.dni && (
                  <div className="flex items-center gap-1">
                    <span className="font-medium">DNI:</span>
                    <span>{watchedValues.dni}</span>
                  </div>
                )}

                {calculatedAge !== null && (
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Edad:</span>
                    <span>{calculatedAge} años</span>
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
              </div>

              {watchedValues.phone && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">WhatsApp:</span>{" "}
                  {watchedValues.phone}
                </div>
              )}
            </div>
          </div>
        </div>

        {qrCode && (
          <div className="flex justify-center items-center">
            <Image
              src={qrCode || "/placeholder.svg"}
              alt="QR Code"
              width={200}
              height={200}
            />
          </div>
        )}

        {/* {isPatient(initialData) && (
          <div className="flex justify-center pt-2">
            <Link href={`/admin/ventas/nueva?patientId=${initialData?.id}`}>
              <Button variant="outline" className="gap-2">
                <ShoppingCart className="w-4 h-4" />
                Registrar atención o venta
              </Button>
            </Link>
          </div>
        )} */}

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

              {/* DNI - Full width with lookup button */}
              <FormField
                control={form.control}
                name="dni"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">DNI *</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Ingrese su DNI de 8 dígitos"
                          {...field}
                          className="h-11 flex-1"
                          type="number"
                          onChange={async e => {
                            field.onChange(e)
                            if (e.target.value.length === 8) {
                              await form.trigger("dni")
                            }
                          }}
                          onKeyDown={e => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              handleLookupPatient()
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleLookupPatient}
                          disabled={
                            isLookingUp ||
                            !field.value ||
                            field.value.length !== 8
                          }
                          className="h-11 px-3 bg-transparent"
                        >
                          {isLookingUp ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Search className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          placeholder="Ingrese sus nombres"
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
                          placeholder="Ingrese sus apellidos"
                          {...field}
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Gender, Age Display, and Date of Birth - Same row on large screens */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Fecha de Nacimiento{" "}
                        <span className="text-muted-foreground font-normal">
                          (opcional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="YYYY-MM-DD"
                          {...field}
                          value={
                            field.value
                              ? new Date(field.value).toISOString().slice(0, 10)
                              : ""
                          }
                          onChange={e => {
                            if (e.target.value === "") {
                              field.onChange(null)
                            } else {
                              // Convert string to Date object
                              const dateValue = new Date(e.target.value)
                              field.onChange(dateValue)
                            }
                          }}
                          type="date"
                          className="h-11"
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
                        value={field.value || " "}
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

            {/* Contact Information Section */}
            <div className="space-y-6">
              <div className="border-b pb-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Información de Contacto
                </h3>
                <p className="text-sm text-muted-foreground">
                  Datos de comunicación
                </p>
              </div>

              {/* Phone and Origin - Same row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        WhatsApp{" "}
                        <span className="text-muted-foreground font-normal">
                          (opcional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingrese su número de WhatsApp"
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
                  name="origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Procedencia{" "}
                        <span className="text-muted-foreground font-normal">
                          (opcional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingrese su lugar de procedencia"
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
                        />
                      </FormControl>
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
                  <span>Guardar Paciente</span>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
