"use client"

import { useCallback, useMemo, useState } from "react"
import { parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs"
import { DataTableSkeleton } from "~/app/_components/ui/table/data-table-skeleton"
import { PageableDataTable } from "~/app/_components/ui/table/pageable-data-table"
import { useParsedQuery } from "~/hooks/use-parsed-query"
import { useGetPatients } from "@/features/patients/hooks"
import { PatientsFilters } from "@/features/patients/types"
import { IGetPatientsUseCaseInput } from "@/application/use-cases/patients/get-patients.use-case"
import { Patient } from "@/domain/entities/patient"
import { genderEnum } from "@/domain/enums/gender.enum"
import { PatientTable } from "./patient-tables"
import { columns } from "./patient-tables/columns"

const parser = {
  search: parseAsString,
  gender: parseAsStringEnum(genderEnum.options),
  page: parseAsInteger,
  pageSize: parseAsInteger,
}

export default function PatientListingPage() {
  const filters = useParsedQuery(parser)

  const request: IGetPatientsUseCaseInput = useMemo(() => {
    return {
      filters: {
        search: filters.search,
        gender: filters.gender,
      },
      page: filters.page || 1,
      pageSize: filters.pageSize || 10,
    }
  }, [filters])

  const { data, isLoading } = useGetPatients(request)
  return (
    <div className="flex flex-col flex-1">
      <PageableDataTable data={data} columns={columns} isLoading={isLoading} />
    </div>
  )
}
