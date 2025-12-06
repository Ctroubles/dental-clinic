"use client"

import { useMemo } from "react"
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs"
import { PageableDataTable } from "~/app/_components/ui/table/pageable-data-table"
import { useGetItems } from "@/features/items/hooks"
import { ItemTypeEnum } from "@/domain/enums"
import { columns } from "./item-table/columns"

export default function ItemListingPage() {
  const [filters] = useQueryStates({
    search: parseAsString,
    isActive: parseAsBoolean,
    type: parseAsStringEnum(ItemTypeEnum.options),
    page: parseAsInteger.withDefault(1),
    pageSize: parseAsInteger.withDefault(10),
  })

  const request = useMemo(() => {
    return {
      filters: {
        search: filters.search,
        isActive: filters.isActive,
        type: filters.type,
      },
      page: filters.page,
      pageSize: filters.pageSize,
    }
  }, [filters])

  const { data, isLoading } = useGetItems(request)

  return (
    <div className="flex flex-col flex-1">
      <PageableDataTable data={data} columns={columns} isLoading={isLoading} />
    </div>
  )
}
