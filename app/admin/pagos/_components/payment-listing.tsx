"use client"

import { useMemo } from "react"
import { parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs"
import { PageableDataTable } from "~/app/_components/ui/table/pageable-data-table"
import { useParsedQuery } from "~/hooks/use-parsed-query"
import { useGetPayments } from "@/features/payments/hooks"
import { IGetAllPaymentsUseCaseInput } from "@/application/use-cases/payments/get-all-payments.use-case"
import { PaymentMethodEnum } from "@/domain/enums"
import { columns } from "./payment-tables/columns"

const parser = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(10),
  search: parseAsString,
  method: parseAsStringEnum(PaymentMethodEnum.options),
}

export default function PaymentsListingPage() {
  const filter = useParsedQuery(parser)

  const request: IGetAllPaymentsUseCaseInput = useMemo(() => {
    return {
      filters: {
        method: filter.method,
        search: filter.search,
      },
      page: filter.page,
      pageSize: filter.pageSize,
    }
  }, [filter])

  const { data, isLoading } = useGetPayments(request)

  return (
    <PageableDataTable data={data} isLoading={isLoading} columns={columns} />
  )
}
