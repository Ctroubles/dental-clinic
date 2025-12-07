import { NotFoundError, ValidationError } from "@/application/errors"
import { IItemRepository } from "@/application/repositories/item.repository.interface"
import { Item, ItemInsert } from "@/domain/entities/item"

export type IUpdateItemUseCase = ReturnType<typeof updateItemUseCase>

export const updateItemUseCase =
  (itemRepository: IItemRepository) =>
  async (
    { id, data }: { id: string; data: ItemInsert },
    userId: string
  ): Promise<Item> => {
    const existingItem = await itemRepository.findById(id)

    if (!existingItem) {
      throw new NotFoundError(`Item con id ${id} no encontrado`)
    }

    // Check if code is being changed and if new code already exists
    if (data.code !== existingItem.code) {
      const itemWithSameCode = await itemRepository.findByCode(data.code)
      if (itemWithSameCode) {
        throw new ValidationError(
          `Ya existe un item con el código ${data.code}`
        )
      }
    }

    const result = await itemRepository.update(id, data, userId)
    if (!result) {
      throw new NotFoundError(`Item con id ${id} no encontrado`)
    }
    return result
  }
