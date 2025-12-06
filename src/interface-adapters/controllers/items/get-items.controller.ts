import { PageableResult } from "@/application/common/pagination"
import {
  IGetItemsUseCase,
  IGetItemsUseCaseInput,
} from "@/application/use-cases/items/get-items.use-case"
import { Item } from "@/domain/entities/item"
import { DataResult } from "@/shared/result-handling/data-result"

export type IGetItemsController = ReturnType<typeof getItemsController>

export const getItemsController =
  (getItemsUseCase: IGetItemsUseCase) =>
  async (
    input: IGetItemsUseCaseInput
  ): Promise<DataResult<PageableResult<Item>>> => {
    const result = await getItemsUseCase(input)
    return DataResult.success(result)
  }
