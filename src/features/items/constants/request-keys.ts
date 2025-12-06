import { IGetItemsUseCaseInput } from "@/application/use-cases/items/get-items.use-case"

const normalizeRequest = (
  request: IGetItemsUseCaseInput
): IGetItemsUseCaseInput => {
  const normalized: IGetItemsUseCaseInput = {
    filters: {
      search: null,
      type: null,
      isActive: null,
    },
    page: 1,
    pageSize: 10,
  }

  if (request?.filters) normalized.filters = request.filters
  if (request?.page) normalized.page = request.page
  if (request?.pageSize) normalized.pageSize = request.pageSize
  return normalized
}

export const itemsQueryKeys = {
  base: ["items"] as const,
  baseList: ["items", "list"] as const,
  list: (
    request: IGetItemsUseCaseInput = {
      filters: {
        search: null,
        type: null,
        isActive: null,
      },
      page: 1,
      pageSize: 10,
    }
  ) => {
    const normalized = normalizeRequest(request)
    return normalized
      ? ([...itemsQueryKeys.baseList, normalized] as const)
      : ([...itemsQueryKeys.baseList] as const)
  },
  detail: (id: string) => [...itemsQueryKeys.base, id] as const,
  create: () => [...itemsQueryKeys.base, "create"] as const,
  update: (id: string) => [...itemsQueryKeys.base, "update", id] as const,
  delete: (id: string) => [...itemsQueryKeys.base, "delete", id] as const,
  toggleStatus: (id: string) =>
    [...itemsQueryKeys.base, "toggle-status", id] as const,
}
