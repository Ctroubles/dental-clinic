import {
  createLoader,
  createSerializer,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server"
import {
  ChargePaymentStatusEnum,
  ChargeProgressStatusEnum,
  ItemTypeEnum,
} from "@/domain/enums"

export const cargoParserFilters = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(10),
  search: parseAsString,
  paymentStatus: parseAsArrayOf(
    parseAsStringEnum(ChargePaymentStatusEnum.options)
  ),
  progressStatus: parseAsArrayOf(
    parseAsStringEnum(ChargeProgressStatusEnum.options)
  ),
  patientId: parseAsString,
  doctorId: parseAsString,
  itemId: parseAsString,
  type: parseAsArrayOf(parseAsStringEnum(ItemTypeEnum.options)),
}

export const loadCargoFilters = createLoader(cargoParserFilters)

export const serializeCargoFilters = createSerializer(cargoParserFilters)
