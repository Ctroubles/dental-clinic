import { IVisitRepository } from "@/application/repositories/visit.repository.interface"
import { Visit } from "@/domain/entities/visit"

export type IGetVisitByIdUseCase = ReturnType<typeof getVisitByIdUseCase>

export const getVisitByIdUseCase =
  (visitRepository: IVisitRepository) =>
  async (input: { visitId: string }): Promise<Visit | null> => {
    const visit = await visitRepository.findById(input.visitId)
    return visit
  }
