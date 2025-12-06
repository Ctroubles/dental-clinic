import {
  ChargePaymentStatus,
  ChargeProgressStatus,
  ItemType,
} from "@/domain/enums"

export type CargosFilters = {
  search?: string
  patientId?: string
  doctorId?: string
  itemId?: string
  type?: ItemType
  paymentStatus?: ChargePaymentStatus
  progressStatus?: ChargeProgressStatus
}
