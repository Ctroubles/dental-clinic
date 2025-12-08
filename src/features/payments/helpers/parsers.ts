import {
  createLoader,
  createSerializer,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server"
import { PaymentMethodEnum } from "@/domain/enums"

export const paymentParserFilters = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(10),
  search: parseAsString,
  method: parseAsArrayOf(parseAsStringEnum(PaymentMethodEnum.options)),
  patientId: parseAsString,
  doctorId: parseAsString,
  chargeId: parseAsString,
  visitId: parseAsString,
}

export const loadPaymentFilters = createLoader(paymentParserFilters)

export const serializePaymentFilters = createSerializer(paymentParserFilters)
