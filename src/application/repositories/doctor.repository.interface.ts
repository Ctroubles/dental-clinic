import { Doctor, DoctorInsert } from "@/domain/entities/doctor"
import { IBaseRepository } from "./base.repository.interface"

export type DoctorsFilters = {
  search?: string | null
  gender?: "M" | "F" | null
}

export interface IDoctorRepository
  extends IBaseRepository<Doctor, DoctorInsert, DoctorsFilters> {
  findByUserId(userId: string): Promise<Doctor | null>
  delete(id: Doctor["id"]): Promise<void>
}
