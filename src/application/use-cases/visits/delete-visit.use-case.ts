import { IVisitRepository } from "@/application/repositories/visit.repository.interface"
import { Visit } from "@/domain/entities/visit"

export type IDeleteVisitUseCase = ReturnType<typeof deleteVisitUseCase>

export const deleteVisitUseCase =
  (visitRepository: IVisitRepository) =>
  async (input: { visitId: string }): Promise<Visit | null> => {
    const deletedVisit = await visitRepository.delete(input.visitId)
    return deletedVisit
  }
