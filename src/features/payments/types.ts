import { PaymentMethod } from "@/domain/enums"

export type PaymentsFilters = {
  search?: string
  patientId?: string
  doctorId?: string
  chargeId?: string
  visitId?: string
  method?: PaymentMethod
}
