"use client"

import { notFound } from "next/navigation"
import FormCardSkeleton from "~/app/_components/form-card-skeleton"
import { useGetLocationById } from "@/features/locations/hooks"
import LocationForm from "./location-form"

type TLocationViewPageProps = {
  locationId: string
}

export default function LocationViewPage({
  locationId,
}: TLocationViewPageProps) {
  let pageTitle = "Agregar nueva ubicación"

  const { data: locationData = null, isLoading } =
    useGetLocationById(locationId)

  if (locationId !== "nuevo") {
    pageTitle = "Editar ubicación"

    if (!isLoading && !locationData) {
      notFound()
    }
  }

  if (isLoading) {
    return <FormCardSkeleton />
  }

  return <LocationForm initialData={locationData} pageTitle={pageTitle} />
}
