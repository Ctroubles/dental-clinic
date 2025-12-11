"use client"

import { useMemo } from "react"
import { PageableDataTable } from "~/app/_components/ui/table/pageable-data-table"
import { useParsedQuery } from "~/hooks/use-parsed-query"
import { cargoParserFilters } from "@/features/cargos/helpers/parsers"
import { useGetCargos } from "@/features/cargos/hooks"
import { IGetTrackedChargesUseCaseInput } from "@/application/use-cases/tracked-charges/get-tracked-charges.use-case"
import { columns } from "./cargo-tables/columns"

export default function TrackedChargesListingPage() {
  const filter = useParsedQuery(cargoParserFilters)

  const request: IGetTrackedChargesUseCaseInput = useMemo(
    () => ({
      filters: {
        search: filter.search,
        paymentStatus: filter.paymentStatus,
        progressStatus: filter.progressStatus,
      },
      page: filter.page,
      pageSize: filter.pageSize,
    }),
    [filter]
  )

  const { data, isLoading } = useGetCargos(request)

  return (
    <div className="flex flex-col flex-1">
      <PageableDataTable data={data} isLoading={isLoading} columns={columns} />
    </div>
  )
}
