import { NotFoundError } from "@/application/errors"
import { IItemRepository } from "@/application/repositories/item.repository.interface"
import { ITrackedChargesRepository } from "@/application/repositories/tracked-charges.repository.interface"
import { Item } from "@/domain/entities/item"

export type IDeleteItemUseCase = ReturnType<typeof deleteItemUseCase>

export const deleteItemUseCase =
  (
    itemRepository: IItemRepository,
    trackedChargesRepository: ITrackedChargesRepository
  ) =>
  async ({ itemId }: { itemId: string }): Promise<Item | null> => {
    const existingItem = await itemRepository.findById(itemId)

    if (!existingItem) {
      throw new NotFoundError(`Item with id ${itemId} not found`)
    }

    // TODO: Check if item is referenced by any tracked charges
    // If it is, throw an error
    // const trackedCharges = await trackedChargesRepository.findByItemId(
    //   existingItem.id
    // )
    // if (trackedCharges.length > 0) {
    //   throw new Error(
    //     "Item is referenced by tracked charges and cannot be deleted"
    //   )
    // }

    return await itemRepository.delete(itemId)
  }
