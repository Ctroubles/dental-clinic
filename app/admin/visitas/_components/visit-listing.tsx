"use client"

import { useMemo } from "react"
import { parseAsInteger, parseAsString } from "nuqs"
import { useParsedQuery } from "~/hooks/use-parsed-query"
import { useGetVisits } from "@/features/visits/hooks"
import { IGetVisitsUseCaseInput } from "@/application/use-cases/visits/get-visits.use-case"
import { VisitTable } from "./visit-table"

export const visitParsers = {
  search: parseAsString,
  patientId: parseAsString,
  doctorId: parseAsString,
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(10),
}

export default function VisitListingPage() {
  const filters = useParsedQuery(visitParsers)

  const request: IGetVisitsUseCaseInput = useMemo(() => {
    return {
      filters: {
        search: filters.search,
        patientId: filters.patientId,
        doctorId: filters.doctorId,
      },
      page: filters.page,
      pageSize: filters.pageSize,
    }
  }, [filters])

  const { data, isLoading } = useGetVisits(request)

  return (
    <div className="flex flex-col flex-1">
      <VisitTable data={data} isLoading={isLoading} />
    </div>
  )
}
