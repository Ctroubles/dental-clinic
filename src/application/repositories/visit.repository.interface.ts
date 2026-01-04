import { Visit, VisitInsert } from "@/domain/entities/visit"
import { IBaseRepository } from "./base.repository.interface"

export type VisitsFilters = {
  search?: string | null
  patientId?: string | null
  doctorId?: string | null
}

export interface IVisitRepository
  extends IBaseRepository<Visit, VisitInsert, VisitsFilters> {
  findByPatientId(patientId: Visit["patientId"]): Promise<Visit[]>
  create(visit: VisitInsert, createdBy: string): Promise<Visit>
  delete(id: Visit["id"]): Promise<Visit | null>
}
