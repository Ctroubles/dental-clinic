import { PaymentMethodEnum } from "@/domain/enums";
import {
  createLoader,
  createSerializer,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";

export const paymentParserFilters = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(10),
  method: parseAsArrayOf(parseAsStringEnum(PaymentMethodEnum.options)),
  search: parseAsString,
  patientId: parseAsString,
  doctorId: parseAsString,
  chargeId: parseAsString,
  visitId: parseAsString,
}

export const loadPaymentFilters = createLoader(paymentParserFilters)

export const serializePaymentFilters = createSerializer(paymentParserFilters);
