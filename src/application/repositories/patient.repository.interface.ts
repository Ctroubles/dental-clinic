import { Patient, PatientInsert } from "@/domain/entities/patient"
import { IBaseRepository } from "./base.repository.interface"

export type PatientsFilters = {
  search?: string | null
  gender?: "M" | "F" | null
}

export interface IPatientRepository
  extends IBaseRepository<Patient, PatientsFilters> {
  findByDni(dni: Patient["dni"]): Promise<Patient | null>
  create(patient: PatientInsert, createdBy: string): Promise<Patient>
  update(patient: Patient): Promise<Patient | null>
  delete(id: Patient["id"]): Promise<void>
}
