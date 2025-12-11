import { NotFoundError } from "@/application/errors"
import { IVisitRepository } from "@/application/repositories/visit.repository.interface"
import { Visit, VisitInsert } from "@/domain/entities/visit"

export type IUpdateVisitUseCase = ReturnType<typeof updateVisitUseCase>

export const updateVisitUseCase =
  (visitRepository: IVisitRepository) =>
  async (
    input: { id: string; data: VisitInsert },
    userId: string
  ): Promise<Visit | null> => {
    const updatedVisit = await visitRepository.update(
      input.id,
      input.data,
      userId
    )

    if (!updatedVisit) {
      throw new NotFoundError(`Visita con id ${input.id} no encontrada`)
    }

    return updatedVisit
  }
