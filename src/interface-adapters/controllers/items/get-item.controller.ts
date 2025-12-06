import { NotFoundError } from "@/application/errors"
import { IGetItemUseCase } from "@/application/use-cases/items/get-item.use-case"
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

export type IGetItemController = ReturnType<typeof getItemController>

export const getItemController =
  (getItemUseCase: IGetItemUseCase) =>
  async (itemId: string): Promise<DataResult<Item>> => {
    const item = await getItemUseCase(itemId)
    if (!item) {
      return DataResult.failure(
        new NotFoundError(`Item con ID ${itemId} no encontrado.`)
      )
    }
    return DataResult.success(presenter(item))
  }
