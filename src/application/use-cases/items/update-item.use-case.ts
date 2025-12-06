import { NotFoundError } from "@/application/errors"
import { IItemRepository } from "@/application/repositories/item.repository.interface"
import { Item, ItemInsert } from "@/domain/entities/item"

export type IUpdateItemUseCase = ReturnType<typeof updateItemUseCase>

export const updateItemUseCase =
  (itemRepository: IItemRepository) =>
  async (
    { itemId, updatedItem }: { itemId: string; updatedItem: ItemInsert },
    userId: string
  ): Promise<Item> => {
    const existingItem = await itemRepository.findById(itemId)

    if (!existingItem) {
      throw new NotFoundError(`Item with id ${itemId} not found`)
    }

    // Check if code is being changed and if new code already exists
    if (updatedItem.code !== existingItem.code) {
      const itemWithSameCode = await itemRepository.findByCode(updatedItem.code)
      if (itemWithSameCode) {
        throw new Error("Item with this code already exists")
      }
    }

    const itemToUpdate: Item = {
      ...existingItem,
      ...updatedItem,
      id: itemId,
      updatedBy: userId,
      updatedAt: new Date(),
    }

    const result = await itemRepository.update(itemToUpdate)
    if (!result) {
      throw new NotFoundError(`Item with id ${itemId} not found`)
    }
    return result
  }
