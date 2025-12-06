import { ValidationError } from "@/application/errors"
import { IItemRepository } from "@/application/repositories/item.repository.interface"
import { Item, ItemInsert } from "@/domain/entities/item"

export type ICreateItemUseCase = ReturnType<typeof createItemUseCase>

export const createItemUseCase =
  (itemRepository: IItemRepository) =>
  async (
    input: {
      newItem: ItemInsert
    },
    userId: string
  ): Promise<Item> => {
    const existingItem = await itemRepository.findByCode(input.newItem.code)

    if (existingItem) {
      throw new ValidationError(
        `El item con el código "${input.newItem.code}" ya existe.`
      )
    }

    const item = await itemRepository.create(input.newItem, userId)
    return item
  }
