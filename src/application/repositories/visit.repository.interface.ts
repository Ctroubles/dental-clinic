import { Visit, VisitInsert } from "@/domain/entities/visit"
import { IBaseRepository } from "./base.repository.interface"
import { PersistenceSession } from "./persistence-session.interface"

export type VisitsFilters = {
  search?: string | null
  patientId?: string | null
  doctorId?: string | null
}

export interface IVisitRepository
  extends IBaseRepository<Visit, VisitsFilters> {
  findById(id: Visit["id"], session?: PersistenceSession): Promise<Visit | null>
  findByPatientId(patientId: Visit["patientId"]): Promise<Visit[]>
  create(visit: VisitInsert, createdBy: string): Promise<Visit>
  update(visit: Visit): Promise<Visit>
  delete(id: Visit["id"]): Promise<Visit | null>
}
