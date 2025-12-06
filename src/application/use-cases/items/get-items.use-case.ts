import { PageableResult } from "@/application/common/pagination"
import { IPageableRequest } from "@/application/common/pagination"
import {
  IItemRepository,
  ItemsFilters,
} from "@/application/repositories/item.repository.interface"
import { Item } from "@/domain/entities/item"

export interface IGetItemsUseCaseInput extends IPageableRequest<ItemsFilters> {}

export type IGetItemsUseCase = ReturnType<typeof getItemsUseCase>

export const getItemsUseCase =
  (itemRepository: IItemRepository) =>
  async (input: IGetItemsUseCaseInput): Promise<PageableResult<Item>> => {
    const result = await itemRepository.findAll({
      page: input.page,
      pageSize: input.pageSize,
      filters: input.filters,
    })

    return result
  }
