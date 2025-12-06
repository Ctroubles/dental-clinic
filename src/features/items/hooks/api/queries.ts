import { makeQuery } from "~/lib/api/queryFactory"
import { type IGetItemsUseCaseInput } from "@/application/use-cases/items/get-items.use-case"
import { itemsQueryKeys } from "../../constants"
import { getItemById, getItems } from "../../requests"
import { ItemsFilters } from "../../types"

export const { useHook: useGetItems } = makeQuery(
  (filters?: IGetItemsUseCaseInput) => ({
    queryFn: () => getItems(filters),
    queryKey: itemsQueryKeys.list(filters),
  })
)

export const { useHook: useGetItemById } = makeQuery((itemId: string) => ({
  queryFn: () => getItemById(itemId),
  queryKey: itemsQueryKeys.detail(itemId),
  enabled: !!itemId && itemId !== "nuevo",
}))
