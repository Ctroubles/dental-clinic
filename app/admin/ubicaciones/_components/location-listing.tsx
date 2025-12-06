"use client"

import { useCallback, useMemo, useState } from "react"
import { parseAsInteger, parseAsString } from "nuqs"
import { DataTableSkeleton } from "~/app/_components/ui/table/data-table-skeleton"
import { PageableDataTable } from "~/app/_components/ui/table/pageable-data-table"
import { useParsedQuery } from "~/hooks/use-parsed-query"
import { useGetLocations } from "@/features/locations/hooks"
import { LocationsFilters } from "@/features/locations/types"
import { IGetLocationsUseCaseInput } from "@/application/use-cases/locations/get-locations.use-case"
import { Location } from "@/domain/entities/location"
import { columns } from "./location-tables/columns"

const parser = {
  search: parseAsString,
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(10),
}

export default function LocationListingPage() {
  const filters = useParsedQuery(parser)

  const request: IGetLocationsUseCaseInput = useMemo(
    () => ({
      filters: {
        search: filters.search,
      },
      page: filters.page,
      pageSize: filters.pageSize,
    }),
    [filters]
  )

  const { data, isLoading } = useGetLocations(request)
  return (
    <PageableDataTable data={data} columns={columns} isLoading={isLoading} />
  )
}
