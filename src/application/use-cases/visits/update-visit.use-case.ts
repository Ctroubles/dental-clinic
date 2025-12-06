import { IVisitRepository } from "@/application/repositories/visit.repository.interface"
import { Visit } from "@/domain/entities/visit"

export type IUpdateVisitUseCase = ReturnType<typeof updateVisitUseCase>

export const updateVisitUseCase =
  (visitRepository: IVisitRepository) =>
  async (input: { visit: Visit }, userId: string): Promise<Visit | null> => {
    const updatedVisit = await visitRepository.update({
      ...input.visit,
      updatedBy: userId,
    })
    return updatedVisit
  }
