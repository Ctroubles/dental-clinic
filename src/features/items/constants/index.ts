import { type ItemType, ItemTypeEnum } from "@/domain/enums"

export * from "./request-keys"

export const ITEM_TYPES_OPTIONS: { label: string; value: ItemType }[] = [
  {
    label: "Producto",
    value: ItemTypeEnum.Values.product,
  },
  {
    label: "Servicio",
    value: ItemTypeEnum.Values.service,
  },
]
