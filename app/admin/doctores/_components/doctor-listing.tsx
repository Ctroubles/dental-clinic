"use client"

import { useMemo } from "react"
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs"
import { PageableDataTable } from "~/app/_components/ui/table/pageable-data-table"
import { useGetDoctors } from "@/features/doctors/hooks"
import {
  IGetDoctorsUseCase,
  IGetDoctorsUseCaseInput,
} from "@/application/use-cases/doctors/get-doctors.use-case"
import { genderEnum } from "@/domain/enums/gender.enum"
import { columns } from "./doctor-table/columns"

export default function DoctorListingPage() {
  const [filters] = useQueryStates({
    search: parseAsString,
    gender: parseAsStringEnum(genderEnum.options),
    page: parseAsInteger.withDefault(1),
    pageSize: parseAsInteger.withDefault(10),
  })

  const request: IGetDoctorsUseCaseInput = useMemo(
    () => ({
      filters: {
        search: filters.search,
        gender: filters.gender,
      },
      page: filters.page,
      pageSize: filters.pageSize,
    }),
    [filters]
  )

  const { data, isLoading } = useGetDoctors(request)

  return (
    <div className="flex flex-col flex-1">
      <PageableDataTable data={data} isLoading={isLoading} columns={columns} />
    </div>
  )
}
