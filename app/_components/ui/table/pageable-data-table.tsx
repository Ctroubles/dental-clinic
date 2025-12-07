import { useMemo } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "~/app/_components/ui/table/data-table"
import { DataTableToolbar } from "~/app/_components/ui/table/data-table-toolbar"
import { useDataTable } from "~/hooks/use-data-table"
import { PageableResult } from "@/application/common/pagination"

interface PageableDataTableProps<TData> {
  /**
   * Pageable result containing the data records and pagination metadata
   */
  data?: PageableResult<TData>

  /**
   * Column definitions for the table
   */
  columns: ColumnDef<TData, unknown>[]

  /**
   * Loading state indicator
   */
  isLoading: boolean

  /**
   * Debounce time in milliseconds for filter changes
   * @default 500
   */
  debounceMs?: number

  /**
   * Whether to use shallow routing (don't trigger server re-render)
   * @default true
   */
  shallow?: boolean
}

const emptyData: unknown[] = []

/**
 * Generic pageable data table component that handles pagination state
 * and renders a data table with toolbar.
 *
 * This component automatically manages:
 * - Pagination state from URL query params
 * - Empty state handling
 * - Loading states
 * - Column filtering via toolbar
 *
 * @example
 * ```tsx
 * <PageableDataTable
 *   data={visitData}
 *   columns={visitColumns}
 *   isLoading={isLoading}
 * />
 * ```
 */
export function PageableDataTable<TData>({
  data,
  columns,
  isLoading,
  debounceMs = 500,
  shallow = true,
}: PageableDataTableProps<TData>) {
  const { table } = useDataTable({
    data: data?.records || (emptyData as TData[]),
    columns,
    pageCount: data?.totalPages || 1,
    shallow,
    debounceMs,
    initialState: {
      pagination: {
        pageSize: data?.pageSize || 10,
        pageIndex: data?.currentPage || 1,
      },
    },
  })

  return (
    <DataTable
      table={table}
      totalRecords={data?.totalRecords}
      isLoading={isLoading}
    >
      <DataTableToolbar table={table} />
    </DataTable>
  )
}
