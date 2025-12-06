import { ItemType } from "@/domain/enums"

export type ItemsFilters = {
  search?: string | null
  type?: ItemType | null
  isActive?: boolean | null
}
