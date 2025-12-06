import { IVisitRepository } from "@/application/repositories/visit.repository.interface"
import { Visit, VisitInsert } from "@/domain/entities/visit"

export type ICreateVisitUseCase = ReturnType<typeof createVisitUseCase>

export const createVisitUseCase =
  (visitRepository: IVisitRepository) =>
  async (
    input: {
      newVisit: VisitInsert
    },
    userId: string
  ): Promise<Visit> => {
    const visit = await visitRepository.create(input.newVisit, userId)
    return visit
  }
