import { NotFoundError } from "@/application/errors"
import { IItemRepository } from "@/application/repositories/item.repository.interface"
import { Item } from "@/domain/entities/item"

export type IGetItemUseCase = ReturnType<typeof getItemUseCase>

export const getItemUseCase =
  (itemRepository: IItemRepository) =>
  async (itemId: string): Promise<Item> => {
    const item = await itemRepository.findById(itemId)

    if (!item) {
      throw new NotFoundError(`Item with id ${itemId} not found`)
    }

    return item
  }
