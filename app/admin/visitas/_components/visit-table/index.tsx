import { PageableDataTable } from "~/app/_components/ui/table/pageable-data-table"
import { PageableResult } from "@/application/common/pagination"
import { Visit } from "@/domain/entities"
import { columns } from "./columns"

interface VisitTableProps {
  data?: PageableResult<Visit>
  isLoading: boolean
}

export const VisitTable = ({ data, isLoading }: VisitTableProps) => {
  return (
    <PageableDataTable data={data} columns={columns} isLoading={isLoading} />
  )
}
