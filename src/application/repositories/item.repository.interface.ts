import { Item, ItemInsert } from "@/domain/entities/item"
import { ItemType } from "@/domain/enums"
import { IBaseRepository } from "./base.repository.interface"

export type ItemsFilters = {
  search?: string | null
  type?: ItemType | null
  isActive?: boolean | null
}

export interface IItemRepository extends IBaseRepository<Item, ItemsFilters> {
  findByCode(code: Item["code"]): Promise<Item | null>
  findByType(type: Item["type"]): Promise<Item[]>
  findActive(): Promise<Item[]>
  create(item: ItemInsert, createdBy: string): Promise<Item>
  update(item: Item): Promise<Item | null>
  delete(id: Item["id"]): Promise<Item | null>
  getAll(filters?: ItemsFilters): Promise<Item[]>
}
