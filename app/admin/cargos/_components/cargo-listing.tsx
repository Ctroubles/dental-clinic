"use client"

import { useMemo } from "react"
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs"
import { PageableDataTable } from "~/app/_components/ui/table/pageable-data-table"
import { useGetCargos } from "@/features/cargos/hooks"
import { IGetTrackedChargesUseCaseInput } from "@/application/use-cases/tracked-charges/get-tracked-charges.use-case"
import {
  ChargePaymentStatusEnum,
  ChargeProgressStatusEnum,
  ItemTypeEnum,
} from "@/domain/enums"
import { columns } from "./cargo-tables/columns"

export default function TrackedChargesListingPage() {
  const [filters] = useQueryStates({
    search: parseAsString,
    patientId: parseAsString,
    doctorId: parseAsString,
    itemId: parseAsString,
    type: parseAsStringEnum(ItemTypeEnum.options),
    paymentStatus: parseAsStringEnum(ChargePaymentStatusEnum.options),
    progressStatus: parseAsStringEnum(ChargeProgressStatusEnum.options),
    page: parseAsInteger.withDefault(1),
    pageSize: parseAsInteger.withDefault(10),
  })

  const request: IGetTrackedChargesUseCaseInput = useMemo(
    () => ({
      filters: {
        search: filters.search,
        patientId: filters.patientId,
        doctorId: filters.doctorId,
        itemId: filters.itemId,
        type: filters.type,
        paymentStatus: filters.paymentStatus,
        progressStatus: filters.progressStatus,
      },
      page: filters.page,
      pageSize: filters.pageSize,
    }),
    [filters]
  )

  const { data, isLoading } = useGetCargos(request)

  return (
    <div className="flex flex-col flex-1">
      <PageableDataTable data={data} isLoading={isLoading} columns={columns} />
    </div>
  )
}
