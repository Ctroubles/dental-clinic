import { NotFoundError } from "@/application/errors"
import { IItemRepository } from "@/application/repositories/item.repository.interface"
import { Item } from "@/domain/entities/item"

export type IToggleItemStatusUseCase = ReturnType<
  typeof toggleItemStatusUseCase
>

export const toggleItemStatusUseCase =
  (itemRepository: IItemRepository) =>
  async ({ itemId }: { itemId: string }, userId: string): Promise<Item> => {
    console.log("[toggleItemStatusUseCase] itemId", itemId)
    const existingItem = await itemRepository.findById(itemId)

    console.log("[toggleItemStatusUseCase] foundItem", existingItem)
    if (!existingItem) {
      console.log("[toggleItemStatusUseCase] Item not found", itemId)
      throw new NotFoundError(`Item with id ${itemId} not found`)
    }

    const itemToUpdate: Item = {
      ...existingItem,
      isActive: !existingItem.isActive,
      updatedBy: userId,
      updatedAt: new Date(),
    }

    const result = await itemRepository.update(itemToUpdate)
    console.log("[toggleItemStatusUseCase] result", result)
    if (!result) {
      throw new NotFoundError(`Item with id ${itemId} not found`)
    }
    console.log("[toggleItemStatusUseCase] returning result", result)
    return result
  }
