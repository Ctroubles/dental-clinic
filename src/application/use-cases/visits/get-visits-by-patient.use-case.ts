import { IVisitRepository } from "@/application/repositories/visit.repository.interface"
import { Visit } from "@/domain/entities/visit"

export type IGetVisitsByPatientUseCase = ReturnType<
  typeof getVisitsByPatientUseCase
>

export const getVisitsByPatientUseCase =
  (visitRepository: IVisitRepository) =>
  async (input: { patientId: string }): Promise<Visit[]> => {
    const visits = await visitRepository.findByPatientId(input.patientId)
    return visits
  }
