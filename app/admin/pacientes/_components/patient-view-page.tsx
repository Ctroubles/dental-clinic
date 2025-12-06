"use client"

import { notFound } from "next/navigation"
import FormCardSkeleton from "~/app/_components/form-card-skeleton"
import { useGetPatientById } from "@/features/patients/hooks/api/queries"
import PatientForm from "./patient-form"
import PatientHistory from "./patient-history/patient-history"

type TPatientViewPageProps = {
  patientId: string
}

export default function MemberViewPage({
  patientId: patientId,
}: TPatientViewPageProps) {
  let pageTitle = "Agregar nuevo paciente"

  const { data: patient, isLoading } = useGetPatientById(patientId)

  if (isLoading) {
    return <FormCardSkeleton />
  }

  const isCreating = patientId === "nuevo"

  if (!isCreating) {
    pageTitle = "Editar paciente"

    if (!isLoading && !patient) {
      notFound()
    }
  }

  return (
    <article className="space-y-8 pb-10">
      <PatientForm initialData={patient} pageTitle={pageTitle} />
      {!isCreating && (
        <article className="">
          <PatientHistory
            patientVisits={patient?.visits || []}
            patientCharges={patient?.charges || []}
          />
        </article>
      )}
    </article>
  )
}
