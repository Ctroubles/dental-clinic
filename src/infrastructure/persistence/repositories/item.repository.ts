import { Model, PopulateOptions } from "mongoose"
import { IPageableRequest } from "@/application/common/pagination"
import {
  IItemRepository,
  ItemsFilters,
} from "@/application/repositories/item.repository.interface"
import { Item, ItemInsert } from "@/domain/entities/item"
import { DatabaseOperationError } from "@/infrastructure/persistence/errors"
import {
  ItemDocument,
  ItemModel,
} from "@/infrastructure/persistence/mongoose/models"
import { mapItemDocumentsToEntities, mapItemDocumentToEntity } from "../mappers"
import { BaseRepository } from "./base.repository"

export class ItemRepository
  extends BaseRepository<Item, ItemDocument, ItemInsert, ItemsFilters>
  implements IItemRepository
{
  protected readonly model: Model<ItemDocument>
  protected readonly mapDocumentToEntity: (
    doc: ItemDocument | null
  ) => Item | null
  protected readonly mapDocumentsToEntities: (docs: ItemDocument[]) => Item[]

  constructor() {
    super()
    this.model = ItemModel
    this.mapDocumentToEntity = mapItemDocumentToEntity
    this.mapDocumentsToEntities = mapItemDocumentsToEntities
  }

  async getAll(filters?: ItemsFilters): Promise<Item[]> {
    const query = await this.buildQuery(filters)

    const items = await this.model.find(query).sort({ createdAt: -1 })

    return mapItemDocumentsToEntities(items)
  }

  protected async buildQuery(
    filters?: ItemsFilters
  ): Promise<Record<string, unknown>> {
    const query: Record<string, unknown> = {}

    if (filters?.type) {
      query.type = filters.type
    }

    if (filters?.isActive !== undefined) {
      query.isActive = filters.isActive
    }

    if (filters?.search) {
      const searchRegex = new RegExp(filters.search, "i")
      query.$or = [
        { code: searchRegex },
        { name: searchRegex },
        { description: searchRegex },
      ]
    }

    return query
  }

  protected getPopulateConfig(
    includes?: Array<keyof Item>
  ): (PopulateOptions | string)[] {
    return []
  }

  async findByCode(code: Item["code"]): Promise<Item | null> {
    const item = (await ItemModel.findOne({ code })) as ItemDocument | null
    return this.mapDocumentToEntity(item)
  }

  async findByType(type: Item["type"]): Promise<Item[]> {
    const items = await ItemModel.find({ type }).sort({ createdAt: -1 })
    return this.mapDocumentsToEntities(items)
  }

  async findActive(): Promise<Item[]> {
    const items = await ItemModel.find({ isActive: true }).sort({
      createdAt: -1,
    })
    return this.mapDocumentsToEntities(items)
  }

  // async update(item: Item): Promise<Item | null> {
  //   try {
  //     const itemData = {
  //       ...item,
  //       updatedBy: item.updatedBy,
  //     }
  //     const updatedItem = await ItemModel.findByIdAndUpdate(item.id, itemData)

  //     if (!updatedItem) {
  //       throw new DatabaseOperationError("Error updating item. Item not found")
  //     }

  //     return mapItemDocumentToEntity(updatedItem)
  //   } catch (error) {
  //     const errorMessage =
  //       error instanceof Error ? error.message : "Unknown error"
  //     throw new DatabaseOperationError(`Error updating Item: ${errorMessage}`)
  //   }
  // }

  async delete(id: Item["id"]): Promise<Item | null> {
    const deletedItem = await ItemModel.findByIdAndDelete(id)
    return mapItemDocumentToEntity(deletedItem)
  }
}
