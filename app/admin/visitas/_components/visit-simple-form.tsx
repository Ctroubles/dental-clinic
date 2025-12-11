"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  Calendar,
  Loader2,
  MapPin,
  Search,
  Stethoscope,
  User,
} from "lucide-react"
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
import { Textarea } from "~/app/_components/ui/textarea"
import { useGetDoctors } from "@/features/doctors/hooks"
import { useGetLocations } from "@/features/locations/hooks"
import { useGetPatients } from "@/features/patients/hooks"
import { useCreateVisit, useUpdateVisit } from "@/features/visits/hooks"
import {
  type Visit,
  type VisitInsert,
  visitInsertSchema,
} from "@/domain/entities/visit"

function isVisit(visit: VisitInsert | Visit | null): visit is Visit {
  return !!visit && ("_id" in visit || "id" in visit)
}

// Helper function to format date for datetime-local input
const formatDateForInput = (date: Date): string => {
  // ensure year is 4 digits
  const year = String(date.getFullYear()).padStart(4, "0").slice(0, 4)
  // ensure month is 2 digits
  const month = String(date.getMonth() + 1)
    .padStart(2, "0")
    .slice(0, 2)
  // ensure day is 2 digits
  const day = String(date.getDate()).padStart(2, "0").slice(0, 2)
  // ensure hours is 2 digits
  const hours = String(date.getHours()).padStart(2, "0").slice(0, 2)
  // ensure minutes is 2 digits
  const minutes = String(date.getMinutes()).padStart(2, "0").slice(0, 2)

  // Return the formatted date string in the format: YYYY-MM-DDTHH:MM
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * VisitSimpleForm is currently used to create a new visit only.
 */
export default function VisitSimpleForm({
  initialData,
  pageTitle,
}: {
  initialData: VisitInsert | Visit | null
  pageTitle: string
}) {
  const router = useRouter()

  const { mutateAsync: createVisit, isPending: isCreating } = useCreateVisit()
  const { mutateAsync: updateVisit, isPending: isUpdating } = useUpdateVisit()

  const [patientSearch, setPatientSearch] = useState("")
  const [doctorSearch, setDoctorSearch] = useState("")
  const [locationSearch, setLocationSearch] = useState("")

  const { data: patientsData, isLoading: isLoadingPatients } = useGetPatients({
    page: 1,
    pageSize: 1000,
  })
  const { data: doctorsData, isLoading: isLoadingDoctors } = useGetDoctors({
    page: 1,
    pageSize: 1000,
  })
  const { data: locationsData, isLoading: isLoadingLocations } =
    useGetLocations({
      page: 1,
      pageSize: 1000,
    })

  const defaultValues = useMemo<VisitInsert>(
    () => ({
      patientId: initialData?.patientId || "",
      doctorId: initialData?.doctorId || "",
      locationId: initialData?.locationId || "",
      date: initialData?.date ? new Date(initialData.date) : new Date(),
      notes: initialData?.notes || null,
    }),
    [initialData]
  )

  const form = useForm<VisitInsert>({
    resolver: zodResolver(visitInsertSchema),
    values: defaultValues,
  })

  const selectedPatientId = form.watch("patientId")
  const filteredPatients = useMemo(() => {
    const patients = patientsData?.records || []
    if (!patients.length) return []
    if (!patientSearch.trim()) return patients

    const searchLower = patientSearch.toLowerCase().trim()
    const filtered = patients.filter(
      patient =>
        patient.firstName?.toLowerCase().includes(searchLower) ||
        patient.lastName?.toLowerCase().includes(searchLower) ||
        patient.dni?.toLowerCase().includes(searchLower)
    )

    if (
      selectedPatientId &&
      !filtered.some(patient => patient.id === selectedPatientId)
    ) {
      const selectedPatient = patients.find(
        patient => patient.id === selectedPatientId
      )
      if (selectedPatient) {
        return [selectedPatient, ...filtered]
      }
    }

    return filtered
  }, [patientsData, patientSearch, selectedPatientId])

  const selectedDoctorId = form.watch("doctorId")
  const filteredDoctors = useMemo(() => {
    const doctors = doctorsData?.records || []
    if (!doctors.length) return []
    if (!doctorSearch.trim()) return doctors

    const searchLower = doctorSearch.toLowerCase().trim()
    const filtered = doctors.filter(
      doctor =>
        doctor.firstName?.toLowerCase().includes(searchLower) ||
        doctor.lastName?.toLowerCase().includes(searchLower)
    )

    if (
      selectedDoctorId &&
      !filtered.some(doctor => doctor.id === selectedDoctorId)
    ) {
      const selectedDoctor = doctors.find(
        doctor => doctor.id === selectedDoctorId
      )
      if (selectedDoctor) {
        return [selectedDoctor, ...filtered]
      }
    }

    return filtered
  }, [doctorsData, doctorSearch, selectedDoctorId])

  const selectedLocationId = form.watch("locationId")
  const filteredLocations = useMemo(() => {
    const locations = locationsData?.records || []
    if (!locations.length) return []
    if (!locationSearch.trim()) return locations

    const searchLower = locationSearch.toLowerCase().trim()
    const filtered = locations.filter(
      location =>
        location.name?.toLowerCase().includes(searchLower) ||
        location.description?.toLowerCase().includes(searchLower)
    )

    if (
      selectedLocationId &&
      !filtered.some(location => location.id === selectedLocationId)
    ) {
      const selectedLocation = locations.find(
        location => location.id === selectedLocationId
      )
      if (selectedLocation) {
        return [selectedLocation, ...filtered]
      }
    }

    return filtered
  }, [locationsData, locationSearch, selectedLocationId])

  const watchedValues = form.watch()

  useEffect(() => {
    if (isLoadingDoctors) {
      return
    }
    if (watchedValues.doctorId) {
      return
    }

    const doctors = doctorsData?.records || []
    if (doctors.length <= 0) return

    const firstDoctor = doctors[0]

    if (firstDoctor?.id) {
      form.setValue("doctorId", firstDoctor.id)
    }
  }, [isLoadingDoctors, doctorsData, form.setValue, watchedValues.doctorId])

  async function onSubmit(values: VisitInsert) {
    if (isVisit(initialData)) {
      await updateVisit({ visitId: initialData.id, visit: values })
      router.push(`/admin/visitas/${initialData.id}/cargos`)
    } else {
      const response = await createVisit(values)
      router.push(`/admin/visitas/${response.id}/cargos`)
    }
  }

  const isLoading = isCreating || isUpdating

  const isCreationMode = !isVisit(initialData)

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
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-primary" />
            </div>

            <div className="flex-1 space-y-1">
              <h3 className="text-xl font-semibold text-foreground">
                Nueva Visita
              </h3>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {watchedValues.patientId && (
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span className="font-medium">Paciente:</span>
                    <span>
                      {
                        patientsData?.records.find(
                          p => p.id === watchedValues.patientId
                        )?.firstName
                      }{" "}
                      {
                        patientsData?.records.find(
                          p => p.id === watchedValues.patientId
                        )?.lastName
                      }
                    </span>
                  </div>
                )}

                {watchedValues.doctorId && (
                  <div className="flex items-center gap-1">
                    <Stethoscope className="w-4 h-4" />
                    <span className="font-medium">Doctor:</span>
                    <span>
                      Dr.{" "}
                      {
                        doctorsData?.records.find(
                          d => d.id === watchedValues.doctorId
                        )?.firstName
                      }{" "}
                      {
                        doctorsData?.records.find(
                          d => d.id === watchedValues.doctorId
                        )?.lastName
                      }
                    </span>
                  </div>
                )}

                {watchedValues.locationId && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="font-medium">Ubicación:</span>
                    <span>
                      {
                        locationsData?.records.find(
                          l => l.id === watchedValues.locationId
                        )?.name
                      }
                    </span>
                  </div>
                )}

                {watchedValues.date &&
                  (() => {
                    const dateToFormat = new Date(watchedValues.date)
                    const isValidDate = !isNaN(dateToFormat.getTime())
                    return isValidDate ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">Fecha:</span>
                        <span>
                          {format(dateToFormat, "dd MMM yyyy, h:mm a", {
                            locale: es,
                          })}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">Fecha:</span>
                        <span>Fecha inválida</span>
                      </div>
                    )
                  })()}
              </div>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Visit Information Section */}
            <div className="space-y-6">
              <div className="border-b pb-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Información de la Visita
                </h3>
                <p className="text-sm text-muted-foreground">
                  Datos básicos de la consulta
                </p>
              </div>

              {/* Patient and Doctor Selectors */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="patientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Paciente *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isLoadingPatients}
                        onOpenChange={open => {
                          if (!open) setPatientSearch("")
                        }}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue
                              placeholder={
                                isLoadingPatients
                                  ? "Cargando pacientes..."
                                  : "Seleccione un paciente"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <div
                            className="relative flex items-center border-b px-3 py-2.5"
                            onClick={e => e.stopPropagation()}
                          >
                            <Search className="absolute left-5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Buscar por nombres o DNI..."
                              value={patientSearch}
                              onChange={e => setPatientSearch(e.target.value)}
                              onClick={e => e.stopPropagation()}
                              onKeyDown={e => e.stopPropagation()}
                              autoFocus
                              className="h-9 border-0 bg-transparent pl-8 pr-3 text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                          </div>
                          {filteredPatients.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                              No se encontraron pacientes
                            </div>
                          ) : (
                            filteredPatients.map(patient => (
                              <SelectItem key={patient.id} value={patient.id}>
                                {patient.firstName} {patient.lastName} -{" "}
                                {patient.dni}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="doctorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Doctor *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isLoadingDoctors}
                        onOpenChange={open => {
                          if (!open) setDoctorSearch("")
                        }}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue
                              placeholder={
                                isLoadingDoctors
                                  ? "Cargando doctores..."
                                  : "Seleccione un doctor"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <div
                            className="relative flex items-center border-b px-3 py-2.5"
                            onClick={e => e.stopPropagation()}
                          >
                            <Search className="absolute left-5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Buscar por nombre..."
                              value={doctorSearch}
                              onChange={e => setDoctorSearch(e.target.value)}
                              onClick={e => e.stopPropagation()}
                              onKeyDown={e => e.stopPropagation()}
                              autoFocus
                              className="h-9 border-0 bg-transparent pl-8 pr-3 text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                          </div>
                          {filteredDoctors.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                              No se encontraron doctores
                            </div>
                          ) : (
                            filteredDoctors.map(doctor => (
                              <SelectItem key={doctor.id} value={doctor.id}>
                                Dr. {doctor.firstName} {doctor.lastName}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Location Selector */}
              <FormField
                control={form.control}
                name="locationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Ubicación *
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoadingLocations}
                      onOpenChange={open => {
                        if (!open) setLocationSearch("")
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue
                            placeholder={
                              isLoadingLocations
                                ? "Cargando ubicaciones..."
                                : "Seleccione una ubicación"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <div
                          className="relative flex items-center border-b px-3 py-2.5"
                          onClick={e => e.stopPropagation()}
                        >
                          <Search className="absolute left-5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Buscar por nombre..."
                            value={locationSearch}
                            onChange={e => setLocationSearch(e.target.value)}
                            onClick={e => e.stopPropagation()}
                            onKeyDown={e => e.stopPropagation()}
                            autoFocus
                            className="h-9 border-0 bg-transparent pl-8 pr-3 text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                        </div>
                        {filteredLocations.length === 0 ? (
                          <div className="py-6 text-center text-sm text-muted-foreground">
                            No se encontraron ubicaciones
                          </div>
                        ) : (
                          filteredLocations.map(location => (
                            <SelectItem key={location.id} value={location.id}>
                              {location.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Fecha y Hora *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="datetime-local"
                        value={formatDateForInput(new Date(field.value))}
                        onChange={e => {
                          const dateValue = e.target.value
                          if (dateValue) {
                            const newDate = new Date(dateValue)

                            // Validate that the Date is valid (not Invalid Date)
                            if (!isNaN(newDate.getTime())) {
                              field.onChange(newDate)
                            }
                          }
                        }}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Notas de la Visita
                      <span className="text-muted-foreground font-normal">
                        {" "}
                        (opcional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ingrese notas sobre la visita..."
                        {...field}
                        value={field.value || ""}
                        onChange={e => {
                          if (e.target.value === "") {
                            field.onChange(null)
                          } else {
                            field.onChange(e.target.value)
                          }
                        }}
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Buttons */}
            <div className="pt-4 space-y-3">
              <Button
                type="submit"
                className="w-full h-11 text-base font-medium"
                disabled={isLoading || !form.formState.isValid}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <span>
                    {isCreationMode ? "Crear Visita" : "Actualizar Visita"} y
                    Registrar Cargos
                  </span>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-10 text-sm"
                disabled={isLoading || !form.formState.isValid}
                onClick={async () => {
                  const values = form.getValues()
                  const isValid = await form.trigger()
                  if (!isValid) {
                    return
                  }

                  if (isVisit(initialData)) {
                    await updateVisit({
                      visitId: initialData.id,
                      visit: values,
                    })
                  } else {
                    await createVisit(values)
                  }
                  router.push(`/admin/visitas`)
                }}
              >
                {isCreationMode ? "Crear Visita" : "Actualizar Visita"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Continúe para agregar servicios o finalice aquí
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
