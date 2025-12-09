"use client"

import { useMemo } from "react"
import { PageableDataTable } from "~/app/_components/ui/table/pageable-data-table"
import { useParsedQuery } from "~/hooks/use-parsed-query"
import { paymentParserFilters } from "@/features/payments/helpers"
import { useGetPayments } from "@/features/payments/hooks"
import { IGetAllPaymentsUseCaseInput } from "@/application/use-cases/payments/get-all-payments.use-case"
import { columns } from "./payment-tables/columns"

export default function PaymentsListingPage() {
  const filter = useParsedQuery(paymentParserFilters)

  const request: IGetAllPaymentsUseCaseInput = useMemo(
    () => ({
      filters: {
        method: filter.method,
        search: filter.search,
      },
      page: filter.page,
      pageSize: filter.pageSize,
    }),
    [filter]
  )

  const { data, isLoading } = useGetPayments(request)

  return (
    <PageableDataTable data={data} isLoading={isLoading} columns={columns} />
  )
}
