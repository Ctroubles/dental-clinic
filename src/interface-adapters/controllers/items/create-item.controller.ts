import { ValidationError } from "@/application/errors"
import { ICreateItemUseCase } from "@/application/use-cases/items/create-item.use-case"
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

export type ICreateItemController = ReturnType<typeof createItemController>

export const createItemController =
  (createItemUseCase: ICreateItemUseCase) =>
  async (
    input: {
      newItem: ItemInsert
    },
    userId: string
  ): Promise<DataResult<Item>> => {
    const { data, error: parseError } = itemInsertSchema.safeParse(
      input.newItem
    )
    if (parseError) {
      return DataResult.failure(new ValidationError(parseError))
    }
    const response = await createItemUseCase({ newItem: data }, userId)
    return DataResult.success(presenter(response))
  }
