import { createModule } from "@evyweb/ioctopus"
import { createItemUseCase } from "@/application/use-cases/items/create-item.use-case"
import { deleteItemUseCase } from "@/application/use-cases/items/delete-item.use-case"
import { getItemUseCase } from "@/application/use-cases/items/get-item.use-case"
import { getItemsUseCase } from "@/application/use-cases/items/get-items.use-case"
import { toggleItemStatusUseCase } from "@/application/use-cases/items/toggle-item-status.use-case"
import { updateItemUseCase } from "@/application/use-cases/items/update-item.use-case"
import { ItemRepository } from "@/infrastructure/persistence/repositories/item.repository"
import { createItemController } from "@/interface-adapters/controllers/items/create-item.controller"
import { deleteItemController } from "@/interface-adapters/controllers/items/delete-item.controller"
import { getItemController } from "@/interface-adapters/controllers/items/get-item.controller"
import { getItemsController } from "@/interface-adapters/controllers/items/get-items.controller"
import { toggleItemStatusController } from "@/interface-adapters/controllers/items/toggle-item-status.controller"
import { updateItemController } from "@/interface-adapters/controllers/items/update-item.controller"
import { DI_SYMBOLS } from "../types"

export function createItemsModule() {
  const itemsModule = createModule()

  if (process.env.NODE_ENV === "test" && false) {
    // itemsModule.bind(DI_SYMBOLS.IItemRepository).toClass(MockItemRepository)
  } else {
    // Repositories
    itemsModule.bind(DI_SYMBOLS.IItemRepository).toClass(ItemRepository)

    // Use Cases
    itemsModule
      .bind(DI_SYMBOLS.ICreateItemUseCase)
      .toHigherOrderFunction(createItemUseCase, [DI_SYMBOLS.IItemRepository])

    itemsModule
      .bind(DI_SYMBOLS.IGetItemsUseCase)
      .toHigherOrderFunction(getItemsUseCase, [DI_SYMBOLS.IItemRepository])

    itemsModule
      .bind(DI_SYMBOLS.IGetItemUseCase)
      .toHigherOrderFunction(getItemUseCase, [DI_SYMBOLS.IItemRepository])

    itemsModule
      .bind(DI_SYMBOLS.IUpdateItemUseCase)
      .toHigherOrderFunction(updateItemUseCase, [DI_SYMBOLS.IItemRepository])

    itemsModule
      .bind(DI_SYMBOLS.IDeleteItemUseCase)
      .toHigherOrderFunction(deleteItemUseCase, [
        DI_SYMBOLS.IItemRepository,
        DI_SYMBOLS.ITrackedChargesRepository,
      ])

    itemsModule
      .bind(DI_SYMBOLS.IToggleItemStatusUseCase)
      .toHigherOrderFunction(toggleItemStatusUseCase, [
        DI_SYMBOLS.IItemRepository,
      ])

    // Controllers
    itemsModule
      .bind(DI_SYMBOLS.ICreateItemController)
      .toHigherOrderFunction(createItemController, [
        DI_SYMBOLS.ICreateItemUseCase,
      ])

    itemsModule
      .bind(DI_SYMBOLS.IGetItemsController)
      .toHigherOrderFunction(getItemsController, [DI_SYMBOLS.IGetItemsUseCase])

    itemsModule
      .bind(DI_SYMBOLS.IGetItemController)
      .toHigherOrderFunction(getItemController, [DI_SYMBOLS.IGetItemUseCase])

    itemsModule
      .bind(DI_SYMBOLS.IUpdateItemController)
      .toHigherOrderFunction(updateItemController, [
        DI_SYMBOLS.IUpdateItemUseCase,
      ])

    itemsModule
      .bind(DI_SYMBOLS.IDeleteItemController)
      .toHigherOrderFunction(deleteItemController, [
        DI_SYMBOLS.IDeleteItemUseCase,
      ])

    itemsModule
      .bind(DI_SYMBOLS.IToggleItemStatusController)
      .toHigherOrderFunction(toggleItemStatusController, [
        DI_SYMBOLS.IToggleItemStatusUseCase,
      ])
  }

  return itemsModule
}
