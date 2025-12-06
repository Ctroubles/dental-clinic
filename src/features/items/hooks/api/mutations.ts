import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { makeMutation } from "~/lib/api/queryFactory"
import { itemsQueryKeys } from "@/features/items/constants"
import {
  createItem,
  deleteItem,
  toggleItemStatus,
  updateItem,
} from "@/features/items/requests"
import { Item, ItemInsert } from "@/domain/entities/item"

export const { useMut: useCreateItem } = makeMutation(() => {
  const queryClient = useQueryClient()

  return {
    mutationFn: createItem,
    mutationKey: itemsQueryKeys.create(),
    onSuccess: newItem => {
      toast.success("Item creado correctamente")
      queryClient.setQueryData(itemsQueryKeys.detail(newItem.id), newItem)

      queryClient.setQueryData(itemsQueryKeys.list(), (oldData: Item[]) => {
        return [newItem, ...(oldData || [])]
      })
    },
  }
})

export const { useMut: useUpdateItem } = makeMutation(() => {
  const queryClient = useQueryClient()

  return {
    mutationFn: ({ itemId, item }: { itemId: string; item: ItemInsert }) =>
      updateItem(itemId, item),
    onSuccess: (itemData, { itemId }) => {
      toast.success("Item actualizado correctamente")

      queryClient.setQueryData(itemsQueryKeys.detail(itemId), itemData)

      queryClient.setQueryData(
        itemsQueryKeys.list(),
        (oldData: Item[] | undefined) => {
          return oldData?.map(item => (item.id === itemId ? itemData : item))
        }
      )
    },
  }
})

export const { useMut: useDeleteItem } = makeMutation(() => {
  const queryClient = useQueryClient()

  return {
    mutationFn: deleteItem,
    mutationKey: itemsQueryKeys.delete(""),
    onSuccess: (_, itemId) => {
      toast.success("Item eliminado correctamente")

      // Remove the detail query cache
      queryClient.removeQueries({ queryKey: itemsQueryKeys.detail(itemId) })

      queryClient.setQueryData(
        itemsQueryKeys.list(),
        (oldData: Item[] | undefined) => {
          if (!oldData) return oldData
          return oldData.filter(item => item.id !== itemId)
        }
      )
    },
  }
})

export const { useMut: useToggleItemStatus } = makeMutation(() => {
  const queryClient = useQueryClient()

  return {
    mutationFn: (itemId: string) => toggleItemStatus(itemId),
    mutationKey: itemsQueryKeys.toggleStatus(""),
    onSuccess: (itemData, itemId) => {
      queryClient.setQueryData(itemsQueryKeys.detail(itemId), itemData)

      queryClient.setQueryData(
        itemsQueryKeys.list(),
        (oldData: Item[] | undefined) => {
          if (!oldData) return oldData
          return oldData.map(item => (item.id === itemId ? itemData : item))
        }
      )
    },
  }
})
