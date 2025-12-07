import { NotFoundError } from "@/application/errors"
import { IItemRepository } from "@/application/repositories/item.repository.interface"
import { Item } from "@/domain/entities/item"

export type IToggleItemStatusUseCase = ReturnType<
  typeof toggleItemStatusUseCase
>

export const toggleItemStatusUseCase =
  (itemRepository: IItemRepository) =>
  async ({ itemId }: { itemId: string }, userId: string): Promise<Item> => {
    const existingItem = await itemRepository.findById(itemId)

    if (!existingItem) {
      throw new NotFoundError(`Item con id ${itemId} no encontrado`)
    }

    const itemToUpdate: Item = {
      ...existingItem,
      isActive: !existingItem.isActive,
      updatedBy: userId,
      updatedAt: new Date(),
    }

    const result = await itemRepository.update(itemId, itemToUpdate, userId)
    if (!result) {
      throw new NotFoundError(`Item con id ${itemId} no encontrado`)
    }
    return result
  }
