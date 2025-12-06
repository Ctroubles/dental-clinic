import { NotFoundError } from "@/application/errors"
import { IToggleItemStatusUseCase } from "@/application/use-cases/items/toggle-item-status.use-case"
import { Item } from "@/domain/entities/item"
import { DataResult } from "@/shared/result-handling/data-result"

function presenter(item: Item): Item {
  return {
    ...item,
    id: item.id.toString(),
    createdBy: item.createdBy.toString(),
    updatedBy: item.updatedBy?.toString(),
  }
}

export type IToggleItemStatusController = ReturnType<
  typeof toggleItemStatusController
>

export const toggleItemStatusController =
  (toggleItemStatusUseCase: IToggleItemStatusUseCase) =>
  async (itemId: string, userId: string): Promise<DataResult<Item>> => {
    const item = await toggleItemStatusUseCase({ itemId }, userId)
    if (!item) {
      return DataResult.failure(
        new NotFoundError(`Item con ID ${itemId} no encontrado.`)
      )
    }
    return DataResult.success(presenter(item))
  }
