"use client"

import { notFound } from "next/navigation"
import FormCardSkeleton from "~/app/_components/form-card-skeleton"
import { useGetVisitById } from "@/features/visits/hooks"
import VisitSimpleForm from "../../_components/visit-simple-form"
import VisitDetails from "./visit-details"

type TVisitViewPageProps = {
  visitId: string
}

export default function VisitViewPage({
  visitId: visitId,
}: TVisitViewPageProps) {
  const { data: visit = null, isLoading } = useGetVisitById(visitId)

  if (visitId === "nueva") {
    return (
      <VisitSimpleForm initialData={null} pageTitle={"Agregar nueva visita"} />
    )
  }

  if (isLoading) {
    return <FormCardSkeleton />
  }

  if (!visit) {
    notFound()
  }

  return <VisitDetails visit={visit} />
}
