import { Patient, PatientInsert } from "@/domain/entities/patient"
import { IBaseRepository } from "./base.repository.interface"

export type PatientsFilters = {
  search?: string | null
  gender?: "M" | "F" | null
  dni?: string | null
}

export interface IPatientRepository
  extends IBaseRepository<Patient, PatientInsert, PatientsFilters> {
  findByDni(dni: Patient["dni"]): Promise<Patient | null>
  delete(id: Patient["id"]): Promise<void>
}
