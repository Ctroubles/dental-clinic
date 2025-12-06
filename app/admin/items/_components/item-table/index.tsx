import { PageableDataTable } from "~/app/_components/ui/table/pageable-data-table"
import { PageableResult } from "@/application/common/pagination"
import { Item } from "@/domain/entities"
import { columns } from "./columns"

interface ItemTableProps {
  data?: PageableResult<Item>
  isLoading: boolean
}

export const ItemTable = ({ data, isLoading }: ItemTableProps) => {
  return (
    <PageableDataTable
      data={data}
      columns={columns}
      isLoading={isLoading}
      shallow={false}
    />
  )
}
