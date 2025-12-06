import { NotFoundError, ValidationError } from "@/application/errors"
import { IUpdateItemUseCase } from "@/application/use-cases/items/update-item.use-case"
import { Item, ItemInsert, itemInsertSchema } from "@/domain/entities/item"
import { DataResult } from "@/shared/result-handling/data-result"

function presenter(item: Item): Item {
  return {
    ...item,
    id: item.id.toString(),
    createdBy: item.createdBy.toString(),
    updatedBy: item.updatedBy?.toString(),
  }
}

export type IUpdateItemController = ReturnType<typeof updateItemController>

export const updateItemController =
  (updateItemUseCase: IUpdateItemUseCase) =>
  async (
    input: {
      itemId: string
      updatedItem: ItemInsert
    },
    userId: string
  ): Promise<DataResult<Item>> => {
    const { data, error: parseError } = itemInsertSchema.safeParse(
      input.updatedItem
    )
    if (parseError) {
      return DataResult.failure(new ValidationError(parseError))
    }
    const response = await updateItemUseCase(
      { itemId: input.itemId, updatedItem: data },
      userId
    )
    if (!response) {
      return DataResult.failure(
        new NotFoundError(`Item con ID ${input.itemId} no encontrado.`)
      )
    }
    return DataResult.success(presenter(response))
  }
