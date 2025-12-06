import { NotFoundError } from "@/application/errors"
import { IDeleteItemUseCase } from "@/application/use-cases/items/delete-item.use-case"
import { DataResult } from "@/shared/result-handling/data-result"

export type IDeleteItemController = ReturnType<typeof deleteItemController>

export const deleteItemController =
  (deleteItemUseCase: IDeleteItemUseCase) =>
  async (itemId: string): Promise<DataResult<void>> => {
    const deletedItem = await deleteItemUseCase({ itemId })
    if (!deletedItem) {
      return DataResult.failure(
        new NotFoundError(`Item con ID ${itemId} no encontrado.`)
      )
    }
    return DataResult.success(null)
  }
