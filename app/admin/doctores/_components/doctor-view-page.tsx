"use client"

import { notFound } from "next/navigation"
import FormCardSkeleton from "~/app/_components/form-card-skeleton"
import { useGetDoctorById } from "@/features/doctors/hooks/api/queries"
import DoctorForm from "./doctor-form"

type TDoctorViewPageProps = {
  doctorId: string
}

export default function DoctorViewPage({
  doctorId: doctorId,
}: TDoctorViewPageProps) {
  let pageTitle = "Agregar nuevo doctor"

  const { data: doctorData = null, isLoading } = useGetDoctorById(doctorId)

  if (isLoading) {
    return <FormCardSkeleton />
  }

  if (doctorId !== "nuevo") {
    pageTitle = "Editar doctor"

    if (!isLoading && !doctorData) {
      notFound()
    }
  }

  return <DoctorForm initialData={doctorData} pageTitle={pageTitle} />
}
